import { useState, useCallback, useRef, useEffect } from 'react';
import type { CanvasTransform } from '../types/note';

const MIN_SCALE = 0.2;
const MAX_SCALE = 3.0;
const STORAGE_KEY = 'screenstickynote_canvas_transform';

function getStoredTransform(initialScale: number): CanvasTransform {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (typeof parsed.x === 'number' && typeof parsed.y === 'number' && typeof parsed.scale === 'number') {
                return parsed;
            }
        }
    } catch {
        // Fallback to default if localStorage fails
    }
    return { x: 0, y: 0, scale: initialScale };
}

export function useCanvasPanZoom(initialScale = 1.0) {
    const [transform, setTransform] = useState<CanvasTransform>(() => getStoredTransform(initialScale));

    // Persist transform position to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transform));
        } catch {
            // Ignore quota errors
        }
    }, [transform]);

    const isPanningRef = useRef(false);
    const isSpacePressedRef = useRef(false);
    const startPointRef = useRef({ x: 0, y: 0 });

    // Handle Spacebar key state
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) && !(e.target as HTMLElement).isContentEditable) {
                if (!isSpacePressedRef.current) {
                    isSpacePressedRef.current = true;
                    document.body.style.cursor = 'grab';
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpacePressedRef.current = false;
                if (!isPanningRef.current) {
                    document.body.style.cursor = 'default';
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Zooming with Wheel
    const handleWheel = useCallback((e: WheelEvent | React.WheelEvent) => {
        // Allow native scrolling when hovering inside sticky note content areas or scrollbars unless Ctrl is held
        const target = e.target as HTMLElement;
        if (target.closest('.note-content-editable') || target.closest('.custom-scrollbar')) {
            if (!e.ctrlKey && !e.metaKey) {
                return; // Do not prevent default or zoom, let browser handle the vertical scroll
            }
        }

        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;

        setTransform((prev) => {
            const newScale = Math.min(Math.max(prev.scale * zoomFactor, MIN_SCALE), MAX_SCALE);

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
            const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);

            return {
                x: Math.round(newX),
                y: Math.round(newY),
                scale: Number(newScale.toFixed(3)),
            };
        });
    }, []);

    // Start Panning
    const startPan = useCallback((clientX: number, clientY: number, button: number) => {
        if (button === 0) {
            isPanningRef.current = true;
            startPointRef.current = { x: clientX - transform.x, y: clientY - transform.y };
            document.body.style.cursor = 'grabbing';
            return true;
        }
        return false;
    }, [transform.x, transform.y]);

    // Execute Panning
    const doPan = useCallback((clientX: number, clientY: number) => {
        if (!isPanningRef.current) return false;

        setTransform((prev) => ({
            ...prev,
            x: Math.round(clientX - startPointRef.current.x),
            y: Math.round(clientY - startPointRef.current.y),
        }));
        return true;
    }, []);

    // End Panning
    const endPan = useCallback(() => {
        if (isPanningRef.current) {
            isPanningRef.current = false;
            document.body.style.cursor = isSpacePressedRef.current ? 'grab' : 'default';
            return true;
        }
        return false;
    }, []);

    // Zoom In / Out Helper (Scales relative to screen center)
    const zoomIn = useCallback(() => {
        setTransform((prev) => {
            const newScale = Math.min(prev.scale * 1.2, MAX_SCALE);
            if (newScale === prev.scale) return prev;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const newX = centerX - (centerX - prev.x) * (newScale / prev.scale);
            const newY = centerY - (centerY - prev.y) * (newScale / prev.scale);

            return {
                x: Math.round(newX),
                y: Math.round(newY),
                scale: Number(newScale.toFixed(3)),
            };
        });
    }, []);

    const zoomOut = useCallback(() => {
        setTransform((prev) => {
            const newScale = Math.max(prev.scale * 0.8, MIN_SCALE);
            if (newScale === prev.scale) return prev;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const newX = centerX - (centerX - prev.x) * (newScale / prev.scale);
            const newY = centerY - (centerY - prev.y) * (newScale / prev.scale);

            return {
                x: Math.round(newX),
                y: Math.round(newY),
                scale: Number(newScale.toFixed(3)),
            };
        });
    }, []);

    const resetZoom = useCallback(() => {
        setTransform({ x: 0, y: 0, scale: 1.0 });
    }, []);

    // Pinch-to-zoom and Touch Panning refs
    const touchStateRef = useRef<{
        type: 'none' | 'pan' | 'pinch';
        startX: number;
        startY: number;
        initialPinchDist: number;
        initialPinchScale: number;
        initialPinchCenter: { x: number, y: number };
        initialTransformX: number;
        initialTransformY: number;
    }>({
        type: 'none',
        startX: 0,
        startY: 0,
        initialPinchDist: 0,
        initialPinchScale: 1,
        initialPinchCenter: { x: 0, y: 0 },
        initialTransformX: 0,
        initialTransformY: 0,
    });

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length === 1) {
            // One finger: Pan
            touchStateRef.current = {
                ...touchStateRef.current,
                type: 'pan',
                startX: e.touches[0].clientX - transform.x,
                startY: e.touches[0].clientY - transform.y,
            };
        } else if (e.touches.length === 2) {
            // Two fingers: Pinch zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);

            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            touchStateRef.current = {
                ...touchStateRef.current,
                type: 'pinch',
                initialPinchDist: dist,
                initialPinchScale: transform.scale,
                initialPinchCenter: { x: centerX, y: centerY },
                initialTransformX: transform.x,
                initialTransformY: transform.y,
            };
        }
    }, [transform.x, transform.y, transform.scale]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        const state = touchStateRef.current;
        if (state.type === 'pan' && e.touches.length === 1) {
            setTransform(prev => ({
                ...prev,
                x: Math.round(e.touches[0].clientX - state.startX),
                y: Math.round(e.touches[0].clientY - state.startY),
            }));
        } else if (state.type === 'pinch' && e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);

            if (state.initialPinchDist > 0) {
                const scaleRatio = dist / state.initialPinchDist;

                setTransform(() => {
                    const newScale = Math.min(Math.max(state.initialPinchScale * scaleRatio, MIN_SCALE), MAX_SCALE);

                    const centerX = state.initialPinchCenter.x;
                    const centerY = state.initialPinchCenter.y;

                    // Also support panning while zooming by calculating the delta of the pinch center
                    const currentCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    const currentCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                    const newX = currentCenterX - (centerX - state.initialTransformX) * (newScale / state.initialPinchScale);
                    const newY = currentCenterY - (centerY - state.initialTransformY) * (newScale / state.initialPinchScale);

                    return {
                        x: Math.round(newX),
                        y: Math.round(newY),
                        scale: Number(newScale.toFixed(3)),
                    };
                });
            }
        }
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (e.touches.length === 0) {
            touchStateRef.current.type = 'none';
        } else if (e.touches.length === 1) {
            // Revert back to panning with the remaining finger
            setTransform(prev => {
                touchStateRef.current = {
                    ...touchStateRef.current,
                    type: 'pan',
                    startX: e.touches[0].clientX - prev.x,
                    startY: e.touches[0].clientY - prev.y,
                };
                return prev;
            });
        }
    }, [setTransform]);

    return {
        transform,
        setTransform,
        isSpacePressed: isSpacePressedRef.current,
        handleWheel,
        startPan,
        doPan,
        endPan,
        zoomIn,
        zoomOut,
        resetZoom,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}

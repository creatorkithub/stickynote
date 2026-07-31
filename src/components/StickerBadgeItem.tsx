import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CanvasSticker } from '../types/sticker';
import { BADGE_DEFINITIONS } from '../types/sticker';

interface StickerBadgeItemProps {
    sticker: CanvasSticker;
    canvasScale: number;
    isSelected?: boolean;
    onUpdateSpatial: (id: number, updates: { x: number; y: number }) => void;
    onDelete: (id: number) => void;
    onBringToFront: (id: number) => void;
}

export const StickerBadgeItem: React.FC<StickerBadgeItemProps> = ({
    sticker,
    canvasScale,
    isSelected = false,
    onUpdateSpatial,
    onDelete,
    onBringToFront,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localPos, setLocalPos] = useState({ x: sticker.x, y: sticker.y });
    const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
    const stickerRef = useRef<HTMLDivElement>(null);

    const prevPropPosRef = useRef({ x: sticker.x, y: sticker.y });
    const isDraggingRef = useRef(isDragging);
    isDraggingRef.current = isDragging;

    // Sync local state when persisted props update from external sources
    useEffect(() => {
        if (sticker.x !== prevPropPosRef.current.x || sticker.y !== prevPropPosRef.current.y) {
            prevPropPosRef.current = { x: sticker.x, y: sticker.y };
            if (!isDraggingRef.current) {
                setLocalPos({ x: sticker.x, y: sticker.y });
            }
        }
    }, [sticker.x, sticker.y]);

    const rAFRef = useRef<number | null>(null);
    const currentPosRef = useRef({ x: sticker.x, y: sticker.y });

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        onBringToFront(sticker.id!);

        const startX = sticker.x;
        const startY = sticker.y;
        currentPosRef.current = { x: startX, y: startY };
        setLocalPos({ x: startX, y: startY });
        setIsDragging(true);

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        dragStartRef.current = {
            mouseX: clientX,
            mouseY: clientY,
            startX: startX,
            startY: startY,
        };
    };

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !dragStartRef.current) return;
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        const deltaX = (clientX - dragStartRef.current.mouseX) / canvasScale;
        const deltaY = (clientY - dragStartRef.current.mouseY) / canvasScale;

        const newX = Math.round(dragStartRef.current.startX + deltaX);
        const newY = Math.round(dragStartRef.current.startY + deltaY);

        currentPosRef.current = { x: newX, y: newY };

        if (rAFRef.current === null) {
            rAFRef.current = requestAnimationFrame(() => {
                rAFRef.current = null;
                setLocalPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });
            });
        }
    }, [isDragging, canvasScale]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        if (rAFRef.current !== null) {
            cancelAnimationFrame(rAFRef.current);
            rAFRef.current = null;
        }
        setIsDragging(false);
        dragStartRef.current = null;
        setLocalPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });
        prevPropPosRef.current = { x: currentPosRef.current.x, y: currentPosRef.current.y };
        onUpdateSpatial(sticker.id!, { x: currentPosRef.current.x, y: currentPosRef.current.y });
    }, [isDragging, onUpdateSpatial, sticker.id]);

    // Stable Listener References
    const dragMoveRef = useRef(handleDragMove);
    dragMoveRef.current = handleDragMove;
    const dragEndRef = useRef(handleDragEnd);
    dragEndRef.current = handleDragEnd;

    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => dragMoveRef.current(e);
        const onEnd = () => dragEndRef.current();

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, [isDragging]);

    const definition = BADGE_DEFINITIONS[sticker.badgeType] || BADGE_DEFINITIONS['check'];
    const currentX = localPos.x;
    const currentY = localPos.y;
    const size = sticker.size || 58;

    return (
        <div
            ref={stickerRef}
            onClick={(e) => {
                e.stopPropagation();
                onBringToFront(sticker.id!);
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`absolute top-0 left-0 group cursor-move select-none rounded-full transition-shadow ${isSelected ? 'ring-4 ring-indigo-500/90 ring-offset-2 ring-offset-slate-900/60 shadow-2xl shadow-indigo-500/40 z-40' : ''
                }`}
            style={{
                transform: `translate(${Math.round(currentX)}px, ${Math.round(currentY)}px) rotate(${sticker.rotation}deg)`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: sticker.zIndex,
                willChange: isDragging ? 'transform' : 'auto',
                transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
            }}
        >
            {/* Skeuomorphic 3D Circular Sticker Frame */}
            <div
                className={`relative w-full h-full rounded-full flex items-center justify-center border-4 border-white ${isDragging ? '' : 'transition-transform group-hover:scale-105'
                    }`}
                style={{
                    backgroundColor: definition.bgHex,
                    boxShadow: isDragging
                        ? '0 12px 24px rgba(0,0,0,0.35), 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 0 rgba(0,0,0,0.18)'
                        : '0 4px 12px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12), inset 0 -3px 0 rgba(0,0,0,0.15)',
                }}
            >
                {/* SVG Badge Icon */}
                {definition.isArrow ? (
                    <svg
                        className="w-3/4 h-3/4 drop-shadow-sm"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={definition.textHex}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d={definition.iconSvg} />
                    </svg>
                ) : (
                    <svg
                        className="w-3/5 h-3/5 drop-shadow-sm"
                        viewBox="0 0 24 24"
                        fill={definition.textHex}
                    >
                        <path d={definition.iconSvg} />
                    </svg>
                )}

                {/* Quick Delete Badge Button on Hover */}
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(sticker.id!);
                    }}
                    title="Delete Sticker"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900/90 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md cursor-pointer z-10"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

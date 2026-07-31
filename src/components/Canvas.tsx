import React, { useRef, useEffect } from 'react';
import { StickyNote } from './StickyNote';
import { StickerBadgeItem } from './StickerBadgeItem';
import type { StickyNote as StickyNoteType, CanvasTransform } from '../types/note';
import type { CanvasSticker } from '../types/sticker';
import { Plus, HelpCircle, Sparkles } from 'lucide-react';

interface CanvasProps {
    notes: StickyNoteType[];
    stickers: CanvasSticker[];
    transform: CanvasTransform;
    onWheel: (e: WheelEvent) => void;
    onStartPan: (x: number, y: number, button: number) => boolean;
    onDoPan: (x: number, y: number) => boolean;
    onEndPan: () => boolean;
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onUpdateSpatial: (id: number, spatial: Partial<StickyNoteType>) => void;
    onUpdateText: (id: number, content: { text: string; richTextHtml: string }) => void;
    onUpdateImmediate: (id: number, changes: Partial<StickyNoteType>) => void;
    onDelete: (id: number) => void;
    onBringToFront: (id: number) => void;
    onAddNoteAtPosition: (x: number, y: number) => void;
    onUpdateStickerSpatial: (id: number, spatial: { x: number; y: number }) => void;
    onDeleteSticker: (id: number) => void;
    onBringStickerToFront: (id: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
    notes,
    stickers,
    transform,
    onWheel,
    onStartPan,
    onDoPan,
    onEndPan,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onUpdateSpatial,
    onUpdateText,
    onUpdateImmediate,
    onDelete,
    onBringToFront,
    onAddNoteAtPosition,
    onUpdateStickerSpatial,
    onDeleteSticker,
    onBringStickerToFront,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showShortcuts, setShowShortcuts] = React.useState(false);
    const [isMarqueeActive, setIsMarqueeActive] = React.useState(false);
    const marqueeStartRef = React.useRef({ x: 0, y: 0 });
    const [marqueeBox, setMarqueeBox] = React.useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

    const [selectedNoteIds, setSelectedNoteIds] = React.useState<Set<number>>(new Set());
    const [selectedStickerIds, setSelectedStickerIds] = React.useState<Set<number>>(new Set());

    // Attach non-passive wheel listener for smooth zoom preventDefault and touch listeners for pinch zooming
    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;

        const handleWheelEvent = (e: WheelEvent) => {
            onWheel(e);
        };

        const handleTouchStart = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.pointer-events-auto')) return;
            onTouchStart(e);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length >= 1) {
                // Prevent browser zooming/scrolling on mobile
                e.preventDefault();
            }

            const target = e.target as HTMLElement;
            if (target.closest('.pointer-events-auto')) return;

            onTouchMove(e);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            onTouchEnd(e);
        };

        el.addEventListener('wheel', handleWheelEvent, { passive: false });
        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: false });
        el.addEventListener('touchcancel', handleTouchEnd, { passive: false });

        return () => {
            el.removeEventListener('wheel', handleWheelEvent);
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
            el.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [onWheel, onTouchStart, onTouchMove, onTouchEnd]);

    const shortcutsRef = useRef<HTMLDivElement>(null);
    const helpButtonRef = useRef<HTMLButtonElement>(null);

    // Auto-dismiss shortcuts overlay when clicking outside or doing any canvas activity
    useEffect(() => {
        if (!showShortcuts) return;

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (
                shortcutsRef.current &&
                !shortcutsRef.current.contains(target) &&
                helpButtonRef.current &&
                !helpButtonRef.current.contains(target)
            ) {
                setShowShortcuts(false);
            }
        };

        window.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('touchstart', handleOutsideClick);

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [showShortcuts]);

    // Pointer Down (Pan vs Marquee Select vs Add Note)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (showShortcuts) setShowShortcuts(false);

        // Deselect all items if user clicks on the empty canvas background (left or right click)
        if (e.target === canvasRef.current) {
            if (selectedNoteIds.size > 0) setSelectedNoteIds(new Set());
            if (selectedStickerIds.size > 0) setSelectedStickerIds(new Set());
        }

        if (e.detail === 2 && e.target === canvasRef.current && e.button === 0) {
            const rect = canvasRef.current.getBoundingClientRect();
            const clickX = (e.clientX - rect.left - transform.x) / transform.scale;
            const clickY = (e.clientY - rect.top - transform.y) / transform.scale;
            onAddNoteAtPosition(Math.round(clickX), Math.round(clickY));
            return;
        }

        const panned = onStartPan(e.clientX, e.clientY, e.button);
        if (panned) return;

        // Start Marquee Select if clicking right mouse button (2) on empty canvas background
        if (e.button === 2 && e.target === canvasRef.current) {
            setIsMarqueeActive(true);
            marqueeStartRef.current = { x: e.clientX, y: e.clientY };
            setMarqueeBox({ startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        onDoPan(e.clientX, e.clientY);

        if (isMarqueeActive && canvasRef.current) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            setMarqueeBox({
                startX: marqueeStartRef.current.x,
                startY: marqueeStartRef.current.y,
                currentX,
                currentY,
            });

            // Calculate bounding box in canvas space
            const rect = canvasRef.current.getBoundingClientRect();
            const screenLeft = Math.min(marqueeStartRef.current.x, currentX);
            const screenTop = Math.min(marqueeStartRef.current.y, currentY);
            const screenRight = Math.max(marqueeStartRef.current.x, currentX);
            const screenBottom = Math.max(marqueeStartRef.current.y, currentY);

            const canvasLeft = (screenLeft - rect.left - transform.x) / transform.scale;
            const canvasTop = (screenTop - rect.top - transform.y) / transform.scale;
            const canvasRight = (screenRight - rect.left - transform.x) / transform.scale;
            const canvasBottom = (screenBottom - rect.top - transform.y) / transform.scale;

            // Strict containment notes (must be 100% inside selection box)
            const hitNotes = new Set<number>();
            notes.forEach((n) => {
                const nRight = n.x + n.width;
                const nBottom = n.y + n.height;
                if (n.x >= canvasLeft && nRight <= canvasRight && n.y >= canvasTop && nBottom <= canvasBottom) {
                    if (n.id !== undefined) hitNotes.add(n.id);
                }
            });

            // Strict containment stickers (must be 100% inside selection box)
            const hitStickers = new Set<number>();
            stickers.forEach((s) => {
                const sSize = s.size || 58;
                const sRight = s.x + sSize;
                const sBottom = s.y + sSize;
                if (s.x >= canvasLeft && sRight <= canvasRight && s.y >= canvasTop && sBottom <= canvasBottom) {
                    if (s.id !== undefined) hitStickers.add(s.id);
                }
            });

            setSelectedNoteIds(hitNotes);
            setSelectedStickerIds(hitStickers);
        }
    };

    const handleMouseUp = () => {
        onEndPan();
        if (isMarqueeActive) {
            setIsMarqueeActive(false);
            setMarqueeBox(null);
        }
    };

    return (
        <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => {
                if (e.target === canvasRef.current) e.preventDefault();
            }}
            style={{
                '--canvas-x': transform.x,
                '--canvas-y': transform.y,
                '--canvas-scale': transform.scale,
            } as React.CSSProperties}
            className="relative w-screen h-screen overflow-hidden infinite-canvas-bg cursor-default select-none"
        >
            {/* Translucent Marquee Drag Box */}
            {isMarqueeActive && marqueeBox && (
                <div
                    className="fixed border-2 border-indigo-400 bg-indigo-500/20 backdrop-blur-[1px] pointer-events-none z-50 rounded shadow-lg shadow-indigo-500/10"
                    style={{
                        left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
                        top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
                        width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
                        height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
                    }}
                />
            )}

            {/* Scaled Infinite Workspace Container */}
            <div
                style={{
                    transform: `translate(${Math.round(transform.x)}px, ${Math.round(transform.y)}px) scale(${transform.scale})`,
                    transformOrigin: '0 0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
                {/* Notes Layer */}
                {notes.map((note) => (
                    <div key={note.id} className="absolute top-0 left-0 pointer-events-auto">
                        <StickyNote
                            note={note}
                            canvasScale={transform.scale}
                            isSelected={note.id !== undefined && selectedNoteIds.has(note.id)}
                            onUpdateSpatial={onUpdateSpatial}
                            onUpdateText={onUpdateText}
                            onUpdateImmediate={onUpdateImmediate}
                            onDelete={onDelete}
                            onBringToFront={onBringToFront}
                        />
                    </div>
                ))}

                {/* Stickers & Badges Feedback Layer */}
                {stickers.map((sticker) => (
                    <div key={sticker.id} className="absolute top-0 left-0 pointer-events-auto">
                        <StickerBadgeItem
                            sticker={sticker}
                            canvasScale={transform.scale}
                            isSelected={sticker.id !== undefined && selectedStickerIds.has(sticker.id)}
                            onUpdateSpatial={onUpdateStickerSpatial}
                            onDelete={onDeleteSticker}
                            onBringToFront={onBringStickerToFront}
                        />
                    </div>
                ))}
            </div>

            {/* Empty State Overlay */}
            {notes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none text-slate-400">
                    <div className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-center pointer-events-auto shadow-2xl">
                        <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-bounce" />
                        <h3 className="text-base font-bold text-slate-200">Canvas is Empty</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-4">
                            Double-click anywhere or click button below to create your first 3D sticky note.
                        </p>
                        <button
                            onClick={() => onAddNoteAtPosition(200, 150)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform hover:scale-105 inline-flex items-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" /> Add Sticky Note
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Keyboard Shortcuts Trigger Button */}
            <button
                ref={helpButtonRef}
                onClick={() => setShowShortcuts(!showShortcuts)}
                title="Canvas Controls & Shortcuts"
                className="absolute bottom-4 left-4 z-40 p-1.5 sm:p-2.5 bg-slate-900/30 sm:bg-slate-900/90 text-slate-500 sm:text-slate-300 hover:text-amber-400 hover:bg-slate-900/90 rounded-2xl border border-slate-700/30 sm:border-slate-700/80 shadow-sm sm:shadow-lg backdrop-blur-sm sm:backdrop-blur-md transition-colors cursor-pointer active:scale-95"
            >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Shortcuts Modal */}
            {showShortcuts && (
                <div
                    ref={shortcutsRef}
                    className="absolute bottom-16 left-4 z-50 bg-slate-900/95 text-slate-100 p-4 rounded-2xl border border-slate-700 shadow-2xl w-72 backdrop-blur-md animate-fade-in pointer-events-auto"
                >
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Infinite Canvas Controls
                    </h4>
                    <ul className="text-xs space-y-2 text-slate-300 font-mono">
                        <li className="flex justify-between border-b border-slate-800 pb-1">
                            <span className="text-slate-400">Pan View:</span>
                            <span className="text-amber-300">Left Click & Drag</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-800 pb-1">
                            <span className="text-slate-400">Select Multiple:</span>
                            <span className="text-amber-300">Right Click & Drag</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-800 pb-1">
                            <span className="text-slate-400">Zoom In/Out:</span>
                            <span className="text-amber-300">Mouse Wheel Scroll</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-800 pb-1">
                            <span className="text-slate-400">Create Note:</span>
                            <span className="text-amber-300">Double Click Background</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-800 pb-1">
                            <span className="text-slate-400">Bring to Front:</span>
                            <span className="text-amber-300">Click Any Note</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

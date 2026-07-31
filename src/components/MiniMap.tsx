import React from 'react';
import { Map, Eye, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { StickyNote as StickyNoteType, CanvasTransform } from '../types/note';
import { COLOR_PROFILES } from '../constants/palettes';

interface MiniMapProps {
    notes: StickyNoteType[];
    transform: CanvasTransform;
    onNavigate: (x: number, y: number) => void;
    onResetView: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ notes, transform, onNavigate, onResetView, onZoomIn, onZoomOut }) => {
    const isDraggingRef = React.useRef(false);
    const mapRef = React.useRef<HTMLDivElement>(null);

    const minX = Math.min(-1000, ...notes.map(n => n.x - 200));
    const maxX = Math.max(2000, ...notes.map(n => n.x + n.width + 200));
    const minY = Math.min(-1000, ...notes.map(n => n.y - 200));
    const maxY = Math.max(2000, ...notes.map(n => n.y + n.height + 200));

    const mapWidth = Math.max(1, maxX - minX);
    const mapHeight = Math.max(1, maxY - minY);

    const MINI_WIDTH = 180;
    const MINI_HEIGHT = 120;

    const scaleX = MINI_WIDTH / mapWidth;
    const scaleY = MINI_HEIGHT / mapHeight;

    const viewportX = (-transform.x - minX) * scaleX;
    const viewportY = (-transform.y - minY) * scaleY;
    const viewportW = (window.innerWidth / transform.scale) * scaleX;
    const viewportH = (window.innerHeight / transform.scale) * scaleY;

    const navigateToMapClientPos = React.useCallback((clientX: number, clientY: number) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(MINI_WIDTH, clientX - rect.left));
        const clickY = Math.max(0, Math.min(MINI_HEIGHT, clientY - rect.top));

        const targetCanvasX = (clickX / scaleX) + minX;
        const targetCanvasY = (clickY / scaleY) + minY;

        const newX = Math.round((window.innerWidth / 2) - targetCanvasX * transform.scale);
        const newY = Math.round((window.innerHeight / 2) - targetCanvasY * transform.scale);

        onNavigate(newX, newY);
    }, [MINI_WIDTH, MINI_HEIGHT, scaleX, scaleY, minX, minY, transform.scale, onNavigate]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        isDraggingRef.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        navigateToMapClientPos(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        navigateToMapClientPos(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {
                // Ignore if capture released automatically
            }
        }
    };

    return (
        <div className="absolute bottom-4 right-4 z-40 flex flex-col items-end gap-1.5 text-slate-100 hidden sm:flex">
            {/* Bottom Right Floating Zoom Pill Bar */}
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/80 shadow-2xl">
                {onZoomOut && (
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onZoomOut();
                        }}
                        title="Zoom Out (-)"
                        className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                )}
                <span className="text-xs font-mono font-bold w-10 text-center text-amber-400 select-none">
                    {Math.round(transform.scale * 100)}%
                </span>
                {onZoomIn && (
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onZoomIn();
                        }}
                        title="Zoom In (+)"
                        className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onResetView();
                    }}
                    title="Reset View (100%)"
                    className="p-1 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors ml-0.5"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* MiniMap Container */}
            <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
                {/* Header: Compact Title & Note Count */}
                <div className="flex items-center justify-between px-1 mb-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <Map className="w-3 h-3 text-amber-400" /> Canvas Map
                    </span>
                    <span className="font-mono text-slate-500">{notes.length} notes</span>
                </div>

                {/* MiniMap Viewport Box */}
                <div
                    ref={mapRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ width: `${MINI_WIDTH}px`, height: `${MINI_HEIGHT}px` }}
                    className="relative bg-slate-950 rounded-lg border border-slate-800 overflow-hidden cursor-crosshair group touch-none select-none"
                >
                    {notes.map((note) => {
                        const profile = COLOR_PROFILES[note.color] || COLOR_PROFILES.canary;
                        const nx = (note.x - minX) * scaleX;
                        const ny = (note.y - minY) * scaleY;
                        const nw = Math.max(4, note.width * scaleX);
                        const nh = Math.max(3, note.height * scaleY);

                        return (
                            <div
                                key={note.id}
                                style={{
                                    transform: `translate3d(${Math.round(nx)}px, ${Math.round(ny)}px, 0)`,
                                    width: `${nw}px`,
                                    height: `${nh}px`,
                                    backgroundColor: profile.bgHex,
                                    borderColor: profile.borderHex,
                                }}
                                className="absolute top-0 left-0 rounded-[1px] border opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
                            />
                        );
                    })}

                    {/* Current Viewport Focus Box (GPU Accelerated translate3d) */}
                    <div
                        style={{
                            transform: `translate3d(${Math.round(viewportX)}px, ${Math.round(viewportY)}px, 0)`,
                            width: `${Math.min(MINI_WIDTH, viewportW)}px`,
                            height: `${Math.min(MINI_HEIGHT, viewportH)}px`,
                            willChange: 'transform',
                        }}
                        className="absolute top-0 left-0 border-2 border-amber-400/90 bg-amber-400/10 rounded shadow-sm pointer-events-none transition-transform duration-75 ease-out"
                    >
                        <Eye className="w-2.5 h-2.5 text-amber-400 absolute top-0.5 left-0.5 opacity-60" />
                    </div>

                    {/* Sleek Reset Button at Bottom Corner */}
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onResetView();
                        }}
                        title="Reset View to Default (Center & 100% Zoom)"
                        className="absolute bottom-1 right-1 z-20 flex items-center gap-1 px-1.5 py-0.5 bg-slate-900/95 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[9px] font-bold rounded border border-slate-700 hover:border-amber-400 backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-md opacity-85 group-hover:opacity-100"
                    >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { StickerBadgeType } from '../types/sticker';
import { BADGE_DEFINITIONS } from '../types/sticker';

interface StickersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSticker: (type: StickerBadgeType) => void;
}

export const StickersDrawer: React.FC<StickersDrawerProps> = ({
    isOpen,
    onClose,
    onAddSticker,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Auto-close panel when clicking anywhere outside
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (
                drawerRef.current &&
                !drawerRef.current.contains(target) &&
                !(target instanceof Element && target.closest('[data-stickers-btn]'))
            ) {
                onClose();
            }
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('touchstart', handleOutsideClick);
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Filter to standard 14 3D feedback badges
    const badgeList = Object.values(BADGE_DEFINITIONS).filter((b) => !b.isArrow);

    return (
        <div
            ref={drawerRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="fixed sm:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-16 sm:left-auto sm:right-6 sm:translate-x-0 sm:translate-y-0 z-[60] w-[calc(100vw-2rem)] max-w-sm sm:w-80 max-h-[85vh] bg-slate-900/95 backdrop-blur-md text-slate-100 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 sm:zoom-in-100 sm:slide-in-from-top-4"
        >
            {/* Header section matching user's design */}
            <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
                <div>
                    <h2 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-2">
                        <span className="text-xl">🏷️</span> Buttons and Badges
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        A selection of 3D stickers for giving feedback on the board.
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="group p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-center"
                    title="Close Panel"
                >
                    <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* Grid of 3D Feedback Stickers */}
            <div className="p-4 max-h-[380px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-3.5">
                    {badgeList.map((badge) => (
                        <button
                            key={badge.type}
                            onClick={() => {
                                onAddSticker(badge.type);
                                if (window.innerWidth < 1024) {
                                    onClose();
                                }
                            }}
                            className="group p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-500/80 transition-all flex items-center gap-3 text-left cursor-pointer active:scale-95 shadow-sm"
                        >
                            {/* 3D Circular Sticker Preview */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                                style={{
                                    backgroundColor: badge.bgHex,
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.25), inset 0 -2px 0 rgba(0,0,0,0.15)',
                                }}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={badge.textHex}>
                                    <path d={badge.iconSvg} />
                                </svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                    {badge.label}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">Click to add</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>💡 Click any badge to add it to canvas</span>
                <span className="text-amber-400 font-medium">{badgeList.length} Badges</span>
            </div>
        </div>
    );
};

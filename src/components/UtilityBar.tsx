import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus,
    Download,
    Upload,
    Search,
    Bell,
    BellOff,
    Sparkles,
    FileSpreadsheet,
    X,
    Filter,
    ChevronDown,
    Check,
    Undo2,
    Redo2,
    Menu
} from 'lucide-react';
import type { StickyNote as StickyNoteType, BackupPayload, ColorPaletteId } from '../types/note';
import { COLOR_LIST, COLOR_PROFILES } from '../constants/palettes';
import { db } from '../db/database';

interface UtilityBarProps {
    transform?: { x: number; y: number; scale: number };
    notes: StickyNoteType[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedColorFilter: ColorPaletteId | 'all';
    onFilterChange: (color: ColorPaletteId | 'all') => void;
    onAddNote: (color?: ColorPaletteId, customText?: string, customHtml?: string) => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onResetZoom?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onReloadNotes: () => void;
    notificationPermission: NotificationPermission;
    onRequestNotificationPermission: () => void;
    isAlarmEnabled: boolean;
    onToggleAlarm: () => void;
    isStickersOpen: boolean;
    onToggleStickers: () => void;
}

export const UtilityBar: React.FC<UtilityBarProps> = ({
    notes,
    searchQuery,
    onSearchChange,
    selectedColorFilter,
    onFilterChange,
    onAddNote,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    onReloadNotes,
    notificationPermission,
    onRequestNotificationPermission,
    isAlarmEnabled,
    onToggleAlarm,
    isStickersOpen,
    onToggleStickers,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const newNoteDropdownRef = useRef<HTMLDivElement>(null);
    const portalMenuRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const newNoteHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
    const [isPinnedOpen, setIsPinnedOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 68, left: 100 });
    const [newNotePos, setNewNotePos] = useState<{ top: number; left: number }>({ top: 68, left: 100 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        if (window.innerWidth < 1024) return;
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (filterDropdownRef.current) {
            const rect = filterDropdownRef.current.getBoundingClientRect();
            const leftPos = Math.max(12, Math.min(rect.left, window.innerWidth - 220));
            setDropdownPos({
                top: rect.bottom + 2,
                left: leftPos,
            });
        }
        setIsFilterOpen(true);
    };

    const handleMouseLeave = () => {
        if (window.innerWidth < 1024) return;
        if (isPinnedOpen) return; // Locked open when user clicks trigger button
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setIsFilterOpen(false);
        }, 500); // Generous 500ms buffer for hover transition
    };

    const handleNewNoteMouseEnter = () => {
        if (window.innerWidth < 1024) return;
        if (newNoteHoverTimeoutRef.current) {
            clearTimeout(newNoteHoverTimeoutRef.current);
            newNoteHoverTimeoutRef.current = null;
        }
        if (newNoteDropdownRef.current) {
            const rect = newNoteDropdownRef.current.getBoundingClientRect();
            setNewNotePos({
                top: rect.bottom + 2,
                left: Math.max(12, rect.left),
            });
        }
        setIsNewNoteOpen(true);
    };

    const handleNewNoteMouseLeave = () => {
        if (window.innerWidth < 1024) return;
        if (newNoteHoverTimeoutRef.current) {
            clearTimeout(newNoteHoverTimeoutRef.current);
        }
        newNoteHoverTimeoutRef.current = setTimeout(() => {
            setIsNewNoteOpen(false);
        }, 500);
    };

    const closeDropdown = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (newNoteHoverTimeoutRef.current) {
            clearTimeout(newNoteHoverTimeoutRef.current);
            newNoteHoverTimeoutRef.current = null;
        }
        setIsFilterOpen(false);
        setIsNewNoteOpen(false);
        setIsPinnedOpen(false);
        if (window.innerWidth >= 1024) {
            setIsMobileMenuOpen(false);
        }
    };

    // Update dropdown position when opened or resized
    useEffect(() => {
        if (isFilterOpen && filterDropdownRef.current) {
            const rect = filterDropdownRef.current.getBoundingClientRect();
            const leftPos = Math.max(12, Math.min(rect.left, window.innerWidth - 220));
            setDropdownPos({
                top: rect.bottom + 2,
                left: leftPos,
            });
        }
        if (isNewNoteOpen && newNoteDropdownRef.current) {
            const rect = newNoteDropdownRef.current.getBoundingClientRect();
            setNewNotePos({
                top: rect.bottom + 2,
                left: Math.max(12, rect.left),
            });
        }
    }, [isFilterOpen, isNewNoteOpen]);

    // Close filter dropdown when user clicks/taps outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const targetNode = e.target as Node;
            const isInsideFilter = filterDropdownRef.current?.contains(targetNode);
            const isInsideNewNote = newNoteDropdownRef.current?.contains(targetNode);
            const isInsidePortal = portalMenuRef.current?.contains(targetNode);

            if (!isInsideFilter && !isInsideNewNote && !isInsidePortal) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Download Local Backup (JSON Export)
    const handleExportBackup = async () => {
        try {
            const allNotes = await db.stickynotes.toArray();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            const payload: BackupPayload = {
                metadata: {
                    appName: 'Screen Stickynote',
                    appVersion: '1.0.0',
                    exportTimestamp: new Date().toISOString(),
                    noteCount: allNotes.length,
                },
                notes: allNotes,
            };

            const jsonString = JSON.stringify(payload, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `sticky-notes-backup-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to export backup: ' + (err as Error).message);
        }
    };

    // Upload/Sync Backup (JSON Import)
    const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const content = event.target?.result as string;
                const payload = JSON.parse(content) as BackupPayload;

                if (!payload || !Array.isArray(payload.notes)) {
                    throw new Error('Invalid JSON format: Missing "notes" array');
                }

                // Wipe current IndexedDB
                await db.stickynotes.clear();

                const safeNotes: StickyNoteType[] = payload.notes.map((n, idx) => ({
                    text: n.text || 'Imported Note',
                    richTextHtml: n.richTextHtml || n.text || 'Imported Note',
                    x: typeof n.x === 'number' ? n.x : 100 + (idx * 30),
                    y: typeof n.y === 'number' ? n.y : 100 + (idx * 30),
                    width: n.width || 300,
                    height: n.height || 250,
                    zIndex: n.zIndex || idx + 1,
                    color: n.color || 'canary',
                    rotation: typeof n.rotation === 'number' ? n.rotation : 0,
                    isPinned: !!n.isPinned,
                    reminderTime: n.reminderTime || null,
                    isReminderTriggered: false,
                    updatedAt: Date.now(),
                }));

                await db.stickynotes.bulkAdd(safeNotes);

                alert(`Successfully imported ${safeNotes.length} sticky notes!`);
                onReloadNotes();
            } catch (err) {
                alert('Failed to import backup: ' + (err as Error).message);
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    // Quick Templates
    const handleAddTodoTemplate = () => {
        onAddNote(
            'mint',
            "📋 Daily Sprint Checklist:\n[ ] Review code pull requests\n[ ] Update project documentation\n[ ] Standup team sync",
            "<h3><b>📋 Daily Sprint Checklist</b></h3><ul class=\"checklist-list\"><li><input type=\"checkbox\" /> <span>Review code pull requests</span></li><li><input type=\"checkbox\" /> <span>Update project documentation</span></li><li><input type=\"checkbox\" /> <span>Standup team sync</span></li></ul>"
        );
    };

    const handleAddQuickNote = () => {
        onAddNote(
            'sky',
            "💡 Quick Brainstorming Idea:\n\nBuild an infinite canvas with realistic 3D paper curl shadows and desktop alarms!",
            "<h3><b>💡 Quick Brainstorming Idea</b></h3><p>Build an infinite canvas with realistic 3D paper curl shadows and desktop alarms!</p>"
        );
    };

    return (
        <>
            {/* Mobile Top App Bar */}
            <div className="lg:hidden absolute top-0 left-0 right-0 z-[40] h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/80 shadow-glass flex items-center justify-between px-3">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-lg tracking-tight text-white">Stickynote</span>
                </div>
                <button
                    onClick={() => {
                        onAddNote();
                        if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                    }}
                    className="h-8 px-3 bg-amber-500 rounded-xl text-slate-900 font-bold text-xs flex items-center shadow active:scale-95 transition-transform"
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                </button>
            </div>

            {/* Backdrop for Mobile Drawer */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Utility Bar: Floating Pill on Desktop, Lateral Drawer on Mobile */}
            <div className={`
                fixed lg:absolute z-[50] transition-all duration-300 ease-out flex flex-col lg:flex-row
                lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[95vw] lg:bg-slate-900/85 lg:backdrop-blur-md lg:rounded-2xl lg:border lg:border-slate-700/80 lg:shadow-glass lg:w-max lg:h-12
                top-0 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-700/80 shadow-2xl overflow-y-auto lg:overflow-visible no-scrollbar
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-[-50%]'}
            `}>
                {/* Close Button for Drawer (Mobile Only) */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700/80 mb-2 shrink-0">
                    <span className="font-bold text-white tracking-wide">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-2 px-4 lg:px-3 pb-6 lg:pb-0 w-full lg:w-max shrink-0">

                    {/* Brand Icon & Name */}
                    <div className="hidden lg:flex items-center gap-2 pl-1 pr-3 border-r border-slate-700/80 shrink-0 h-8">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow shrink-0">
                            <Sparkles className="w-4 h-4 text-slate-900" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xs font-bold tracking-tight text-white leading-none">Screen Stickynote</h1>
                            <p className="text-[10px] text-amber-400 font-mono leading-none mt-1">screenstickynote.com</p>
                        </div>
                    </div>

                    {/* Add Note Dropdown */}
                    <div className="flex items-center gap-2 lg:gap-1.5 shrink-0 w-full lg:w-auto" ref={newNoteDropdownRef}>
                        <div
                            className="relative flex-1 lg:flex-none"
                            onMouseEnter={handleNewNoteMouseEnter}
                            onMouseLeave={handleNewNoteMouseLeave}
                        >
                            <button
                                onClick={() => {
                                    if (!isNewNoteOpen && newNoteDropdownRef.current) {
                                        const rect = newNoteDropdownRef.current.getBoundingClientRect();
                                        setNewNotePos({
                                            top: rect.bottom + 2,
                                            left: Math.max(12, rect.left),
                                        });
                                    }
                                    setIsNewNoteOpen(!isNewNoteOpen);
                                    setIsFilterOpen(false);
                                    setIsPinnedOpen(false);
                                }}
                                className={`flex items-center justify-center gap-1 h-10 lg:h-8 w-full px-3 text-slate-950 font-bold text-xs rounded-xl shadow transition-all active:scale-95 ${isNewNoteOpen ? 'bg-amber-400' : 'bg-amber-500 hover:bg-amber-400'}`}
                            >
                                <Plus className="w-4 h-4 stroke-[3] shrink-0" />
                                <span className="whitespace-nowrap">New Note</span>
                                <ChevronDown className={`w-3.5 h-3.5 -mr-1 shrink-0 transition-transform ${isNewNoteOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isNewNoteOpen && createPortal(
                                <div
                                    ref={portalMenuRef}
                                    className="absolute w-48 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 p-1"
                                    style={{ top: newNotePos.top, left: newNotePos.left }}
                                    onMouseEnter={handleNewNoteMouseEnter}
                                    onMouseLeave={handleNewNoteMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            onAddNote();
                                            setIsNewNoteOpen(false);
                                            if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                                            <Plus className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />
                                        </div>
                                        Standard Note
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAddTodoTemplate();
                                            setIsNewNoteOpen(false);
                                            if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors mt-0.5"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        Task Checklist
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAddQuickNote();
                                            setIsNewNoteOpen(false);
                                            if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors mt-0.5"
                                    >
                                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                                        </div>
                                        Quick Idea
                                    </button>
                                </div>,
                                document.body
                            )}
                        </div>

                        <button
                            data-stickers-btn="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleStickers();
                                if (window.innerWidth < 1024) {
                                    setIsMobileMenuOpen(false);
                                }
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            title="Open Buttons & Badges Panel"
                            className={`flex items-center justify-center gap-2 lg:gap-1 h-10 lg:h-8 flex-1 lg:flex-none px-3 lg:px-2.5 text-xs rounded-xl border transition-all ${isStickersOpen
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                }`}
                        >
                            <span className="text-sm leading-none">🏷️</span>
                            <span className="font-medium">Stickers</span>
                        </button>
                    </div>

                    <div className="w-full h-[1px] lg:w-[1px] lg:h-5 bg-slate-700/80 lg:mx-1 shrink-0" />

                    {/* Search Bar */}
                    <div className="relative flex items-center shrink-0 w-full lg:w-auto h-10 lg:h-8">
                        <Search className="w-4 h-4 lg:w-3.5 lg:h-3.5 absolute left-3 lg:left-2.5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full lg:w-36 h-full bg-slate-800/90 text-xs pl-9 lg:pl-8 pr-8 lg:pr-7 rounded-xl border border-slate-700 text-slate-100 placeholder-slate-400 outline-none focus:border-amber-400 lg:focus:w-44 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                title="Clear search"
                                className="absolute right-2 text-slate-400 hover:text-white p-1 lg:p-0.5 rounded-full hover:bg-slate-700"
                            >
                                <X className="w-4 h-4 lg:w-3 lg:h-3" />
                            </button>
                        )}
                    </div>

                    {/* Color Filter Dropdown (Hover on Desktop, Tap/Click on Mobile & Tablet) */}
                    <div
                        ref={filterDropdownRef}
                        className="relative shrink-0 w-full lg:w-auto"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                setIsFilterOpen((prev) => {
                                    const nextState = !prev;
                                    setIsPinnedOpen(nextState);
                                    return nextState;
                                });
                            }}
                            title="Filter Notes by Color"
                            className={`flex items-center justify-between lg:justify-start gap-2 lg:gap-1.5 h-10 lg:h-8 w-full px-3 lg:px-2.5 text-xs rounded-xl border transition-all ${selectedColorFilter !== 'all' || isFilterOpen
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2 lg:gap-1.5">
                                {selectedColorFilter === 'all' ? (
                                    <Filter className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-amber-400" />
                                ) : (
                                    <span
                                        className="w-4 h-4 lg:w-3 lg:h-3 rounded-full border border-slate-900 shadow-sm shrink-0"
                                        style={{ backgroundColor: COLOR_PROFILES[selectedColorFilter]?.headerHex }}
                                    />
                                )}
                                <span className="font-medium text-xs">
                                    {selectedColorFilter === 'all'
                                        ? 'Filter'
                                        : COLOR_PROFILES[selectedColorFilter]?.name.split(' ')[0]}
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 lg:w-3.5 lg:h-3.5 text-slate-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180 text-amber-400' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu Portal */}
                        {isFilterOpen && createPortal(
                            <div
                                ref={portalMenuRef}
                                style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                                className="fixed z-[9999] w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 text-slate-100 animate-in fade-in zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                    <span>Filter Palette</span>
                                    {selectedColorFilter !== 'all' && (
                                        <button
                                            onClick={() => {
                                                onFilterChange('all');
                                                closeDropdown();
                                            }}
                                            className="text-amber-400 hover:underline capitalize font-normal text-[10px]"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                {/* Quick Palette Dot Swatches */}
                                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/60 rounded-xl border border-slate-700/50 mb-1">
                                    <button
                                        onClick={() => {
                                            onFilterChange('all');
                                            closeDropdown();
                                        }}
                                        title="All colors"
                                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-lg ${selectedColorFilter === 'all'
                                            ? 'bg-amber-500 text-slate-950'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {COLOR_LIST.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => {
                                                onFilterChange(color.id);
                                                closeDropdown();
                                            }}
                                            title={`Filter ${color.name}`}
                                            style={{ backgroundColor: color.headerHex }}
                                            className={`w-4 h-4 rounded-full border border-slate-900/60 transition-transform ${selectedColorFilter === color.id
                                                ? 'ring-2 ring-white scale-110 shadow-md'
                                                : 'opacity-85 hover:opacity-100 hover:scale-110'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Detailed Color List */}
                                <button
                                    onClick={() => {
                                        onFilterChange('all');
                                        closeDropdown();
                                    }}
                                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition-colors ${selectedColorFilter === 'all'
                                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                                        : 'hover:bg-slate-800 text-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 border border-slate-700" />
                                        <span>All Notes</span>
                                    </div>
                                    {selectedColorFilter === 'all' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                                </button>

                                {COLOR_LIST.map((color) => {
                                    const count = notes.filter((n) => n.color === color.id).length;
                                    const isSelected = selectedColorFilter === color.id;
                                    return (
                                        <button
                                            key={color.id}
                                            onClick={() => {
                                                onFilterChange(color.id);
                                                closeDropdown();
                                            }}
                                            className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition-colors ${isSelected
                                                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                                                : 'hover:bg-slate-800 text-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-3.5 h-3.5 rounded-full border border-slate-900/80 shadow-sm shrink-0"
                                                    style={{ backgroundColor: color.headerHex }}
                                                />
                                                <span>{color.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {count > 0 && (
                                                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-md border border-slate-700">
                                                        {count}
                                                    </span>
                                                )}
                                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>,
                            document.body
                        )}
                    </div>

                    <div className="w-full h-[1px] lg:w-[1px] lg:h-5 bg-slate-700/80 lg:mx-1 shrink-0" />

                    {/* Undo & Redo Action Buttons */}
                    <div className="flex items-center gap-2 lg:gap-1 shrink-0 w-full lg:w-auto">
                        <button
                            onClick={onUndo}
                            disabled={!canUndo}
                            title="Undo Delete / Action (Ctrl+Z)"
                            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-1 h-10 lg:h-8 px-3 lg:px-2 bg-slate-800 text-xs rounded-xl border border-slate-700 transition-all ${canUndo
                                ? 'hover:bg-slate-700 text-slate-200 hover:text-amber-400 cursor-pointer active:scale-95'
                                : 'opacity-40 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Undo2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                            <span className="inline lg:hidden xl:inline text-[11px]">Undo</span>
                        </button>

                        <button
                            onClick={onRedo}
                            disabled={!canRedo}
                            title="Redo Action (Ctrl+Y)"
                            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-1 h-10 lg:h-8 px-3 lg:px-2 bg-slate-800 text-xs rounded-xl border border-slate-700 transition-all ${canRedo
                                ? 'hover:bg-slate-700 text-slate-200 hover:text-amber-400 cursor-pointer active:scale-95'
                                : 'opacity-40 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Redo2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                            <span className="inline lg:hidden xl:inline text-[11px]">Redo</span>
                        </button>
                    </div>

                    <div className="w-full h-[1px] lg:w-[1px] lg:h-5 bg-slate-700/80 lg:mx-1 shrink-0" />

                    {/* Backup Download & Upload Buttons */}
                    <div className="flex items-center gap-2 lg:gap-1 shrink-0 w-full lg:w-auto">
                        <button
                            onClick={handleExportBackup}
                            title="Download JSON Backup (Save notes)"
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-1 h-10 lg:h-8 px-3 lg:px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
                        >
                            <Download className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-amber-400" />
                            <span className="inline lg:hidden md:inline lg:text-xs">Export</span>
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload / Sync JSON Backup"
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 lg:gap-1 h-10 lg:h-8 px-3 lg:px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
                        >
                            <Upload className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-sky-400" />
                            <span className="inline lg:hidden md:inline lg:text-xs">Import</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImportBackup}
                            className="hidden"
                        />
                    </div>

                    <div className="w-full h-[1px] lg:w-[1px] lg:h-5 bg-slate-700/80 lg:mx-1 shrink-0" />

                    {/* Alarm Notification Status Toggle */}
                    <button
                        onClick={() => {
                            if (notificationPermission === 'default') {
                                onRequestNotificationPermission();
                            }
                            onToggleAlarm();
                        }}
                        title={
                            isAlarmEnabled
                                ? 'Alarms Enabled (Click to Turn Off)'
                                : 'Alarms Muted (Click to Turn On)'
                        }
                        className={`h-10 lg:h-8 w-full lg:w-max px-3 lg:px-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 lg:gap-1 shrink-0 transition-all active:scale-95 ${isAlarmEnabled
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/80 shadow-sm'
                            : 'bg-rose-950/80 text-rose-300 border-rose-600/80 hover:bg-rose-900/80 opacity-90'
                            }`}
                    >
                        {isAlarmEnabled ? (
                            <Bell className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-emerald-400" />
                        ) : (
                            <BellOff className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-rose-400" />
                        )}
                        <span className="inline lg:hidden xl:inline text-[11px] font-mono font-medium whitespace-nowrap">
                            {isAlarmEnabled ? 'Alarms On' : 'Alarms Off'}
                        </span>
                    </button>

                </div>
            </div>
        </>
    );
};

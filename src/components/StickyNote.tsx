import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Pin,
    Palette,
    Bell,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    GripHorizontal,
    Check,
    Clock,
    X,
    Image as ImageIcon,
    CheckSquare
} from 'lucide-react';
import type { StickyNote as StickyNoteType, ColorPaletteId } from '../types/note';
import { COLOR_PROFILES, COLOR_LIST } from '../constants/palettes';

interface StickyNoteProps {
    note: StickyNoteType;
    canvasScale: number;
    isSelected?: boolean;
    onUpdateSpatial: (id: number, spatial: Partial<StickyNoteType>) => void;
    onUpdateText: (id: number, content: { text: string; richTextHtml: string }) => void;
    onUpdateImmediate: (id: number, changes: Partial<StickyNoteType>) => void;
    onDelete: (id: number) => void;
    onBringToFront: (id: number) => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
    note,
    canvasScale,
    isSelected = false,
    onUpdateSpatial,
    onUpdateText,
    onUpdateImmediate,
    onDelete,
    onBringToFront,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showAlarmPicker, setShowAlarmPicker] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [alarmTimeInput, setAlarmTimeInput] = useState(note.reminderTime || '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(note.title || '');

    useEffect(() => {
        setTitleInput(note.title || '');
    }, [note.title]);

    const handleSaveTitle = () => {
        const defaultTitle = note.isPinned ? 'PINNED' : 'POST-IT';
        const finalTitle = titleInput.trim() || defaultTitle;
        setTitleInput(finalTitle);
        onUpdateImmediate(note.id!, { title: finalTitle });
        setIsEditingTitle(false);
    };

    const [localPos, setLocalPos] = useState({ x: note.x, y: note.y });
    const [localSize, setLocalSize] = useState({ width: note.width, height: note.height });

    const noteRef = useRef<HTMLDivElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const alarmPickerRef = useRef<HTMLDivElement>(null);
    const colorBtnRef = useRef<HTMLButtonElement>(null);
    const alarmBtnRef = useRef<HTMLButtonElement>(null);
    const editableRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragStartRef = useRef<{ x: number; y: number; noteX: number; noteY: number }>({ x: 0, y: 0, noteX: 0, noteY: 0 });
    const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const currentPosRef = useRef({ x: note.x, y: note.y });
    const currentSizeRef = useRef({ width: note.width, height: note.height });

    // Auto-close color picker, alarm picker, and delete confirm when clicking outside
    useEffect(() => {
        if (!showColorPicker && !showAlarmPicker && !showDeleteConfirm) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const targetNode = e.target as Node;

            if (showColorPicker && !colorPickerRef.current?.contains(targetNode) && !colorBtnRef.current?.contains(targetNode)) {
                setShowColorPicker(false);
            }
            if (showAlarmPicker && !alarmPickerRef.current?.contains(targetNode) && !alarmBtnRef.current?.contains(targetNode)) {
                setShowAlarmPicker(false);
            }
            if (showDeleteConfirm && !noteRef.current?.contains(targetNode)) {
                setShowDeleteConfirm(false);
            }
            if (isFocused && !noteRef.current?.contains(targetNode)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showColorPicker, showAlarmPicker, showDeleteConfirm, isFocused]);

    const insertImageIntoContent = useCallback((imgUrl: string) => {
        if (editableRef.current) {
            editableRef.current.focus();
            const imgHtml = `<img src="${imgUrl}" alt="Note image" class="my-2 max-w-full rounded-lg shadow-md border border-black/10 block" />`;
            document.execCommand('insertHTML', false, imgHtml);
            if (editableRef.current) {
                const plainText = editableRef.current.innerText || '';
                const htmlText = editableRef.current.innerHTML || '';
                onUpdateText(note.id!, { text: plainText, richTextHtml: htmlText });
            }
        }
    }, [note.id, onUpdateText]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (dataUrl) {
                insertImageIntoContent(dataUrl);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        if (dataUrl) {
                            insertImageIntoContent(dataUrl);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    const colorProfile = COLOR_PROFILES[note.color] || COLOR_PROFILES.canary;

    const prevPropPosRef = useRef({ x: note.x, y: note.y });
    const prevPropSizeRef = useRef({ width: note.width, height: note.height });

    const isDraggingRef = useRef(isDragging);
    isDraggingRef.current = isDragging;
    const isResizingRef = useRef(isResizing);
    isResizingRef.current = isResizing;

    // Sync external note spatial changes when not actively dragging/resizing
    useEffect(() => {
        if (note.x !== prevPropPosRef.current.x || note.y !== prevPropPosRef.current.y) {
            prevPropPosRef.current = { x: note.x, y: note.y };
            if (!isDraggingRef.current) {
                setLocalPos({ x: note.x, y: note.y });
                currentPosRef.current = { x: note.x, y: note.y };
            }
        }
    }, [note.x, note.y]);

    useEffect(() => {
        if (note.width !== prevPropSizeRef.current.width || note.height !== prevPropSizeRef.current.height) {
            prevPropSizeRef.current = { width: note.width, height: note.height };
            if (!isResizingRef.current) {
                setLocalSize({ width: note.width, height: note.height });
                currentSizeRef.current = { width: note.width, height: note.height };
            }
        }
    }, [note.width, note.height]);

    // Sync contenteditable HTML content when note changes from external broadcast
    useEffect(() => {
        if (editableRef.current && note.richTextHtml !== undefined) {
            if (editableRef.current.innerHTML !== note.richTextHtml) {
                editableRef.current.innerHTML = note.richTextHtml;
            }
        }
    }, [note.richTextHtml]);

    // DRAG LOGIC (Header bar)
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (note.isPinned) return;

        e.stopPropagation();
        onBringToFront(note.id!);

        const startX = note.x;
        const startY = note.y;
        currentPosRef.current = { x: startX, y: startY };
        setLocalPos({ x: startX, y: startY });
        setIsDragging(true);

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        dragStartRef.current = {
            x: clientX,
            y: clientY,
            noteX: startX,
            noteY: startY,
        };
    };

    const rAFRef = useRef<number | null>(null);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        const deltaX = (clientX - dragStartRef.current.x) / canvasScale;
        const deltaY = (clientY - dragStartRef.current.y) / canvasScale;

        const newX = Math.round(dragStartRef.current.noteX + deltaX);
        const newY = Math.round(dragStartRef.current.noteY + deltaY);

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
        isDraggingRef.current = false;
        setLocalPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });
        onUpdateSpatial(note.id!, { x: currentPosRef.current.x, y: currentPosRef.current.y });
    }, [isDragging, note.id, onUpdateSpatial]);

    // RESIZE LOGIC (Bottom-right handle)
    const resizeRAFRef = useRef<number | null>(null);

    const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        onBringToFront(note.id!);
        setIsResizing(true);
        isResizingRef.current = true;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const startW = note.width;
        const startH = note.height;
        currentSizeRef.current = { width: startW, height: startH };
        setLocalSize({ width: startW, height: startH });

        resizeStartRef.current = {
            x: clientX,
            y: clientY,
            width: startW,
            height: startH,
        };
    };

    const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isResizingRef.current || !resizeStartRef.current) return;

        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        const deltaX = (clientX - resizeStartRef.current.x) / canvasScale;
        const deltaY = (clientY - resizeStartRef.current.y) / canvasScale;

        const newWidth = Math.max(220, Math.round(resizeStartRef.current.width + deltaX));
        const newHeight = Math.max(160, Math.round(resizeStartRef.current.height + deltaY));

        currentSizeRef.current = { width: newWidth, height: newHeight };

        if (resizeRAFRef.current === null) {
            resizeRAFRef.current = requestAnimationFrame(() => {
                resizeRAFRef.current = null;
                setLocalSize({ width: currentSizeRef.current.width, height: currentSizeRef.current.height });
            });
        }
    }, [canvasScale]);

    const handleResizeEnd = useCallback(() => {
        if (!isResizingRef.current) return;
        if (resizeRAFRef.current !== null) {
            cancelAnimationFrame(resizeRAFRef.current);
            resizeRAFRef.current = null;
        }
        setIsResizing(false);
        isResizingRef.current = false;

        setLocalSize({ width: currentSizeRef.current.width, height: currentSizeRef.current.height });
        onUpdateSpatial(note.id!, { width: currentSizeRef.current.width, height: currentSizeRef.current.height });
    }, [note.id, onUpdateSpatial]);

    // Stable Listener References
    const dragMoveRef = useRef(handleDragMove);
    dragMoveRef.current = handleDragMove;
    const dragEndRef = useRef(handleDragEnd);
    dragEndRef.current = handleDragEnd;

    const resizeMoveRef = useRef(handleResizeMove);
    resizeMoveRef.current = handleResizeMove;
    const resizeEndRef = useRef(handleResizeEnd);
    resizeEndRef.current = handleResizeEnd;

    // Event Listeners for Drag
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

    // Event Listeners for Resize
    useEffect(() => {
        if (!isResizing) return;

        const onMove = (e: MouseEvent | TouchEvent) => resizeMoveRef.current(e);
        const onEnd = () => resizeEndRef.current();

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
    }, [isResizing]);

    // CONTENT EDITABLE CHANGE HANDLER
    const handleContentInput = () => {
        if (editableRef.current) {
            const richHtml = editableRef.current.innerHTML;
            const plainText = editableRef.current.innerText;
            onUpdateText(note.id!, { text: plainText, richTextHtml: richHtml });
        }
    };

    // Rich Text ExecCommands
    const formatText = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        handleContentInput();
    };

    const insertChecklist = () => {
        const checklistHtml = `<ul class="checklist-list"><li><input type="checkbox" /> <span>Checklist task</span></li></ul><p><br></p>`;
        document.execCommand('insertHTML', false, checklistHtml);
        handleContentInput();
    };

    // Color Switcher
    const selectColor = (colorId: ColorPaletteId) => {
        onUpdateImmediate(note.id!, { color: colorId });
        setShowColorPicker(false);
    };

    // Save Reminder Alarm
    const handleSaveAlarm = () => {
        onUpdateImmediate(note.id!, {
            reminderTime: alarmTimeInput || null,
            isReminderTriggered: false
        });
        setShowAlarmPicker(false);
    };

    const handleClearAlarm = () => {
        setAlarmTimeInput('');
        onUpdateImmediate(note.id!, {
            reminderTime: null,
            isReminderTriggered: false
        });
        setShowAlarmPicker(false);
    };

    const isAlarmDue = note.reminderTime && new Date(note.reminderTime).getTime() <= Date.now();

    const currentX = localPos.x;
    const currentY = localPos.y;
    const currentW = isResizing ? localSize.width : note.width;
    const currentH = isResizing ? localSize.height : note.height;

    return (
        <div
            ref={noteRef}
            onClick={() => {
                onBringToFront(note.id!);
                setIsFocused(true);
            }}
            onMouseDown={() => setIsFocused(true)}
            onTouchStart={() => setIsFocused(true)}
            className={`absolute top-0 left-0 group postit-curl select-none transition-all duration-200 ease-out ${isDragging || isResizing ? '' : 'hover:scale-[1.025] hover:-translate-y-1'
                } ${isSelected ? 'ring-4 ring-indigo-500/90 ring-offset-2 ring-offset-slate-900/60 shadow-2xl shadow-indigo-500/40 z-40 scale-[1.01]' : ''
                } ${isFocused ? 'z-50' : ''}`}
            style={{
                transform: `translate(${Math.round(currentX)}px, ${Math.round(currentY)}px) rotate(${note.rotation}deg)`,
                width: `${currentW}px`,
                height: `${currentH}px`,
                zIndex: note.zIndex,
                backgroundColor: colorProfile.bgHex,
                color: colorProfile.textHex,
                borderColor: isSelected ? '#6366f1' : 'transparent',
                borderWidth: isSelected ? '2px' : '0px',
                borderRadius: '6px',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'flat',
                willChange: isDragging ? 'transform' : isResizing ? 'width, height' : 'auto',
                transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s ease-in-out, transform 0.2s ease-out',
                boxShadow: isDragging
                    ? '16px 22px 36px rgba(0,0,0,0.32), -4px 10px 16px rgba(0,0,0,0.18)'
                    : isSelected
                        ? '0 20px 30px rgba(0,0,0,0.25), 0 8px 12px rgba(0,0,0,0.15)'
                        : '5px 5px 15px rgba(0,0,0,0.15), -1px 3px 5px rgba(0,0,0,0.1)',
            }}
        >
            {/* Floating ✕ Delete Badge Pop-up on Hover */}
            {!note.isPinned && (
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (note.id !== undefined) onDelete(note.id);
                    }}
                    title="Delete Note"
                    className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center hover:bg-red-600 transition-all duration-150 shadow-lg hover:scale-110 cursor-pointer z-50 text-[11px] font-bold ${isFocused ? 'opacity-100 pointer-events-auto' : 'opacity-0 lg:opacity-0 group-hover:opacity-100'
                        }`}
                >
                    ✕
                </button>
            )}

            {/* Floating Reminder Alarm Popover Overlay (Outside overflow-hidden wrapper) */}
            {showAlarmPicker && (
                <div
                    ref={alarmPickerRef}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{
                        transform: `rotate(${-note.rotation}deg)`,
                    }}
                    className="absolute top-11 right-2 z-[60] bg-slate-950 text-slate-100 p-4 rounded-2xl shadow-2xl border-2 border-slate-700/90 w-72 pointer-events-auto select-none font-sans subpixel-antialiased"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" /> Set Task Alarm
                        </span>
                        <button
                            onClick={() => setShowAlarmPicker(false)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Presets for 1-Click Alarm Setting */}
                    <div className="grid grid-cols-3 gap-1 mb-2.5">
                        <button
                            onClick={() => {
                                const d = new Date(Date.now() + 30 * 60000);
                                const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                setAlarmTimeInput(formatted);
                            }}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-1.5 rounded-md border border-slate-700 text-center font-medium transition-colors"
                        >
                            +30 Mins
                        </button>
                        <button
                            onClick={() => {
                                const d = new Date(Date.now() + 60 * 60000);
                                const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                setAlarmTimeInput(formatted);
                            }}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-1.5 rounded-md border border-slate-700 text-center font-medium transition-colors"
                        >
                            +1 Hour
                        </button>
                        <button
                            onClick={() => {
                                const d = new Date();
                                d.setDate(d.getDate() + 1);
                                d.setHours(9, 0, 0, 0);
                                const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                setAlarmTimeInput(formatted);
                            }}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-1.5 rounded-md border border-slate-700 text-center font-medium transition-colors"
                        >
                            Tomorrow 9 AM
                        </button>
                    </div>

                    <input
                        type="datetime-local"
                        value={alarmTimeInput}
                        onChange={(e) => setAlarmTimeInput(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs p-2 rounded-lg border border-slate-600 mb-3 outline-none focus:border-amber-400 font-mono"
                    />

                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={handleClearAlarm}
                            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 rounded-lg border border-slate-700 font-medium transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleSaveAlarm}
                            className="px-4 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1"
                        >
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Set Alarm
                        </button>
                    </div>
                </div>
            )}

            {/* Inner Content Wrapper (Clips content inside note boundaries) */}
            <div className="w-full h-full rounded-[5px] flex flex-col overflow-hidden relative">

                {/* Top Header Drag Bar */}
                <div
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    style={{ backgroundColor: colorProfile.headerHex }}
                    className={`min-h-[36px] px-3 py-1 rounded-t-[5px] flex items-center justify-between cursor-move border-b border-black/10 ${isDragging ? '' : 'transition-opacity hover:opacity-95'
                        } ${note.isPinned ? 'cursor-default' : ''}`}
                >
                    <div className="flex items-center gap-1.5 opacity-100 min-w-0 flex-1 py-0.5">
                        <GripHorizontal className="w-4 h-4 text-black/80 stroke-[2.2] shrink-0 self-center" />
                        {isEditingTitle ? (
                            <textarea
                                rows={1}
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSaveTitle();
                                    }
                                    if (e.key === 'Escape') setIsEditingTitle(false);
                                }}
                                onBlur={handleSaveTitle}
                                autoFocus
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/90 border border-black/40 rounded px-1.5 py-0.5 text-xs font-black uppercase tracking-wider text-black outline-none w-full resize-none whitespace-pre-wrap break-words overflow-hidden shadow-inner leading-tight"
                            />
                        ) : (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingTitle(true);
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingTitle(true);
                                }}
                                title="Click to edit header title"
                                className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-black/10 px-1 py-0.5 rounded cursor-pointer transition-colors border border-transparent hover:border-black/20 flex items-center gap-1 break-words whitespace-normal leading-tight group/title"
                            >
                                <span className="break-words line-clamp-2">{note.title || (note.isPinned ? 'PINNED' : 'POST-IT')}</span>
                                <span className="opacity-0 group-hover/title:opacity-100 text-[10px] shrink-0 self-start">✏️</span>
                            </span>
                        )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1">
                        {/* Alarm Badge / Button */}
                        <button
                            ref={alarmBtnRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAlarmPicker(!showAlarmPicker);
                                setShowColorPicker(false);
                            }}
                            title={note.reminderTime ? `Reminder: ${new Date(note.reminderTime).toLocaleString()}` : "Set Reminder"}
                            className={`p-1 rounded hover:bg-black/10 transition-colors relative ${note.reminderTime ? 'text-rose-800 font-bold' : 'text-black/80 hover:text-black'
                                }`}
                        >
                            <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
                            {note.reminderTime && (
                                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isAlarmDue ? 'bg-red-600 animate-ping' : 'bg-amber-500'
                                    }`} />
                            )}
                        </button>

                        {/* Color Picker Button */}
                        <button
                            ref={colorBtnRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowColorPicker(!showColorPicker);
                                setShowAlarmPicker(false);
                            }}
                            title="Change Note Color"
                            className="p-1 rounded text-black/80 hover:text-black hover:bg-black/10 transition-colors"
                        >
                            <Palette className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>

                        {/* Pin Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdateImmediate(note.id!, { isPinned: !note.isPinned });
                            }}
                            title={note.isPinned ? "Unpin Note" : "Pin Note"}
                            className={`p-1 rounded transition-colors ${note.isPinned ? 'text-red-700 fill-red-700/20 bg-black/10' : 'text-black/80 hover:text-black hover:bg-black/10'
                                }`}
                        >
                            <Pin className={`w-3.5 h-3.5 stroke-[2.2] ${note.isPinned ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Floating Delete Confirmation Popover */}
                {showDeleteConfirm && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-10 right-2 z-50 bg-slate-900 text-slate-100 p-3 rounded-lg shadow-xl border border-slate-700 w-52 animate-fade-in text-xs"
                    >
                        <p className="font-semibold text-slate-200 mb-2">Delete this sticky note?</p>
                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (note.id !== undefined) {
                                        onDelete(note.id);
                                    }
                                    setShowDeleteConfirm(false);
                                }}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Color Palette Popover */}
                {showColorPicker && (
                    <div
                        ref={colorPickerRef}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-10 right-2 z-50 bg-slate-900 text-white p-2 rounded-xl shadow-2xl border border-slate-700/80 flex gap-2 animate-fade-in"
                    >
                        {COLOR_LIST.map((profile) => (
                            <button
                                key={profile.id}
                                onClick={() => selectColor(profile.id)}
                                title={profile.name}
                                style={{ backgroundColor: profile.headerHex }}
                                className={`w-6 h-6 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm ${note.color === profile.id
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                                    }`}
                            >
                                {note.color === profile.id && (
                                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Rich Text Formatting Mini-Toolbar - Hidden by default, drops down on mouse hover */}
                <div className={`overflow-hidden transition-all duration-200 ease-out bg-black/10 text-black text-xs font-semibold ${isFocused ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 focus-within:max-h-12 focus-within:opacity-100'
                    }`}>
                    <div className="px-2 py-1 flex items-center gap-1 border-b border-black/15">
                        <button
                            onClick={() => formatText('bold')}
                            title="Bold"
                            className="p-1 rounded hover:bg-black/15 font-bold text-black"
                        >
                            <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                            onClick={() => formatText('italic')}
                            title="Italic"
                            className="p-1 rounded hover:bg-black/15 italic text-black"
                        >
                            <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                            onClick={() => formatText('underline')}
                            title="Underline"
                            className="p-1 rounded hover:bg-black/15 underline text-black"
                        >
                            <Underline className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <div className="w-[1px] h-3 bg-black/30 mx-0.5" />
                        <button
                            onClick={() => formatText('insertUnorderedList')}
                            title="Bullet List"
                            className="p-1 rounded hover:bg-black/15 text-black"
                        >
                            <List className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <button
                            onClick={() => formatText('insertOrderedList')}
                            title="Numbered List"
                            className="p-1 rounded hover:bg-black/15 text-black"
                        >
                            <ListOrdered className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <button
                            onClick={insertChecklist}
                            title="Circle Tick Checklist"
                            className="p-1 rounded hover:bg-black/15 text-black"
                        >
                            <CheckSquare className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <div className="w-[1px] h-3 bg-black/30 mx-0.5" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Insert Image"
                            className="p-1 rounded hover:bg-black/15 flex items-center justify-center text-black"
                        >
                            <ImageIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Content Editable Body Area */}
                <div className="p-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
                    <div
                        ref={editableRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContentInput}
                        onPaste={handlePaste}
                        data-placeholder="Write your note here..."
                        className="note-content-editable text-sm leading-relaxed outline-none min-h-full select-text"
                    />
                </div>

                {/* Alarm Status Indicator Bar at Note Bottom */}
                {note.reminderTime && (
                    <div className="absolute bottom-1 left-2 flex items-center gap-1 text-[10px] opacity-75 font-mono">
                        <Clock className="w-3 h-3 text-rose-800" />
                        <span>{new Date(note.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                )}

                {/* Bottom Right Resize Handle */}
                <div
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    title="Drag to resize"
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-black/40 hover:text-black/80 transition-colors z-30"
                >
                    <svg className="w-3 h-3" viewBox="0 0 10 10">
                        <line x1="7" y1="9" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="3" y1="9" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

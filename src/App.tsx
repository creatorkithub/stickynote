import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Undo2 } from 'lucide-react';
import { db, seedDefaultNotesIfEmpty } from './db/database';
import type { StickyNote, ColorPaletteId } from './types/note';
import type { StickerBadgeType } from './types/sticker';
import { useCanvasPanZoom } from './hooks/useCanvasPanZoom';
import { useAutoSaveSync } from './hooks/useAutoSaveSync';
import { Canvas } from './components/Canvas';
import { UtilityBar } from './components/UtilityBar';
import { MiniMap } from './components/MiniMap';
import { StickersDrawer } from './components/StickersDrawer';
import { NotificationManager } from './components/NotificationManager';
import { LandingContent } from './components/LandingContent';
import { CookieConsent } from './components/CookieConsent';
import { ChevronDown } from 'lucide-react';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<ColorPaletteId | 'all'>('all');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isStickersOpen, setIsStickersOpen] = useState<boolean>(false);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(() => {
    return localStorage.getItem('screenstickynote_alarms_enabled') !== 'false';
  });

  // Undo / Redo State for Deleted Notes
  const [undoStack, setUndoStack] = useState<StickyNote[]>([]);
  const [redoStack, setRedoStack] = useState<StickyNote[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleAlarm = useCallback(() => {
    setIsAlarmEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('screenstickynote_alarms_enabled', String(next));
      return next;
    });
  }, []);

  // Seed default notes on first app launch
  useEffect(() => {
    seedDefaultNotesIfEmpty();
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch active notes & stickers using Dexie live queries
  const rawNotes = useLiveQuery(
    () => db.stickynotes.toArray(),
    []
  ) || [];

  const rawStickers = useLiveQuery(
    () => db.stickers.toArray(),
    []
  ) || [];

  // Canvas Pan & Zoom Hook
  const {
    transform,
    setTransform,
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
  } = useCanvasPanZoom(1.0);

  // Auto-Save & Tab Sync Matrix Hook
  const {
    saveSpatialDebounced,
    saveTextDebounced,
    saveImmediate,
    notifyDelete,
  } = useAutoSaveSync();

  // Filter notes based on search query & color profile
  const filteredNotes = rawNotes.filter((note) => {
    const matchesColor = selectedColorFilter === 'all' || note.color === selectedColorFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesColor;

    const matchesTitle = note.title ? note.title.toLowerCase().includes(q) : false;
    const matchesText = note.text ? note.text.toLowerCase().includes(q) : false;
    const matchesHtml = note.richTextHtml ? note.richTextHtml.toLowerCase().includes(q) : false;

    return matchesColor && (matchesTitle || matchesText || matchesHtml);
  });

  // Auto-center canvas on first matching search result
  useEffect(() => {
    const q = searchQuery.trim();
    if (q && filteredNotes.length > 0) {
      const firstMatch = filteredNotes[0];
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const noteCenterX = firstMatch.x + firstMatch.width / 2;
      const noteCenterY = firstMatch.y + firstMatch.height / 2;
      const targetX = Math.round(screenCenterX - noteCenterX * transform.scale);
      const targetY = Math.round(screenCenterY - noteCenterY * transform.scale);
      setTransform((prev) => ({ ...prev, x: targetX, y: targetY }));
    }
  }, [searchQuery]);

  // Action Handlers
  const handleAddNote = useCallback(async (
    color: ColorPaletteId = 'canary',
    customText?: string,
    customHtml?: string,
    customTitle?: string
  ) => {
    const maxZ = Math.max(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    const randomRotation = Number(((Math.random() * 4) - 2).toFixed(1)); // -2deg to +2deg

    // Calculate target X & Y so note always lands at 100px from top of current visible screen frame, regardless of pan/zoom
    const screenTargetX = window.innerWidth / 2 - 150;
    const screenTargetY = 100; // 100px from top of screen frame (below utility bar)

    // Stagger/cascade offset wrapping every 5 notes (25px per note)
    const cascadeIndex = rawNotes.length % 5;
    const cascadeOffset = cascadeIndex * 25;

    const targetX = Math.round((screenTargetX + cascadeOffset - transform.x) / transform.scale);
    const targetY = Math.round((screenTargetY + cascadeOffset - transform.y) / transform.scale);

    const defaultText = customText || "📝 New Sticky Note\n\nDouble click to edit text...";
    const defaultHtml = customHtml || "<h3><b>📝 New Sticky Note</b></h3><p>Double click to edit text...</p>";

    const newNote: StickyNote = {
      title: customTitle,
      text: defaultText,
      richTextHtml: defaultHtml,
      x: targetX,
      y: targetY,
      width: 300,
      height: 250,
      zIndex: maxZ + 1,
      color,
      rotation: randomRotation,
      isPinned: false,
      reminderTime: null,
      isReminderTriggered: false,
      updatedAt: Date.now(),
    };

    await db.stickynotes.add(newNote);
  }, [rawNotes, rawStickers, transform]);

  const handleAddNoteAtPosition = useCallback(async (x: number, y: number) => {
    const maxZ = Math.max(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    const randomRotation = Number(((Math.random() * 4) - 2).toFixed(1));

    const newNote: StickyNote = {
      text: "⚡ Quick Note\n\nType your task here...",
      richTextHtml: "<h3><b>⚡ Quick Note</b></h3><p>Type your task here...</p>",
      x,
      y,
      width: 280,
      height: 220,
      zIndex: maxZ + 1,
      color: 'sky',
      rotation: randomRotation,
      isPinned: false,
      reminderTime: null,
      isReminderTriggered: false,
      updatedAt: Date.now(),
    };

    await db.stickynotes.add(newNote);
  }, [rawNotes, rawStickers]);

  // Sticker Handlers
  const handleAddSticker = useCallback(async (badgeType: StickerBadgeType) => {
    const maxZ = Math.max(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    const randomRotation = Number(((Math.random() * 8) - 4).toFixed(1)); // -4deg to +4deg

    // Spawn sticker in upper-center of current visible screen frame
    const screenTargetX = window.innerWidth / 2 - 30;
    const screenTargetY = 160;
    const cascadeIndex = rawStickers.length % 5;
    const cascadeOffset = cascadeIndex * 24;

    const targetX = Math.round((screenTargetX + cascadeOffset - transform.x) / transform.scale);
    const targetY = Math.round((screenTargetY + cascadeOffset - transform.y) / transform.scale);

    await db.stickers.add({
      badgeType,
      x: targetX,
      y: targetY,
      size: 58,
      rotation: randomRotation,
      zIndex: maxZ + 1,
      updatedAt: Date.now(),
    });
  }, [rawNotes, rawStickers, transform]);

  const handleUpdateStickerSpatial = useCallback(async (id: number, spatial: { x: number; y: number }) => {
    await db.stickers.update(id, { ...spatial, updatedAt: Date.now() });
  }, []);

  const handleDeleteSticker = useCallback(async (id: number) => {
    await db.stickers.delete(id);
  }, []);

  const handleBringStickerToFront = useCallback(async (id: number) => {
    const maxZ = Math.max(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    await db.stickers.update(id, { zIndex: maxZ + 1 });
  }, [rawNotes, rawStickers]);

  const handleSendStickerToBack = useCallback(async (id: number) => {
    const minZ = Math.min(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    await db.stickers.update(id, { zIndex: minZ - 1 });
  }, [rawNotes, rawStickers]);

  // Bring Clicked Note to Front (Increase zIndex)
  const handleBringToFront = useCallback(async (id: number) => {
    const maxZ = Math.max(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    const currentNote = rawNotes.find((n) => n.id === id);
    if (currentNote && currentNote.zIndex < maxZ) {
      saveImmediate(id, { zIndex: maxZ + 1 });
    }
  }, [rawNotes, rawStickers, saveImmediate]);

  const handleSendToBack = useCallback(async (id: number) => {
    const minZ = Math.min(0, ...rawNotes.map((n) => n.zIndex || 0), ...rawStickers.map((s) => s.zIndex || 0));
    saveImmediate(id, { zIndex: minZ - 1 });
  }, [rawNotes, rawStickers, saveImmediate]);

  // Undo / Redo Actions
  const handleUndo = useCallback(async () => {
    if (undoStack.length === 0) return;
    const noteToRestore = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    // Re-add to database
    await db.stickynotes.put(noteToRestore);

    // Push to redo stack
    setRedoStack((prev) => [...prev, noteToRestore]);

    setToastMessage(`Restored "${noteToRestore.title || 'Sticky Note'}"`);
    setTimeout(() => setToastMessage(null), 4000);
  }, [undoStack]);

  const handleRedo = useCallback(async () => {
    if (redoStack.length === 0) return;
    const noteToDeleteAgain = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    if (noteToDeleteAgain.id !== undefined) {
      await db.stickynotes.delete(noteToDeleteAgain.id);
      notifyDelete(noteToDeleteAgain.id);
    }

    setUndoStack((prev) => [...prev, noteToDeleteAgain]);
    setToastMessage(`Deleted "${noteToDeleteAgain.title || 'Sticky Note'}"`);
    setTimeout(() => setToastMessage(null), 4000);
  }, [redoStack, notifyDelete]);

  // Global Keyboard Shortcuts for Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isTyping) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleDeleteNote = useCallback(async (id: number) => {
    const targetNote = rawNotes.find((n) => n.id === id);
    if (targetNote) {
      setUndoStack((prev) => [...prev, targetNote]);
      setRedoStack([]); // Clear redo stack on new action
      setToastMessage('Sticky note deleted');
      setTimeout(() => setToastMessage(null), 6000);
    }

    await db.stickynotes.delete(id);
    notifyDelete(id);
  }, [rawNotes, notifyDelete]);

  const handleRequestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted') {
        new Notification('Screen Stickynote', {
          body: 'Notifications enabled successfully!',
          icon: '/sticky-note-icon.svg',
        });
      }
    }
  }, []);

  const handleFocusNote = useCallback((id: number) => {
    const targetNote = rawNotes.find((n) => n.id === id);
    if (!targetNote) return;

    const noteWidth = targetNote.width || 300;
    const noteHeight = targetNote.height || 250;
    const noteCenterX = targetNote.x + noteWidth / 2;
    const noteCenterY = targetNote.y + noteHeight / 2;

    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const targetTransformX = screenCenterX - noteCenterX * transform.scale;
    const targetTransformY = screenCenterY - noteCenterY * transform.scale;

    setTransform((prev) => ({
      ...prev,
      x: Math.round(targetTransformX),
      y: Math.round(targetTransformY),
    }));

    handleBringToFront(id);
  }, [rawNotes, transform.scale, setTransform, handleBringToFront]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950 font-sans text-slate-100">
      <main className="relative w-full h-[100vh] overflow-hidden">
        {/* Control Utility Bar */}
        <UtilityBar
          transform={transform}
          notes={rawNotes}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedColorFilter={selectedColorFilter}
          onFilterChange={setSelectedColorFilter}
          onAddNote={handleAddNote}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onReloadNotes={() => { }}
          notificationPermission={notificationPermission}
          onRequestNotificationPermission={handleRequestNotificationPermission}
          isAlarmEnabled={isAlarmEnabled}
          onToggleAlarm={handleToggleAlarm}
          isStickersOpen={isStickersOpen}
          onToggleStickers={() => setIsStickersOpen((prev) => !prev)}
        />

        {/* Buttons & Badges Selection Drawer */}
        <StickersDrawer
          isOpen={isStickersOpen}
          onClose={() => setIsStickersOpen(false)}
          onAddSticker={handleAddSticker}
        />

        {/* Main Infinite Canvas Workspace */}
        <Canvas
          notes={filteredNotes}
          stickers={rawStickers}
          transform={transform}
          onWheel={handleWheel}
          onStartPan={startPan}
          onDoPan={doPan}
          onEndPan={endPan}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onUpdateSpatial={saveSpatialDebounced}
          onUpdateText={saveTextDebounced}
          onUpdateImmediate={saveImmediate}
          onDelete={handleDeleteNote}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onAddNoteAtPosition={handleAddNoteAtPosition}
          onUpdateStickerSpatial={handleUpdateStickerSpatial}
          onDeleteSticker={handleDeleteSticker}
          onBringStickerToFront={handleBringStickerToFront}
          onSendStickerToBack={handleSendStickerToBack}
        />

        {/* Interactive MiniMap */}
        <MiniMap
          notes={rawNotes}
          transform={transform}
          onNavigate={(newX, newY) => setTransform((prev) => ({ ...prev, x: newX, y: newY }))}
          onResetView={resetZoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />

        {/* Local Alarm Service Loop */}
        <NotificationManager isAlarmEnabled={isAlarmEnabled} onFocusNote={handleFocusNote} />

        {/* Floating Toast Banner for Accidental Delete Recovery & Undo */}
        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 bg-slate-900/95 text-slate-100 px-4 py-2.5 rounded-2xl border border-slate-700/90 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
            <span className="text-xs font-medium text-slate-200">{toastMessage}</span>
            {undoStack.length > 0 && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-xl shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Undo</span>
              </button>
            )}
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs p-1 font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scroll down to landing page button */}
        <button
          onClick={() => {
            const seoElement = document.getElementById('seo-content');
            if (seoElement) seoElement.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-slate-900/20 sm:bg-slate-900/80 hover:bg-slate-800 border border-slate-700/20 sm:border-slate-700/80 text-slate-500 sm:text-slate-300 hover:text-slate-100 rounded-full backdrop-blur-[2px] sm:backdrop-blur-md shadow-sm sm:shadow-lg sm:shadow-black/50 transition-all hover:scale-105 active:scale-95 text-[10px] sm:text-xs font-bold tracking-wide"
        >
          <span className="hidden sm:inline">Scroll for Info</span>
          <span className="inline sm:hidden">Info</span> <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
        </button>
      </main>

      {/* SEO Landing Page Content */}
      <LandingContent />

      {/* Global First Time Visitor Banner */}
      <CookieConsent />
    </div>
  );
}

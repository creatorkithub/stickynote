import Dexie, { type Table } from 'dexie';
import type { StickyNote } from '../types/note';
import type { CanvasSticker } from '../types/sticker';

export class StickyNotesDatabase extends Dexie {
    stickynotes!: Table<StickyNote, number>;
    stickers!: Table<CanvasSticker, number>;

    constructor() {
        super('SaaSStickyNotesDB');

        // Schema definitions
        this.version(1).stores({
            stickynotes: '++id, text, richTextHtml, x, y, width, height, zIndex, color, isPinned, reminderTime, isReminderTriggered, updatedAt'
        });

        this.version(2).stores({
            stickynotes: '++id, text, richTextHtml, x, y, width, height, zIndex, color, isPinned, reminderTime, isReminderTriggered, updatedAt',
            stickers: '++id, badgeType, x, y, size, rotation, zIndex, updatedAt'
        });
    }
}

export const db = new StickyNotesDatabase();

// Default starter notes populated on first launch
export async function seedDefaultNotesIfEmpty() {
    const hasLaunchedBefore = localStorage.getItem('screenstickynote_has_launched');
    if (hasLaunchedBefore) return;

    localStorage.setItem('screenstickynote_has_launched', 'true');

    const count = await db.stickynotes.count();
    if (count === 0) {
        const now = Date.now();

        await db.stickynotes.bulkAdd([
            {
                text: "👋 Welcome to Screen Stickynote!\n\n• Drag notes anywhere on the infinite canvas\n• Use middle-click or Space + Drag to pan\n• Scroll mouse wheel to zoom in & out\n• PWA offline ready & tabs auto-synced!",
                richTextHtml: "<h2><b>👋 Welcome to Screen Stickynote!</b></h2><ul><li>Drag notes anywhere on the infinite canvas</li><li>Use middle-click or <b>Space + Drag</b> to pan</li><li>Scroll mouse wheel to zoom in & out</li><li>PWA offline ready & tabs auto-synced!</li></ul>",
                x: 180,
                y: 140,
                width: 320,
                height: 280,
                zIndex: 1,
                color: 'canary',
                rotation: 1.2,
                isPinned: true,
                reminderTime: null,
                updatedAt: now
            },
            {
                text: "⚡ Real-time Matrix & Alarms\n\n• Debounced 150ms position auto-save\n• 6 Vibrant SaaS color profiles\n• Set alarm reminders with desktop push alerts\n• Export/Import JSON backups in utility bar",
                richTextHtml: "<h3><b>⚡ Real-time Matrix & Alarms</b></h3><ul><li>Debounced 150ms position auto-save</li><li>6 Vibrant SaaS color profiles</li><li>Set alarm reminders with desktop push alerts</li><li>Export/Import JSON backups in utility bar</li></ul>",
                x: 540,
                y: 180,
                width: 310,
                height: 270,
                zIndex: 2,
                color: 'mint',
                rotation: -1.5,
                isPinned: false,
                reminderTime: null,
                updatedAt: now + 1
            },
            {
                text: "🚀 Feature Checklist:\n\n[x] 3D Post-It Curl Shadow\n[x] Rich-text Formatting\n[x] Multi-tab Sync\n[x] JSON Data Portability",
                richTextHtml: "<h3><b>🚀 Feature Checklist</b></h3><ul class=\"checklist-list\"><li class=\"checked\"><b>3D Post-It Curl Shadow</b></li><li class=\"checked\"><b>Rich-text Formatting</b></li><li class=\"checked\"><b>Multi-tab Sync</b></li><li class=\"checked\"><b>JSON Data Portability</b></li></ul>",
                x: 360,
                y: 460,
                width: 290,
                height: 240,
                zIndex: 3,
                color: 'magenta',
                rotation: 0.8,
                isPinned: false,
                reminderTime: null,
                updatedAt: now + 2
            }
        ]);
    }
}

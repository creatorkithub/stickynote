export type ColorPaletteId = 'canary' | 'mint' | 'magenta' | 'sky' | 'tangerine' | 'pink';

export interface ColorProfile {
    id: ColorPaletteId;
    name: string;
    bgHex: string;
    borderHex: string;
    headerHex: string;
    accentHex: string;
    textHex: string;
    badgeBg: string;
    tailwindClass: string;
}

export interface StickyNote {
    id?: number;
    title?: string;            // Custom header title (default: 'POST-IT')
    text: string;             // Plain text preview
    richTextHtml?: string;    // Rich HTML text content
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    color: ColorPaletteId;
    rotation: number;         // Random rotation between -2deg and +2deg
    isPinned: boolean;
    reminderTime: string | null; // ISO Date String or null
    isReminderTriggered?: boolean;
    tags?: string[];
    updatedAt: number;        // Timestamp
}

export interface CanvasTransform {
    x: number;
    y: number;
    scale: number;
}

export interface BackupMetadata {
    appName: string;
    appVersion: string;
    exportTimestamp: string;
    noteCount: number;
}

export interface BackupPayload {
    metadata: BackupMetadata;
    notes: StickyNote[];
}

export type BroadcastMessageType =
    | { type: 'NOTE_UPDATED'; note: StickyNote }
    | { type: 'NOTE_DELETED'; noteId: number }
    | { type: 'NOTES_RELOAD' };

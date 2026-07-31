import { useEffect, useRef, useCallback } from 'react';
import { db } from '../db/database';
import type { StickyNote, BroadcastMessageType } from '../types/note';

const CHANNEL_NAME = 'screenstickynote_sync_channel';

export function useAutoSaveSync(onExternalChange?: () => void) {
    const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
    const positionTimerRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const textTimerRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    // Initialize BroadcastChannel
    useEffect(() => {
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel(CHANNEL_NAME);
            broadcastChannelRef.current = channel;

            channel.onmessage = (event: MessageEvent<BroadcastMessageType>) => {
                const msg = event.data;
                if (msg.type === 'NOTE_UPDATED' || msg.type === 'NOTE_DELETED' || msg.type === 'NOTES_RELOAD') {
                    if (onExternalChange) {
                        onExternalChange();
                    }
                }
            };

            return () => {
                channel.close();
            };
        }
    }, [onExternalChange]);

    // Broadcast helper
    const postBroadcast = useCallback((msg: BroadcastMessageType) => {
        if (broadcastChannelRef.current) {
            try {
                broadcastChannelRef.current.postMessage(msg);
            } catch (err) {
                console.warn('BroadcastChannel error:', err);
            }
        }
    }, []);

    // Debounced save for Spatial coordinates / sizing (150ms)
    const saveSpatialDebounced = useCallback((noteId: number, spatialData: Partial<StickyNote>) => {
        if (positionTimerRef.current[noteId]) {
            clearTimeout(positionTimerRef.current[noteId]);
        }

        positionTimerRef.current[noteId] = setTimeout(async () => {
            try {
                const now = Date.now();
                await db.stickynotes.update(noteId, {
                    ...spatialData,
                    updatedAt: now,
                });

                const updatedNote = await db.stickynotes.get(noteId);
                if (updatedNote) {
                    postBroadcast({ type: 'NOTE_UPDATED', note: updatedNote });
                }
            } catch (err) {
                console.error('Error saving spatial data:', err);
            } finally {
                delete positionTimerRef.current[noteId];
            }
        }, 150); // 150ms spatial debounce requirement
    }, [postBroadcast]);

    // Debounced save for Text / Content updates (300ms)
    const saveTextDebounced = useCallback((noteId: number, contentData: { text?: string; richTextHtml?: string }) => {
        if (textTimerRef.current[noteId]) {
            clearTimeout(textTimerRef.current[noteId]);
        }

        textTimerRef.current[noteId] = setTimeout(async () => {
            try {
                const now = Date.now();
                await db.stickynotes.update(noteId, {
                    ...contentData,
                    updatedAt: now,
                });

                const updatedNote = await db.stickynotes.get(noteId);
                if (updatedNote) {
                    postBroadcast({ type: 'NOTE_UPDATED', note: updatedNote });
                }
            } catch (err) {
                console.error('Error saving text content:', err);
            } finally {
                delete textTimerRef.current[noteId];
            }
        }, 300); // 300ms text debounce requirement
    }, [postBroadcast]);

    // Immediate save for properties like color, pinned state, reminder time
    const saveImmediate = useCallback(async (noteId: number, changes: Partial<StickyNote>) => {
        try {
            const now = Date.now();
            await db.stickynotes.update(noteId, {
                ...changes,
                updatedAt: now,
            });

            const updatedNote = await db.stickynotes.get(noteId);
            if (updatedNote) {
                postBroadcast({ type: 'NOTE_UPDATED', note: updatedNote });
            }
        } catch (err) {
            console.error('Error saving immediate change:', err);
        }
    }, [postBroadcast]);

    const notifyReload = useCallback(() => {
        postBroadcast({ type: 'NOTES_RELOAD' });
    }, [postBroadcast]);

    const notifyDelete = useCallback((noteId: number) => {
        postBroadcast({ type: 'NOTE_DELETED', noteId });
    }, [postBroadcast]);

    return {
        saveSpatialDebounced,
        saveTextDebounced,
        saveImmediate,
        notifyReload,
        notifyDelete,
    };
}

import React, { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { db } from '../db/database';

interface ActiveAlarmBanner {
    id: number;
    noteTitle: string;
    noteText: string;
    time: string;
}

interface NotificationManagerProps {
    isAlarmEnabled: boolean;
    onFocusNote?: (id: number) => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ isAlarmEnabled, onFocusNote }) => {
    const [activeBanner, setActiveBanner] = useState<ActiveAlarmBanner | null>(null);

    const handleBannerClick = (e: React.MouseEvent) => {
        // Prevent trigger if clicking acknowledge or close button
        if ((e.target as HTMLElement).closest('button')) return;
        if (activeBanner && onFocusNote) {
            onFocusNote(activeBanner.id);
        }
    };

    // Background Alarm Checking Service Loop (Runs every 10 seconds)
    useEffect(() => {
        const checkAlarms = async () => {
            if (!isAlarmEnabled) return;
            try {
                const now = Date.now();
                const allNotes = await db.stickynotes.toArray();

                for (const note of allNotes) {
                    if (note.reminderTime && !note.isReminderTriggered) {
                        const reminderTimestamp = new Date(note.reminderTime).getTime();

                        // If reminder timestamp matches or is prior to current time
                        if (reminderTimestamp <= now) {
                            // 1. Mark as triggered in database
                            await db.stickynotes.update(note.id!, { isReminderTriggered: true });

                            const titleBadge = note.title ? note.title.toUpperCase() : 'POST-IT';

                            // 2. Trigger native OS desktop push alert if permission granted
                            if ('Notification' in window && Notification.permission === 'granted') {
                                const previewText = note.text ? note.text.substring(0, 100) : 'Sticky note reminder!';
                                new Notification(`⏰ [${titleBadge}] Reminder Alert`, {
                                    body: previewText,
                                    icon: '/sticky-note-icon.svg',
                                    tag: `note-alarm-${note.id}`,
                                    requireInteraction: true,
                                });
                            }

                            // 3. Play audio chime
                            playAlarmChime();

                            // 4. Set in-app alarm banner
                            setActiveBanner({
                                id: note.id!,
                                noteTitle: titleBadge,
                                noteText: note.text.substring(0, 80) || 'Task reminder due!',
                                time: new Date(note.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            });
                        }
                    }
                }
            } catch (err) {
                console.error('Error in alarm service loop:', err);
            }
        };

        checkAlarms();
        const interval = setInterval(checkAlarms, 10000);

        return () => clearInterval(interval);
    }, [isAlarmEnabled]);

    // Web Audio API Audio Chime Synthesizer
    const playAlarmChime = () => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const playNote = (freq: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            playNote(523.25, now, 0.3);        // C5
            playNote(659.25, now + 0.15, 0.3);   // E5
            playNote(783.99, now + 0.3, 0.5);    // G5
        } catch {
            // Audio playback blocked or unavailable
        }
    };

    return (
        <>
            {/* In-App Floating Toast Banner for Due Alarms */}
            {activeBanner && (
                <div
                    onClick={handleBannerClick}
                    title="Click frame to locate note on canvas"
                    className="absolute bottom-6 right-6 z-50 bg-slate-900 text-slate-100 p-4 rounded-2xl border border-amber-500/80 hover:border-amber-400 shadow-2xl max-w-sm cursor-pointer transition-all hover:scale-105 group animate-bounce"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                                <Clock className="w-4 h-4 animate-pulse shrink-0" />
                                <span>Reminder Alarm ({activeBanner.time})</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                                    {activeBanner.noteTitle}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveBanner(null)}
                            title="Dismiss alarm banner"
                            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 line-clamp-3 bg-slate-800/90 group-hover:bg-slate-800 group-hover:text-white p-2.5 rounded-xl border border-slate-700 font-sans transition-colors">
                        "{activeBanner.noteText}"
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-amber-400/90 font-medium underline">
                            📍 Click frame to view note
                        </span>
                        <button
                            onClick={() => setActiveBanner(null)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow transition-transform active:scale-95"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

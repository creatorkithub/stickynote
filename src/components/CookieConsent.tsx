import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('screen_stickynote_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('screen_stickynote_consent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('screen_stickynote_consent', 'rejected');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[9999] animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-amber-500/10 rounded-xl shrink-0 border border-amber-500/20 shadow-inner">
                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1">Your Privacy & Terms</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                We use strictly necessary local storage (IndexedDB) to save your notes. By continuing, you agree to our <a href="#seo-content" className="text-amber-400 hover:underline">Terms of Service</a> & <a href="#seo-content" className="text-amber-400 hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                    <button onClick={handleReject} className="text-slate-500 hover:text-slate-300 transition-colors p-1" title="Close">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full mt-1">
                    <button onClick={handleReject} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors border border-slate-700">
                        Decline
                    </button>
                    <button onClick={handleAccept} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-transform hover:-translate-y-0.5 active:scale-95 shadow-[0_5px_15px_rgba(251,191,36,0.2)]">
                        Accept & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

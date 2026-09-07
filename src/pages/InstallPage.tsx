import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';

export const InstallPage: React.FC = () => {
    useEffect(() => {
        document.title = "Installation Successful | Screen Stickynote";

        // Trigger a nice confetti animation on load
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#fbbf24', '#f59e0b', '#d97706']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#fbbf24', '#f59e0b', '#d97706']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <PageLayout>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 animate-in zoom-in-95 duration-500 min-h-[70vh]">

                {/* Left Column: Hero Text */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 rounded-full shadow-2xl mb-8 border border-emerald-500/30">
                        <CheckCircle className="w-16 h-16 text-emerald-400" aria-hidden="true" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 tracking-tight">
                        Installation <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Successful!</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-12">
                        Thank you for installing Screen Stickynote. You're all set to supercharge your productivity with an infinite virtual canvas right on your Windows desktop.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-2xl font-bold text-base shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                        Go to Web App <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Right Column: Getting Started Steps */}
                <div className="flex-1 w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl backdrop-blur-sm self-stretch flex flex-col justify-center transition-all hover:bg-slate-900/60 hover:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-3 pb-4 border-b border-slate-800">
                        <Sparkles className="w-6 h-6 text-amber-400" /> Getting Started
                    </h2>
                    <ol className="space-y-6 text-slate-300">
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800 font-bold text-amber-400 shrink-0 text-lg shadow-inner">1</span>
                            <p className="leading-relaxed pt-1">Press the <kbd className="px-2 py-1 bg-slate-950 border border-slate-700 shadow-sm rounded text-sm mx-1">Windows</kbd> key on your keyboard.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800 font-bold text-amber-400 shrink-0 text-lg shadow-inner">2</span>
                            <p className="leading-relaxed pt-1">Search for <strong className="text-slate-100">"Screen Stickynote"</strong> and hit Enter.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800 font-bold text-amber-400 shrink-0 text-lg shadow-inner">3</span>
                            <p className="leading-relaxed pt-1">Right-click the icon in your system tray to access quick settings or <strong className="text-slate-100">pin it</strong> to your taskbar.</p>
                        </li>
                    </ol>
                </div>

            </main>
        </PageLayout>
    );
};

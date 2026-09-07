import React, { useEffect } from 'react';
import { MessageSquare, Hand, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { Helmet } from 'react-helmet-async';

export const UninstallPage: React.FC = () => {
    useEffect(() => {
        document.title = "Uninstalled Successfully | Screen Stickynote";
    }, []);

    return (
        <PageLayout>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 animate-in fade-in duration-700 min-h-[70vh]">

                {/* Left Column: Hero Text */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="inline-flex items-center justify-center p-5 bg-slate-800/50 rounded-full shadow-lg mb-8 border border-slate-700">
                        <Hand className="w-16 h-16 text-slate-400" aria-hidden="true" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 tracking-tight">
                        Uninstalled <br className="hidden md:block" />
                        Successfully
                    </h1>

                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md mx-auto md:mx-0 mb-10">
                        Screen Stickynote has been completely removed from your system. We're sorry to see you go!
                    </p>

                    <div className="flex flex-col xl:flex-row items-center gap-4 mb-4">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)] w-full xl:w-auto"
                        >
                            <MonitorPlay className="w-5 h-5" /> Try Web App
                        </Link>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">No installation required, it works directly in your browser!</p>
                </div>

                {/* Right Column: Feedback Box */}
                <div className="flex-1 w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl backdrop-blur-sm self-stretch flex flex-col justify-center transition-all hover:bg-slate-900/60 hover:border-slate-700 text-center md:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300 md:ml-0 mx-auto mb-6">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">
                        Could we have done better?
                    </h2>
                    <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                        If you have a moment, we'd love to hear your feedback so we can improve the app for everyone. Let us know what didn't work for you.
                    </p>
                    <a
                        href="https://forms.gle/Vhg4LK53QSt9o8MB8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-slate-700 hover:border-slate-600 shadow-md md:w-max w-full"
                    >
                        Share Feedback
                    </a>
                </div>

            </main>
        </PageLayout>
    );
};

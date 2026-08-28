import React, { useEffect } from 'react';
import { ArrowLeft, MonitorPlay, Code2, LayoutTemplate, Zap, Image as ImageIcon, Link2, Palette, Pin, Grid, BellRing, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ms-store-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                productid?: string;
                cid?: string;
                productname?: string;
                'window-mode'?: string;
                theme?: string;
                size?: string;
                language?: string;
                animation?: string;
            };
        }
    }
}

export const DownloadPage: React.FC = () => {
    // Dynamic SEO Management
    useEffect(() => {
        document.title = "Download Screen Stickynote for Windows | Offline Desktop App";
        const metaDesc = document.querySelector('meta[name="description"]');
        const originalDesc = metaDesc?.getAttribute("content");
        if (metaDesc) {
            metaDesc.setAttribute("content", "Download the native Windows executable for Screen Stickynote. Experience an infinite 3D virtual canvas with 100% offline local storage and system tray integration.");
        }

        // Restore meta description on unmount
        return () => {
            if (metaDesc && originalDesc) metaDesc.setAttribute("content", originalDesc);
            document.title = "Screen Stickynote - Infinite Virtual Canvas & 3D Stickynotes";
        };
    }, []);

    return (
        <PageLayout>
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col items-center animate-in fade-in duration-500">
                <div className="w-full mb-8 flex justify-start">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>

                {/* Hero Section */}
                <section aria-labelledby="download-hero-title" className="text-center w-full mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl mb-8 relative border border-slate-700/50">
                        <MonitorPlay className="w-12 h-12 text-amber-400" aria-hidden="true" />
                    </div>
                    <h1 id="download-hero-title" className="text-4xl md:text-6xl font-bold text-slate-100 mb-6 tracking-tight">
                        Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Screen Stickynote</span>
                    </h1>
                    <p className="text-base md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                        Experience the ultimate productivity tool right on your Windows desktop. Discover our web-based <Link to="/" className="font-semibold text-slate-300 hover:text-amber-400 hover:underline transition-colors">infinite virtual canvas</Link> directly in your browser, or install the native Windows app. As governed by our <Link to="/windows-app-privacy" className="font-semibold text-slate-300 hover:text-amber-400 hover:underline transition-colors">Windows Privacy Policy</Link>, your thoughts remain 100% offline.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-sm sm:max-w-4xl mx-auto">
                        {/* Direct Download Button */}
                        <div className="flex-1 flex sm:justify-end justify-center w-full">
                            <a
                                href="https://pub-8faf7ac3f9aa408e9e6bac3c218957da.r2.dev/ScreenStickyNote_Setup.exe"
                                className="group relative inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 sm:px-8 rounded-2xl font-bold text-[15px] sm:text-base shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95 w-full sm:w-auto h-[56px] shrink-0"
                            >
                                <HardDrive className="w-5 h-5 stroke-[2.5]" />
                                Download Setup (.exe)
                            </a>
                        </div>

                        <div className="mx-6 sm:mx-10 h-10 w-px bg-slate-800 hidden sm:block shrink-0"></div>
                        <div className="sm:hidden text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-4 w-full my-6">
                            <span className="h-px bg-slate-800 flex-1"></span>
                            OR
                            <span className="h-px bg-slate-800 flex-1"></span>
                        </div>

                        {/* MS Store Badge (Scaled precisely to match the 56px height of the setup button) */}
                        <div className="flex-1 flex sm:justify-start justify-center w-full sm:w-auto h-[56px] shrink-0">
                            <div className="hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300 flex justify-center sm:justify-start items-center w-full sm:w-auto h-full cursor-pointer">
                                <div className="flex justify-center origin-center sm:origin-left" style={{ transform: 'scale(0.82)' }}>
                                    {React.createElement('ms-store-badge', {
                                        productid: "xpdfg1xhtq83bm",
                                        cid: "website",
                                        productname: "Screen Stickynote",
                                        "window-mode": "direct",
                                        theme: "auto",
                                        size: "small",
                                        language: "en",
                                        animation: "on"
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full flex flex-col mt-4">
                    {/* Key Features Section */}
                    <section aria-labelledby="features-title" className="flex flex-col w-full">
                        <div className="text-center mb-10 w-full border-t border-slate-800/60 pt-16">
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Core Capabilities
                            </p>
                            <h2 id="features-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">Everything you need.</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full object-center pb-8">
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <LayoutTemplate className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Floating Notes</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Create standalone, borderless sticky notes placed anywhere on your desktop screen.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-sky-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-sky-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <Grid className="w-7 h-7 text-sky-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Central Dashboard</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Sleek management UI to sort, view, and search through all active and hidden notes.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <Code2 className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Rich Text Editing</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Supports keyboard shortcuts, bold, italics, bulleted lists, and numbered lists.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-amber-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <ImageIcon className="w-7 h-7 text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Image Handling</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Intuitive paste or drag-and-drop support for images with auto-scaling.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-blue-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <Link2 className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Smart URLs</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Web links are automatically recognized, highlighted, and directly clickable.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-rose-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <Palette className="w-7 h-7 text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Beautiful Themes</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Dynamic predefined palettes mapped for headers, backgrounds, and borders.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-fuchsia-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-fuchsia-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <Pin className="w-7 h-7 text-fuchsia-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">System Controls</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Contextual buttons for pinning notes over other windows or hiding them.</p>
                            </div>
                            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-orange-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                                <div className="p-3 bg-orange-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                    <BellRing className="w-7 h-7 text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Reminders & Alarms</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Categorize securely with tags and attach active reminder alarms to tasks.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </PageLayout>
    );
};

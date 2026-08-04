import React from 'react';
import { InteractiveStars } from './InteractiveStars';
import { Sparkles, Database, CloudOff, Layers, Zap, Info, Shield, FileText, Mail, ChevronDown, ChevronUp, Target, Lightbulb, Layout, Smartphone, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingContent: React.FC = () => {
    const [openFaq, setOpenFaq] = React.useState<number | null>(0);
    const [showTopBtn, setShowTopBtn] = React.useState<boolean>(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > window.innerHeight * 0.5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const faqs = [
        {
            q: "Where is my data stored?",
            a: "All your sticky notes and metadata are stored entirely offline in your browser's local IndexedDB database. We do not transmit your notes to any remote servers, ensuring complete privacy."
        },
        {
            q: "Does auto-sync work across different devices?",
            a: "No. Because Screen Stickynote prioritises absolute privacy, your data is securely locked inside your local browser storage (IndexedDB). It does not automatically sync via the cloud. To move your notes to a new device, simply use the \"Export JSON\" feature and import the file on your other machine."
        },
        {
            q: "Are the alarms accurate?",
            a: "Yes. Built-in alarms leverage local browser scheduling. They will trigger precisely as long as the browser tab is open or running in the background. Because the app runs entirely offline, network latency will never delay your reminders."
        },
        {
            q: "Is Screen Stickynote really free?",
            a: "Yes, it is 100% free with no hidden paywalls, no feature limits, and no premium tiers. There are no accounts to create and no data to monetize."
        }
    ];

    return (
        <section id="seo-content" className="w-full bg-slate-950 border-t border-slate-800 flex flex-col relative min-h-screen font-sans overflow-hidden">
            <InteractiveStars />

            {/* Floating Back to Canvas Button */}
            {showTopBtn && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="Back to Canvas"
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-2xl shadow-black transition-all hover:scale-110 active:scale-95 animate-in fade-in zoom-in-75 duration-200"
                >
                    <ChevronUp className="w-6 h-6 stroke-[3]" />
                </button>
            )}

            <div className="max-w-6xl mx-auto w-full px-6 py-20 flex flex-col items-center animate-in fade-in duration-300 space-y-32 relative z-10">
                {/* Hero / Header */}
                <div className="text-center relative w-full lg:max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl shadow-xl shadow-amber-500/20 mb-8 relative hover:rotate-12 transition-transform duration-500">
                        <Sparkles className="w-10 h-10 text-slate-950 absolute" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-100 leading-[1.1] mb-6 tracking-tight">
                        Redefine Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Workspace.</span>
                    </h1>
                    <h2 className="text-base sm:text-lg md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-8 px-4 sm:px-0">
                        The ultimate purely offline productivity tool. Organize ideas, plan tasks, and unleash creativity on a skeuomorphic infinite 3D canvas directly in your browser.
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full text-emerald-400 font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Shield className="w-4 h-4" /> Zero logins. Zero tracking. Just pure productivity.
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="w-full flex flex-col items-center">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 mb-10">
                        <Shield className="w-4 h-4 text-emerald-400" /> Core Principles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {/* Card 1 */}
                        <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                <CloudOff className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-200">100% Offline & Private</h3>
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mt-1">Data ownership by design</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">Your ideas belong to you. Screen Stickynote operates completely locally using standard Progressive Web App (PWA) tech. Your notes never touch a third-party server, ensuring complete immunity from data breaches and cloud outages.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                            <div className="p-3 bg-amber-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                <Layers className="w-7 h-7 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-200">Infinite Virtual Canvas</h3>
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mt-1">Break free from linear lists</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">Think in three dimensions. Pan, zoom, and scatter your thoughts across a borderless workspace. Organise complex projects visually, map out mindwebs, or stack notes just like you would on a physical desk.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                            <div className="p-3 bg-rose-500/10 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                                <Database className="w-7 h-7 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-200">Data Portability</h3>
                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mt-1">No vendor lock-in</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">Take your workspace anywhere. Export your entire digital canvas into a single, lightweight JSON file with one click. Restoring your workspace or migrating to entirely new devices takes less than three seconds.</p>
                        </div>
                    </div>
                </div>

                {/* Split View: Use Cases & Tech Stack */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full">
                    {/* Use Cases */}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-8">
                            <Target className="w-4 h-4 text-sky-400" /> Popular Use Cases
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800/70 flex items-start gap-5 hover:bg-slate-800/40 transition-colors shadow-sm">
                                <div className="p-3 bg-sky-500/10 rounded-xl shrink-0 border border-sky-500/20">
                                    <Target className="w-6 h-6 text-sky-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-200">Project Mapping</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed mt-1">Visualise complex development timelines and feature dependencies cleanly in 3D space.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800/70 flex items-start gap-5 hover:bg-slate-800/40 transition-colors shadow-sm">
                                <div className="p-3 bg-amber-400/10 rounded-xl shrink-0 border border-amber-500/20">
                                    <Lightbulb className="w-6 h-6 text-amber-300" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-200">Brainstorming</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed mt-1">Brain-dump raw concepts effortlessly without worrying about formatting or strict layout bounds.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800/70 flex items-start gap-5 hover:bg-slate-800/40 transition-colors shadow-sm">
                                <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0 border border-emerald-500/20">
                                    <Layout className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-200">Daily Kanban</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed mt-1">Arrange and stack sticky notes into highly customized "To-Do," "Doing," and "Done" columns.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Highlights */}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-8">
                            <Zap className="w-4 h-4 text-fuchsia-400" /> Tech Highlights
                        </h2>
                        <div className="bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800/80 rounded-[2rem] p-8 shadow-xl h-full flex flex-col justify-center">
                            <ul className="space-y-8">
                                <li className="flex gap-5 items-start">
                                    <div className="p-2.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl shrink-0">
                                        <Smartphone className="w-5 h-5 text-fuchsia-400" />
                                    </div>
                                    <div>
                                        <strong className="text-slate-200 text-base block mb-1">PWA Ready</strong>
                                        <span className="text-slate-400 text-sm leading-relaxed block mt-1">Install it straight to your desktop or mobile home screen as a standalone application for a native app feel.</span>
                                    </div>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <div className="p-2.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl shrink-0">
                                        <Zap className="w-5 h-5 text-fuchsia-400" />
                                    </div>
                                    <div>
                                        <strong className="text-slate-200 text-base block mb-1">Blazing Fast Cache</strong>
                                        <span className="text-slate-400 text-sm leading-relaxed block mt-1">Powered by optimized client-side IndexedDB storage for instant load times, keeping thousands of notes fluid.</span>
                                    </div>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <div className="p-2.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl shrink-0">
                                        <Palette className="w-5 h-5 text-fuchsia-400" />
                                    </div>
                                    <div>
                                        <strong className="text-slate-200 text-base block mb-1">Skeuomorphic Design</strong>
                                        <span className="text-slate-400 text-sm leading-relaxed block mt-1">Rich, tactile 3D CSS effects that offer the comforting visual feedback of analog tools inside a digital environment.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* How to Use / Getting Started Guide (AdSense Text Content Support) */}
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-10 w-full border-t border-slate-800/60 pt-16 mt-6">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-emerald-400" /> Getting Started Guide
                        </p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">How to Master the Infinite Canvas</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-slate-400 leading-relaxed">
                        <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-800/80 hover:bg-slate-900/50 transition-colors shadow-sm">
                            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-3">
                                <span className="bg-emerald-500/20 text-emerald-400 w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black shadow-sm border border-emerald-500/20">1</span>
                                Navigating the Workspace
                            </h3>
                            <p className="mb-4 text-sm">The core feature of Screen Stickynote is the boundless virtual environment. Unlike traditional note-taking applications that restrict you to vertical scrolling lists, our canvas allows you to move freely in any direction, mirroring a physical whiteboard.</p>
                            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-500 marker:text-slate-700">
                                <li><strong className="text-slate-300 font-semibold">Panning:</strong> Hold down the Spacebar, click, and drag with your mouse to pan around your workspace. You can also use the middle mouse button, or standard two-finger swipe on touchpads.</li>
                                <li><strong className="text-slate-300 font-semibold">Zooming:</strong> Use the scroll wheel while holding the Control (or Command) key to smoothly zoom in and out. This allows you to overview hundreds of sticky notes at once or focus intensely on a single task.</li>
                                <li><strong className="text-slate-300 font-semibold">Mini-Map Navigation:</strong> Utilize the minimap radar located in the bottom-right corner to instantly jump between distant clusters of notes across your workspace.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-800/80 hover:bg-slate-900/50 transition-colors shadow-sm">
                            <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-3">
                                <span className="bg-sky-500/20 text-sky-400 w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black shadow-sm border border-sky-500/20">2</span>
                                Creating & Managing Notes
                            </h3>
                            <p className="mb-4 text-sm">Sticky notes can be generated dynamically anywhere on the board. We leverage a highly optimized IndexedDB rendering engine to ensure that even with thousands of elements, your browser maintains a perfectly smooth framerate without lag.</p>
                            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-500 marker:text-slate-700">
                                <li><strong className="text-slate-300 font-semibold">Quick Add:</strong> Double-click any empty space on the canvas to instantly spawn a new sticky note precisely at your cursor's location.</li>
                                <li><strong className="text-slate-300 font-semibold">Rich Text Editing:</strong> Double-click inside any existing sticky note to activate the rich-text editor. You can format text, create bulleted checklists, or apply bold styling directly within the interface.</li>
                                <li><strong className="text-slate-300 font-semibold">Color Profiling:</strong> Use the primary utility bar to assign distinct color profiles (like Canary Yellow, Sky Blue, Mint Green, Rose) to visually categorize your tasks by priority or project.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Block (Centered) */}
                <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-10 w-full border-t border-slate-800/60 pt-16 mt-6">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-amber-400" /> Frequently Asked Questions
                        </p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">Everything you need to know.</h2>
                    </div>
                    <div className="space-y-4 w-full">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:bg-slate-900/70 shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full text-left px-6 py-5 flex items-center justify-between transition-colors focus:outline-none"
                                >
                                    <span className="text-base font-bold text-slate-200 pr-4">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-amber-400' : ''}`} />
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{ maxHeight: openFaq === idx ? '500px' : '0' }}
                                >
                                    <div className="px-6 pb-6 pt-0 text-sm text-slate-400 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Footer / Links */}
            <footer className="w-full py-8 md:py-16 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 flex flex-col items-center mt-auto shadow-[0_-15px_30px_rgba(0,0,0,0.3)] relative z-10">
                <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-8 text-sm font-bold text-slate-500 w-full md:w-auto">
                        <Link to="/privacy" className="hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">
                            <Shield className="w-4 h-4 mr-1.5" /> Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">
                            <FileText className="w-4 h-4 mr-1.5" /> Terms of Service
                        </Link>
                        <Link to="/contact" className="hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 border-transparent hover:border-amber-400 pb-1">
                            <Mail className="w-4 h-4 mr-1.5" /> Contact Us
                        </Link>
                    </div>
                    <div className="text-sm text-slate-600 font-mono font-medium text-center md:text-right w-full md:w-auto mt-4 md:mt-0">
                        &copy; 2026 Screen Stickynote. All rights reserved.
                    </div>
                </div>
            </footer>
        </section>
    );
};

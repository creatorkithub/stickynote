import React from 'react';
import { ArrowLeft, Info, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export const AboutPage: React.FC = () => {
    return (
        <PageLayout>
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 flex flex-col items-center animate-in fade-in duration-300 text-center">
                <Link to="/" className="mb-10 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors self-start bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/40 shadow-xl shadow-amber-500/10">
                    <Info className="w-10 h-10 text-amber-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-6">About Us</h1>

                <div className="text-slate-400 max-w-2xl text-left space-y-6 leading-relaxed text-base sm:text-lg mb-12">
                    <p>
                        We believe that the best ideas need room to grow. Traditional linear to-do lists and narrow text documents force our thoughts into rigid structures. Screen Stickynote was born out of a desire to break those boundaries and bring the freedom of a physical whiteboard directly into the digital workspace.
                    </p>
                    <p>
                        Our mission is to provide an <strong>infinite, completely offline virtual canvas</strong> that respects your privacy. By leveraging local browser storage architectures like IndexedDB, we ensure that your data remains yours. No servers, no tracking, and no subscriptions - just pure, uninterrupted workflows.
                    </p>
                    <p>
                        Whether you are brainstorming complex project architectures, designing daily kanban boards, or just keeping a quick spatial memory of what needs to be done, we've designed our 3D skeuomorphic notes to feel tactile, fast, and remarkably satisfying.
                    </p>
                </div>

                <div className="w-full flex-col flex items-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
                    <Heart className="w-8 h-8 text-rose-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-200 mb-2">Crafted for Productivity</h3>
                    <p className="text-slate-400 text-sm max-w-md">
                        Thank you for organizing your mind with Screen Stickynote. If you have any feedback or ideas to share, please don't hesitate to reach out on our <Link to="/contact" className="text-amber-400 hover:underline">Contact Page</Link>.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
};

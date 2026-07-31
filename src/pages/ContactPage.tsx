import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export const ContactPage: React.FC = () => {
    return (
        <PageLayout>
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 flex flex-col items-center animate-in fade-in duration-300 text-center">
                <Link to="/" className="mb-10 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors self-start bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/40 shadow-xl shadow-blue-500/10">
                    <Mail className="w-10 h-10 text-blue-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-6">Get in touch</h1>
                <p className="text-slate-400 max-w-lg mb-10 leading-relaxed text-base">
                    Have a feature request, spotted a bug, or just want to say hi? We'd love to hear from you. Email us directly at our support address below.
                </p>

                <div className="mt-8 py-8 px-5 sm:px-10 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-6 w-full max-w-md shadow-2xl">
                    <span className="text-slate-300 font-bold tracking-wide">Reach out to us:</span>
                    <button
                        onClick={() => window.location.href = `mailto:screenstickynote${String.fromCharCode(64)}gmail.com`}
                        className="text-amber-400 font-bold hover:text-slate-900 hover:bg-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 sm:px-6 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-sm md:text-base lg:text-lg flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full"
                    >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="break-all sm:break-normal leading-tight mt-0.5">
                            screenstickynote<span className="text-amber-500/50 hover:text-slate-900/50 mx-0.5 sm:mx-1 text-xs sm:text-sm pointer-events-none">[at]</span>gmail.com
                        </span>
                    </button>

                </div>
            </div>
        </PageLayout>
    );
};

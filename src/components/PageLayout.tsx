import React, { useEffect } from 'react';
import { InteractiveStars } from './InteractiveStars';
import { Shield, FileText, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PageLayoutProps {
    children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const seoElement = document.getElementById('seo-content');
        if (seoElement) {
            seoElement.style.display = 'none';
            return () => {
                seoElement.style.display = 'flex';
            };
        }
    }, []);

    return (
        <section className="w-full bg-slate-950 flex flex-col relative min-h-screen font-sans overflow-hidden">
            <InteractiveStars />

            <div className="flex-1 flex flex-col w-full relative z-10">
                {children}
            </div>

            <footer className="w-full py-8 md:py-16 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 flex flex-col items-center mt-auto shadow-[0_-15px_30px_rgba(0,0,0,0.3)] relative z-10">
                <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-8 text-sm font-bold text-slate-500 w-full md:w-auto">
                        <Link to="/privacy" className={`hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 ${location.pathname === '/privacy' ? 'text-amber-500 border-amber-500' : 'border-transparent hover:border-amber-400'} pb-1`}>
                            <Shield className="w-4 h-4 mr-1.5" /> Privacy Policy
                        </Link>
                        <Link to="/terms" className={`hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 ${location.pathname === '/terms' ? 'text-amber-500 border-amber-500' : 'border-transparent hover:border-amber-400'} pb-1`}>
                            <FileText className="w-4 h-4 mr-1.5" /> Terms of Service
                        </Link>
                        <Link to="/contact" className={`hover:text-amber-400 flex items-center gap-2 transition-colors border-b-2 ${location.pathname === '/contact' ? 'text-amber-500 border-amber-500' : 'border-transparent hover:border-amber-400'} pb-1`}>
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

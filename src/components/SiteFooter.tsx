import React from 'react';
import { Shield, FileText, Mail, Download, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const SiteFooter: React.FC = () => {
    const location = useLocation();

    return (
        <footer className="w-full py-8 md:py-16 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 flex flex-col items-center mt-auto shadow-[0_-15px_30px_rgba(0,0,0,0.3)] relative z-10">
            <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-center gap-8 md:gap-10">
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-8 text-sm font-bold text-slate-500 w-full md:w-auto">
                    <Link to="/download" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl flex items-center transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 shadow-amber-500/10 border border-amber-400/50">
                        <Download className="w-4 h-4 mr-1.5 stroke-[2.5]" /> Download App
                    </Link>
                    <Link to="/about" className={`hover:text-amber-400 flex items-center gap-2 transition-colors py-2 ${location.pathname === '/about' ? 'text-amber-500' : ''}`}>
                        <Info className="w-4 h-4" /> About Us
                    </Link>
                    <Link to="/privacy" className={`hover:text-amber-400 flex items-center gap-2 transition-colors py-2 ${location.pathname === '/privacy' ? 'text-amber-500' : ''}`}>
                        <Shield className="w-4 h-4" /> Web Privacy
                    </Link>
                    <Link to="/windows-app-privacy" rel="nofollow" className={`hover:text-amber-400 flex items-center gap-2 transition-colors py-2 ${location.pathname === '/windows-app-privacy' ? 'text-amber-500' : ''}`}>
                        <Shield className="w-4 h-4" /> App Privacy
                    </Link>
                    <Link to="/terms" className={`hover:text-amber-400 flex items-center gap-2 transition-colors py-2 ${location.pathname === '/terms' ? 'text-amber-500' : ''}`}>
                        <FileText className="w-4 h-4" /> Terms of Service
                    </Link>
                    <Link to="/contact" className={`hover:text-amber-400 flex items-center gap-2 transition-colors py-2 ${location.pathname === '/contact' ? 'text-amber-500' : ''}`}>
                        <Mail className="w-4 h-4" /> Contact Us
                    </Link>
                </div>
                <div className="text-sm text-slate-600 font-mono font-medium text-center w-full mt-2 lg:mt-4">
                    &copy; 2026 Screen Stickynote. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

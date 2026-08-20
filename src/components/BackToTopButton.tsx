import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        // Initial check in case they reload while scrolled down
        toggleVisibility();

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9000] p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group flex items-center justify-center cursor-pointer"
            title="Bring to top"
        >
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
    );
};

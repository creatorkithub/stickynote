import React, { useEffect } from 'react';
import { InteractiveStars } from './InteractiveStars';
import { SiteFooter } from './SiteFooter';

interface PageLayoutProps {
    children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
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

            <SiteFooter />
        </section>
    );
};

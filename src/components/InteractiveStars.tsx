import React, { useEffect, useRef, useState } from 'react';

export const InteractiveStars: React.FC = () => {
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobileOrTablet(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isMobileOrTablet) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;

        const setSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                width = parent.clientWidth;
                height = parent.clientHeight;
                canvas.width = width;
                canvas.height = height;
            }
        };
        setSize();

        const observer = new ResizeObserver(() => setSize());
        if (canvas.parentElement) observer.observe(canvas.parentElement);

        const stars: { x: number; y: number; r: number; vx: number; vy: number }[] = [];
        const numStars = window.innerWidth > 768 ? 400 : 180;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * (width || window.innerWidth),
                y: Math.random() * (height || 3000),
                r: Math.random() * 2.5 + 1.2,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4
            });
        }

        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.x += star.vx;
                star.y += star.vy;

                // Bounce strictly within dimensions
                if (star.x < 0) { star.x = 0; star.vx *= -1; }
                if (star.x > width) { star.x = width; star.vx *= -1; }
                if (star.y < 0) { star.y = 0; star.vy *= -1; }
                if (star.y > height) { star.y = height; star.vy *= -1; }

                const dx = mouseX - star.x;
                const dy = mouseY - star.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Strong repel effect around mouse
                if (dist < 120) {
                    star.x -= (dx / dist) * 1.5;
                    star.y -= (dy / dist) * 1.5;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                const opacity = dist < 200 ? Math.min(0.8, 1 - dist / 200 + 0.1) : 0.15;
                ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
                ctx.fill();

                // Mouse connection line
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(251, 191, 36, ${0.25 * (1 - dist / 180)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }

                // Constellation connections
                for (let j = i + 1; j < stars.length; j++) {
                    const star2 = stars[j];
                    const dx2 = star.x - star2.x;
                    const dy2 = star.y - star2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 100) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(star2.x, star2.y);
                        ctx.strokeStyle = `rgba(251, 191, 36, ${0.1 * (1 - dist2 / 100)})`;
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobileOrTablet]);

    if (isMobileOrTablet) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

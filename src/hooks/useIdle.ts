import { useState, useEffect, useRef } from 'react';

export function useIdle(timeoutMs: number, ignoreIf: boolean = false) {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (ignoreIf) {
            setIsIdle(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const resetIdleTimer = () => {
            setIsIdle(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsIdle(true);
            }, timeoutMs);
        };

        // Initialize
        resetIdleTimer();

        // Attach event listeners for activity
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];
        events.forEach(event => {
            window.addEventListener(event, resetIdleTimer, { passive: true });
        });

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => {
                window.removeEventListener(event, resetIdleTimer);
            });
        };
    }, [timeoutMs, ignoreIf]);

    return isIdle;
}

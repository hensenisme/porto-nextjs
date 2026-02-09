'use client';
import { useEffect } from 'react';

export default function ScrollToAnchor() {
    useEffect(() => {
        // 1. Handle Initial Hash on Load
        const handleScroll = () => {
            if (window.location.hash) {
                const hash = window.location.hash;
                const targetId = hash.substring(1);
                const element = document.getElementById(targetId);

                if (element) {
                    const headerOffset = 100; // Adjust for Fixed Navbar height
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                    });
                }
            }
        };

        // Delay slightly to ensure layout is ready (Next.js hydration)
        const timeoutId = setTimeout(handleScroll, 500);

        // 2. Listen for hash changes (if user clicks links on same page)
        window.addEventListener('hashchange', handleScroll);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('hashchange', handleScroll);
        };
    }, []);

    return null;
}

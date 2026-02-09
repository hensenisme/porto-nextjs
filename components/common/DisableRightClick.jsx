'use client';
import { useEffect } from 'react';

export default function DisableRightClick() {
    useEffect(() => {
        const handleContext = (e) => {
            e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContext);
        return () => document.removeEventListener('contextmenu', handleContext);
    }, []);

    return null;
}

'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function MagneticButton({ children, href, className = '', ...props }) {
    const magnetic = useRef(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.35); // Magnetic strength
            yTo(y * 0.35);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        if (magnetic.current) {
            magnetic.current.addEventListener("mousemove", handleMouseMove);
            magnetic.current.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (magnetic.current) {
                magnetic.current.removeEventListener("mousemove", handleMouseMove);
                magnetic.current.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    // Class for consistent styling if needed
    const baseClass = `magnetic-btn ${className}`;

    if (href) {
        return (
            <Link href={href} ref={magnetic} className={baseClass} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <div ref={magnetic} className={baseClass} {...props}>
            {children}
        </div>
    );
}

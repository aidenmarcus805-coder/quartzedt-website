'use client';

import { useMemo } from 'react';

// Optimized Shutter using CSS variables driving transforms
// This allows the parent 'onScroll' loop to just update one variable (--shutter-progress)
// on the container, achieving 60fps without Re-rendering React components.

export default function ShutterReveal() {
    const BLADES = 12; // More blades = smoother/rounder iris
    const blades = useMemo(() => Array.from({ length: BLADES }), []);

    return (
        <div
            className="pointer-events-none absolute top-0 inset-x-0 z-40 flex items-center justify-center overflow-hidden h-screen"
            style={{
                // Default closed
                // --shutter-progress will be set by parent on the container div or :root
                opacity: 'var(--shutter-opacity, 1)',
                pointerEvents: 'none',
                transition: 'opacity 0.1s linear', // smooth out any jitter
            }}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {blades.map((_, i) => {
                    const rotateStep = 360 / BLADES;
                    const baseRotate = rotateStep * i;

                    return (
                        <div
                            key={i}
                            className="absolute bg-black"
                            style={{
                                // Geometry: Huge blades to cover screen
                                width: '120vmax', // Overkill to ensure corners are covered
                                height: '120vmax',

                                // Position: Anchored at center, but we want them to pivot from their "corner"
                                // actually standard iris has blades arranged tangentially.
                                // Simpler approximation: Blades pivoting around center + translating out.

                                transformOrigin: 'bottom right',
                                bottom: '50%',
                                right: '50%',

                                // The Magic: CSS calc based on var(--shutter-progress)
                                // Rotate: base + (progress * 90deg)
                                // Translate: progress * 100%
                                transform: `
                    rotate(calc(${baseRotate}deg + (var(--shutter-progress, 0) * 45deg))) 
                    translate(calc(var(--shutter-progress, 0) * 50%), calc(var(--shutter-progress, 0) * 50%))
                  `,

                                clipPath: 'polygon(100% 100%, 0% 100%, 0% 0%)',
                                willChange: 'transform',
                            }}
                        />
                    );
                })}
            </div>

            {/* Central Ring (Lens element) - Fades out as it opens */}
            <div
                className="absolute rounded-full border border-white/5"
                style={{
                    width: '40vmin',
                    height: '40vmin',
                    opacity: 'calc(1 - var(--shutter-progress, 0))',
                    transform: 'scale(calc(0.8 + var(--shutter-progress, 0) * 0.5))',
                }}
            />
        </div>
    );
}

import { cn } from '@/lib/utils';
import { type CSSProperties, type HTMLAttributes, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
    delay?: number;
    duration?: number;
    once?: boolean;
    rootMargin?: string;
    threshold?: number;
    y?: number;
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    duration = 780,
    once = true,
    rootMargin = '0px 0px -12% 0px',
    style,
    threshold = 0.14,
    y = 34,
    ...props
}: ScrollRevealProps) {
    const revealRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = revealRef.current;

        if (!element || typeof window === 'undefined') {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            setIsVisible(true);

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (once) {
                        observer.unobserve(entry.target);
                    }

                    return;
                }

                if (!once) {
                    setIsVisible(false);
                }
            },
            { rootMargin, threshold },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [once, rootMargin, threshold]);

    return (
        <div
            ref={revealRef}
            className={cn('maz-scroll-reveal', className)}
            data-reveal-state={isVisible ? 'visible' : 'hidden'}
            style={
                {
                    '--maz-reveal-delay': `${delay}ms`,
                    '--maz-reveal-duration': `${duration}ms`,
                    '--maz-reveal-y': `${y}px`,
                    ...style,
                } as CSSProperties
            }
            {...props}
        >
            {children}
        </div>
    );
}

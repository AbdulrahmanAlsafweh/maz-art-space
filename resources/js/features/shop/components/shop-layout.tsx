import { useEffect, useRef, type ReactNode } from 'react';
import { ShopFooter } from './shop-footer';
import { ShopHeader } from './shop-header';

interface ShopLayoutProps {
    children: ReactNode;
}

const SHOP_SCALE = 0.575;

export function ShopLayout({ children }: ShopLayoutProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        const supportsZoom = window.CSS?.supports('zoom', '1') ?? false;

        if (!viewport || !content || supportsZoom) {
            return;
        }

        const syncHeight = () => {
            viewport.style.height = `${Math.ceil(content.scrollHeight * SHOP_SCALE)}px`;
        };

        const resizeObserver = new ResizeObserver(syncHeight);
        resizeObserver.observe(content);
        window.addEventListener('load', syncHeight);
        window.addEventListener('resize', syncHeight);
        const frame = window.requestAnimationFrame(syncHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('load', syncHeight);
            window.removeEventListener('resize', syncHeight);
            window.cancelAnimationFrame(frame);
            viewport.style.removeProperty('height');
        };
    }, []);

    return (
        <div ref={viewportRef} className="maz-shop-viewport min-h-screen overflow-x-clip bg-white">
            <div ref={contentRef} className="maz-shop-content origin-top bg-white font-['Instrument_Sans'] text-[#404651]">
                <ShopHeader />
                {children}
                <ShopFooter />
            </div>
        </div>
    );
}

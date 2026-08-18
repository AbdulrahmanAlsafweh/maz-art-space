import type { ReactNode } from 'react';
import { ShopFooter } from './shop-footer';
import { ShopHeader } from './shop-header';

interface ShopLayoutProps {
    children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
    return (
        <div className="min-h-screen overflow-x-clip bg-white">
            <div className="origin-top bg-white font-['Instrument_Sans'] text-[#404651] [zoom:0.575]">
                <ShopHeader />
                {children}
                <ShopFooter />
            </div>
        </div>
    );
}

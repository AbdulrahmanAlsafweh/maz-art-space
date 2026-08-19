import { type ReactNode } from 'react';
import { ShopFooter } from './shop-footer';
import { ShopHeader } from './shop-header';

interface ShopLayoutProps {
    children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
    return (
        <div className="maz-shop-viewport min-h-screen bg-white">
            <div className="maz-shop-content bg-white pt-[92px] font-['Instrument_Sans'] text-[#404651]">
                <ShopHeader />
                {children}
                <ShopFooter />
            </div>
        </div>
    );
}

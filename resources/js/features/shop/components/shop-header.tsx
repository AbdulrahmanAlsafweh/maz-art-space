import { Link } from '@inertiajs/react';
import { ShoppingBag, UserRound } from 'lucide-react';

function HomeHeaderNav() {
    return (
        <nav className="hidden items-center gap-12 text-[14px] tracking-[0.16em] text-[#22252c] md:flex">
            <a href="/#kit-options" className="border-b border-[#123b6d] pb-2 text-[#123b6d]">
                Shop
            </a>
            <a href="/#our-story" className="transition-colors hover:text-[#123b6d]">
                Our Story
            </a>
            <a href="/#gallery" className="transition-colors hover:text-[#123b6d]">
                Gallery
            </a>
            <a href="#cart" className="transition-colors hover:text-[#123b6d]">
                Cart
            </a>
        </nav>
    );
}

export function ShopHeader() {
    return (
        <header className="bg-white font-['Instrument_Sans'] text-[#123b6d]">
            <div className="flex h-[35px] items-center justify-center bg-[#123b6d] text-[13px] font-medium tracking-[0.24em] text-white uppercase">
                FREE DELIVERY OVER LEBANON
            </div>
            <div className="relative mx-auto flex h-[112px] max-w-[1788px] items-center justify-between px-6 md:px-10 xl:px-0">
                <HomeHeaderNav />

                <Link
                    href="/"
                    className="font-['Cormorant_Garamond'] text-[58px] leading-none font-semibold text-[#123b6d] md:absolute md:left-1/2 md:-translate-x-1/2 md:text-[88px]"
                    aria-label="MAZ home"
                >
                    MAZ
                </Link>

                <div className="flex items-center gap-7">
                    <a href="#cart" className="transition-colors hover:text-[#0f315b]" aria-label="Cart">
                        <ShoppingBag className="size-6 stroke-[2]" />
                    </a>
                    <a href="#account" className="transition-colors hover:text-[#0f315b]" aria-label="Account">
                        <UserRound className="size-6 stroke-[2]" />
                    </a>
                </div>
            </div>
        </header>
    );
}

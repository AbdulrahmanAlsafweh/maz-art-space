import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from './cart-context';

const defaultAnnouncementBar = {
    enabled: true,
    texts: ['FREE DELIVERY OVER LEBANON'],
    backgroundColor: '#123b6d',
    textColor: '#ffffff',
};

function HomeHeaderNav() {
    return (
        <nav className="hidden items-center gap-12 text-[9px] tracking-[0.16em] text-[#22252c] md:flex">
            <a href="/#kit-options" className="border-b border-[#123b6d] pb-2 text-[#123b6d]">
                Shop
            </a>
            <a href="/#gallery" className="transition-colors hover:text-[#123b6d]">
                Gallery
            </a>
        </nav>
    );
}

function AnnouncementBar() {
    const { announcementBar = defaultAnnouncementBar } = usePage<SharedData>().props;
    const [activeTextIndex, setActiveTextIndex] = useState(0);
    const texts = useMemo(() => announcementBar.texts.map((text) => text.trim()).filter(Boolean), [announcementBar.texts]);
    const textKey = texts.join('|');

    useEffect(() => {
        setActiveTextIndex(0);
    }, [textKey]);

    useEffect(() => {
        if (texts.length < 2) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setActiveTextIndex((currentIndex) => (currentIndex + 1) % texts.length);
        }, 4200);

        return () => window.clearInterval(intervalId);
    }, [texts.length]);

    if (!announcementBar.enabled || texts.length === 0) {
        return null;
    }

    return (
        <div
            className="relative flex h-[20px] items-center justify-center overflow-hidden px-4 text-center text-[7px] font-medium tracking-[0.24em] uppercase"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}
            aria-live="polite"
        >
            {texts.map((text, index) => (
                <span
                    key={`${text}-${index}`}
                    className={[
                        'absolute inset-0 flex items-center justify-center px-4 transition-all duration-700 ease-out',
                        activeTextIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                    ].join(' ')}
                    aria-hidden={activeTextIndex !== index}
                >
                    {text}
                </span>
            ))}
        </div>
    );
}

export function ShopHeader() {
    const { totalQuantity } = useCart();

    return (
        <header className="sticky top-0 z-[200] border-b border-[#e6e9ed] bg-white font-['Instrument_Sans'] text-[#123b6d] shadow-[0_5px_14px_rgba(18,59,109,0.06)]">
            <AnnouncementBar />
            <div className="relative mx-auto flex h-[64px] max-w-[1028px] items-center justify-between px-6 md:px-10 xl:px-0">
                <HomeHeaderNav />

                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 font-['Cormorant_Garamond'] text-[33px] leading-none font-semibold text-[#111111] md:text-[51px]"
                    aria-label="MAZ home"
                >
                    MAZ
                </Link>

                <div className="ml-auto flex items-center gap-7">
                    <Link href="/cart" className="relative transition-colors hover:text-[#0f315b]" aria-label={`Cart with ${totalQuantity} items`}>
                        <ShoppingBag className="size-[15px] stroke-[2]" />
                        {totalQuantity > 0 ? (
                            <span className="absolute -top-3 -right-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#123b6d] px-1.5 text-[6px] leading-none font-semibold text-white">
                                {totalQuantity}
                            </span>
                        ) : null}
                    </Link>
                </div>
            </div>
        </header>
    );
}

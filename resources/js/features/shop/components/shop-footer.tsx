import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShopContainer } from './shop-design';

export function ShopFooter() {
    const { policyPages = [] } = usePage<SharedData>().props;

    return (
        <footer className="border-t border-[#d9dde2] bg-white font-['Instrument_Sans'] text-[#404651]">
            <ShopContainer className="pt-20 pb-9 lg:pt-24">
                <div className="grid gap-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                    <div>
                        <div className="font-['Cormorant_Garamond'] text-[3rem] leading-none font-semibold text-[#111111] md:text-[3.4rem]">MAZ</div>
                        <p className="maz-body mt-8 max-w-[28ch]">Curating tools for intentional creators. Elevating the daily practice of art.</p>
                    </div>

                    <div>
                        <h3 className="maz-label">SHOP</h3>
                        <ul className="mt-8 space-y-5 text-[0.78rem] font-medium tracking-[0.12em] text-[#22252c] uppercase">
                            <li>
                                <a href="/#kit-options" className="transition-colors hover:text-[#123b6d]">
                                    All Products
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="maz-label">SUPPORT</h3>
                        <ul className="mt-8 space-y-5 text-[0.78rem] font-medium tracking-[0.12em] text-[#22252c] uppercase">
                            <li>
                                <a href="/#faq" className="transition-colors hover:text-[#123b6d]">
                                    FAQ
                                </a>
                            </li>
                            {policyPages.map((policy) => (
                                <li key={policy.href}>
                                    <Link href={policy.href} className="transition-colors hover:text-[#123b6d]">
                                        {policy.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-18 flex flex-col gap-8 border-t border-[#d9dde2] pt-8 text-[0.85rem] text-[#5c626d] md:flex-row md:items-center md:justify-between">
                    <p>&copy; 2026 MAZ Art Space. Crafted with intentionality.</p>
                    <div className="flex flex-wrap gap-10 text-[0.78rem] font-medium tracking-[0.12em] text-[#22252c] uppercase">
                        <a href="https://wa.me/96181309837" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#123b6d]">
                            Developed by Abdulrahman Safweh
                        </a>
                        <a
                            href="https://www.instagram.com/mazartspace/"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-[#123b6d]"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </ShopContainer>
        </footer>
    );
}

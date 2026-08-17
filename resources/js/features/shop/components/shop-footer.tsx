import { ArrowRight } from 'lucide-react';

export function ShopFooter() {
    return (
        <footer className="border-t border-[#d9dde2] bg-white px-6 font-['Instrument_Sans'] text-[#404651] md:px-10">
            <div className="mx-auto max-w-[1788px] pt-24 pb-9">
                <div className="grid gap-14 md:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
                    <div>
                        <div className="font-['Cormorant_Garamond'] text-[72px] leading-none font-semibold text-[#123b6d] md:text-[88px]">MAZ</div>
                        <p className="mt-11 max-w-[320px] text-[19px] leading-8">
                            Curating tools for intentional creators. Elevating the daily practice of art.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[18px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">SHOP</h3>
                        <ul className="mt-10 space-y-7 text-[18px]">
                            <li>
                                <a href="/#kit-options">All Products</a>
                            </li>
                            <li>
                                <a href="/#kit-options">Watercolor Kits</a>
                            </li>
                            <li>
                                <a href="/#kit-options">Accessories</a>
                            </li>
                            <li>
                                <a href="/#kit-options">Gift Cards</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[18px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">SUPPORT</h3>
                        <ul className="mt-10 space-y-7 text-[18px]">
                            <li>
                                <a href="/#faq">FAQ</a>
                            </li>
                            <li>
                                <a href="#shipping">Shipping & Returns</a>
                            </li>
                            <li>
                                <a href="#contact">Contact Us</a>
                            </li>
                            <li>
                                <a href="#care-guide">Care Guide</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[18px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">STAY CONNECTED</h3>
                        <p className="mt-10 max-w-[300px] text-[19px] leading-8">Subscribe for updates and artistic inspiration.</p>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="mt-8 h-[62px] w-full max-w-[385px] border border-[#c9ced6] px-5 text-[18px] text-[#404651] placeholder:text-[#a2a8b0] focus:border-[#123b6d] focus:outline-none"
                        />
                        <button
                            type="button"
                            className="mt-9 inline-flex items-center gap-3 text-[18px] leading-none font-medium tracking-[0.18em] text-[#123b6d]"
                        >
                            SUBSCRIBE
                            <ArrowRight className="size-5 stroke-[1.8]" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="mt-24 flex flex-col gap-8 border-t border-[#d9dde2] pt-9 text-[16px] md:flex-row md:items-center md:justify-between">
                    <p>&copy; 2026 MAZ Art Space. Crafted with intentionality.</p>
                    <div className="flex flex-wrap gap-10">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#instagram">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

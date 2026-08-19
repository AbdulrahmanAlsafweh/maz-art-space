export function ShopFooter() {
    return (
        <footer className="border-t border-[#d9dde2] bg-white px-6 font-['Instrument_Sans'] text-[#404651] md:px-10">
            <div className="mx-auto max-w-[1028px] pt-24 pb-9">
                <div className="grid gap-14 md:grid-cols-[1.1fr_1fr_1fr]">
                    <div>
                        <div className="font-['Cormorant_Garamond'] text-[41px] leading-none font-semibold text-[#111111] md:text-[51px]">MAZ</div>
                        <p className="mt-11 max-w-[184px] text-[11px] leading-8">
                            Curating tools for intentional creators. Elevating the daily practice of art.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[10px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">SHOP</h3>
                        <ul className="mt-10 space-y-7 text-[9px]">
                            <li>
                                <a href="/#kit-options">All Products</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[10px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">SUPPORT</h3>
                        <ul className="mt-10 space-y-7 text-[9px]">
                            <li>
                                <a href="/#faq">FAQ</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-24 flex flex-col gap-8 border-t border-[#d9dde2] pt-9 text-[9px] md:flex-row md:items-center md:justify-between">
                    <p>&copy; 2026 MAZ Art Space. Crafted with intentionality.</p>
                    <div className="flex flex-wrap gap-10 text-[9px]">
                        <a href="#instagram">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

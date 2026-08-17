import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export interface KitOptionCardProps {
    title: string;
    description: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
    productHref?: string;
    featured?: boolean;
}

export function KitOptionCard({ title, description, price, imageSrc, imageAlt, productHref }: KitOptionCardProps) {
    return (
        <article className="flex h-full flex-col items-center text-center">
            {productHref ? (
                <Link
                    href={productHref}
                    className="group flex aspect-square w-full items-center justify-center bg-[#f4f1ed] px-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                    aria-label={`Open ${title}`}
                >
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full max-w-[410px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-[#f4f1ed] px-6">
                    <img src={imageSrc} alt={imageAlt} className="w-full max-w-[410px] object-contain" />
                </div>
            )}

            <div className="flex w-full flex-1 flex-col items-center pt-9">
                <h3 className="font-['Cormorant_Garamond'] text-[32px] leading-none font-medium text-[#123b6d] md:text-[36px]">
                    {productHref ? (
                        <Link href={productHref} className="transition-colors hover:text-[#0f315b]">
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </h3>
                <p className="mt-5 text-[17px] leading-7 text-[#4a4f58]">{description}</p>
                <p className="mt-8 font-['Instrument_Sans'] text-[17px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">{price}</p>
                <Button
                    type="button"
                    variant="outline"
                    className="mt-10 h-[64px] w-full rounded-[2px] border-[#123b6d] bg-white font-['Instrument_Sans'] text-[15px] font-medium tracking-[0.22em] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white"
                >
                    ADD TO CART
                </Button>
            </div>
        </article>
    );
}

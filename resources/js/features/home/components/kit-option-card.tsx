import { AddToCartButton } from '@/features/shop/components/add-to-cart-button';
import { type ShopProduct } from '@/features/shop/product-data';
import { Link } from '@inertiajs/react';

export interface KitOptionCardProps {
    title: string;
    description: string;
    price: string;
    compareAtPrice?: string;
    badgeLabel?: string;
    imageSrc: string;
    imageAlt: string;
    productHref?: string;
    cartProduct?: ShopProduct;
    featured?: boolean;
}

export function KitOptionCard({
    title,
    description,
    price,
    compareAtPrice,
    badgeLabel,
    imageSrc,
    imageAlt,
    productHref,
    cartProduct,
}: KitOptionCardProps) {
    return (
        <article className="relative flex h-full flex-col items-center text-center">
            {badgeLabel ? (
                <div className="absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-center bg-[#123b6d] px-5 text-[21px] leading-none font-bold tracking-[0.16em] text-white uppercase md:text-[16px]">
                    {badgeLabel}
                </div>
            ) : null}

            {productHref ? (
                <Link
                    href={productHref}
                    className="group flex aspect-square w-full items-center justify-center bg-[#f4f1ed] px-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                    aria-label={`Open ${title}`}
                >
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        decoding="async"
                        loading="lazy"
                        className="w-full max-w-[410px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-[#f4f1ed] px-6">
                    <img src={imageSrc} alt={imageAlt} decoding="async" loading="lazy" className="w-full max-w-[410px] object-contain" />
                </div>
            )}

            <div className="flex w-full flex-1 flex-col items-center pt-9">
                <h3 className="font-['Cormorant_Garamond'] text-[32px] leading-none font-semibold text-[#123b6d] md:text-[36px]">
                    {productHref ? (
                        <Link href={productHref} className="transition-colors hover:text-[#0f315b]">
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </h3>
                <p className="mt-5 text-[17px] leading-7 text-[#4a4f58]">{description}</p>
                <p className="mt-8 flex items-center justify-center gap-4 font-['Instrument_Sans'] text-[22px] leading-none font-medium tracking-[0.12em] text-[#123b6d] md:text-[24px]">
                    {compareAtPrice ? <span className="text-[#7a818c] line-through decoration-[#a0432f] decoration-2">{compareAtPrice}</span> : null}
                    <span>{price}</span>
                </p>
                {cartProduct ? <AddToCartButton product={cartProduct} className="mt-10 h-[64px] w-full text-[15px]" /> : null}
            </div>
        </article>
    );
}

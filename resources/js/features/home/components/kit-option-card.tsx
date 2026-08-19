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
        <article className="maz-card relative flex h-full flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1">
            {badgeLabel ? (
                <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-center bg-[#123b6d] px-5 text-[0.92rem] leading-none font-bold tracking-[0.14em] text-white uppercase md:text-[0.78rem]">
                    {badgeLabel}
                </div>
            ) : null}

            {productHref ? (
                <Link
                    href={productHref}
                    className="group maz-media-panel flex aspect-[1.08/1] w-full items-center justify-center px-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                    aria-label={`Open ${title}`}
                >
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        decoding="async"
                        loading="lazy"
                        className="w-full max-w-[270px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            ) : (
                <div className="maz-media-panel flex aspect-[1.08/1] w-full items-center justify-center px-7">
                    <img src={imageSrc} alt={imageAlt} decoding="async" loading="lazy" className="w-full max-w-[270px] object-contain" />
                </div>
            )}

            <div className="flex w-full flex-1 flex-col items-center px-6 pt-8 pb-7">
                <h3 className="maz-card-title">
                    {productHref ? (
                        <Link href={productHref} className="transition-colors hover:text-[#0f315b]">
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </h3>
                <p className="maz-body mt-4 max-w-[24ch]">{description}</p>
                <p className="mt-7 flex items-center justify-center gap-4 font-['Instrument_Sans'] text-[1.1rem] leading-none font-semibold tracking-[0.08em] text-[#123b6d]">
                    {compareAtPrice ? <span className="text-[#7a818c] line-through decoration-[#a0432f] decoration-2">{compareAtPrice}</span> : null}
                    <span>{price}</span>
                </p>
                {cartProduct ? <AddToCartButton product={cartProduct} className="mt-8 w-full" /> : null}
            </div>
        </article>
    );
}

import { Button } from '@/components/ui/button';
import { kitImage, productGalleryImages } from '@/features/shop/product-data';
import { Plus, ShoppingBag, Star, StarHalf } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from './shop-layout';

const productThumbnails = productGalleryImages.slice(1);

const specifications = [
    { label: 'Dimensions', value: '8.5" x 11" (Box)' },
    { label: 'Weight', value: '1.2 lbs' },
    { label: 'Material', value: 'Archival Pigments, Natural Hair, Cold-Pressed Cotton' },
] as const;

const reviews = [
    {
        quote: '"The pigments blend with such an effortless grace. It feels less like painting and more like guiding colored water across the canvas. A truly premium experience."',
        author: '- ELENA R., ILLUSTRATOR',
        rating: 5,
    },
    {
        quote: '"I appreciate the intentionality of the minimal palette. It forces you to mix and discover new hues. The cold-pressed paper holds washes beautifully without buckling."',
        author: '- MARCUS T., FINE ARTIST',
        rating: 5,
    },
    {
        quote: '"Beautifully packaged and the brushes hold a phenomenal amount of water. A perfect travel companion for plein air studies."',
        author: '- SARAH L., HOBBYIST',
        rating: 4,
    },
] as const;

function RatingStars({ half = false, count = 5 }: { half?: boolean; count?: number }) {
    return (
        <span className="inline-flex items-center gap-0.5 text-[#a0432f]" aria-hidden="true">
            {Array.from({ length: count }).map((_, index) => (
                <Star key={index} className="size-4 fill-current stroke-current" />
            ))}
            {half ? <StarHalf className="size-4 fill-current stroke-current" /> : null}
        </span>
    );
}

function ProductGallery() {
    const [activeImage, setActiveImage] = useState(productGalleryImages[0]);

    return (
        <div>
            <div className="flex aspect-[1.35/1] items-center justify-center bg-white px-8 shadow-[0_22px_70px_rgba(18,59,109,0.06)]">
                <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className={activeImage.src === kitImage ? 'w-full max-w-[560px] object-contain' : 'h-full w-full object-cover'}
                />
            </div>

            <div className="mt-6 grid max-w-[475px] grid-cols-3 gap-4">
                {productThumbnails.map((image) => (
                    <button
                        key={image.src}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className="aspect-square overflow-hidden bg-[#f4f1ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function ProductInfo() {
    return (
        <aside className="pt-2">
            <div className="flex items-center gap-3 text-[16px] text-[#363b45]">
                <RatingStars half />
                <span>4.9/5 (120 reviews)</span>
            </div>

            <h1 className="mt-8 font-['Cormorant_Garamond'] text-[40px] leading-none font-semibold text-[#123b6d] md:text-[43px]">
                MAZ Watercolor Kit
            </h1>
            <p className="mt-6 text-[26px] leading-none font-medium text-[#a0432f]">$45.00</p>

            <p className="mt-10 text-[20px] leading-8 text-[#4a4f58]">
                Discover the fluidity of pigment and paper with the curated MAZ Watercolor Kit. Designed for artists who seek intentionality in every
                stroke. Includes 20 lightfast pigments, 2 professional brushes, and 300gsm cold-pressed paper.
            </p>

            <div className="mt-12 space-y-4">
                <Button
                    type="button"
                    variant="outline"
                    className="h-[48px] w-full rounded-none border-[#123b6d] bg-white text-[13px] font-medium tracking-[0.18em] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white"
                >
                    <ShoppingBag className="size-4" aria-hidden="true" />
                    ADD TO CART
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="h-[46px] w-full rounded-none border-[#838994] bg-white text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#f8f9fb] hover:text-[#123b6d]"
                >
                    BUY NOW
                </Button>
            </div>

            <div className="mt-16 border-t border-[#e1e3e7] pt-7">
                <div className="flex items-center justify-between">
                    <h2 className="font-['Cormorant_Garamond'] text-[27px] leading-none font-medium text-[#123b6d]">Specifications</h2>
                    <Plus className="size-5 text-[#5c626d]" aria-hidden="true" />
                </div>

                <dl className="mt-6 divide-y divide-[#edf0f3] text-[16px] text-[#454a54]">
                    {specifications.map((item) => (
                        <div key={item.label} className="grid gap-3 py-4 sm:grid-cols-[0.85fr_1.15fr]">
                            <dt>{item.label}</dt>
                            <dd className="text-left sm:text-right">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </aside>
    );
}

function ReviewCard({ quote, author, rating }: (typeof reviews)[number]) {
    return (
        <figure className="bg-white p-8 shadow-[0_24px_70px_rgba(18,59,109,0.06)] md:p-9">
            <RatingStars count={rating} />
            <blockquote className="mt-8 text-[19px] leading-8 font-medium text-[#24272d] italic">{quote}</blockquote>
            <figcaption className="mt-8 text-[12px] leading-none font-semibold tracking-[0.12em] text-[#7a818c] uppercase">{author}</figcaption>
        </figure>
    );
}

function ArtistReviews() {
    return (
        <section className="px-6 pt-20 pb-32 md:px-10 md:pt-28 md:pb-36">
            <div className="mx-auto max-w-[1120px]">
                <div className="mx-auto max-w-[500px] text-center">
                    <h2 className="font-['Cormorant_Garamond'] text-[38px] leading-none font-medium text-[#123b6d] md:text-[42px]">Artist Reviews</h2>
                    <p className="mt-6 text-[16px] leading-7 text-[#4a4f58]">
                        Experiences from the studio. How the MAZ collection inspires creators worldwide.
                    </p>
                </div>

                <div className="mt-24 grid gap-8 md:grid-cols-3">
                    {reviews.map((review) => (
                        <ReviewCard key={review.author} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ProductPage() {
    return (
        <ShopLayout>
            <main>
                <section className="px-6 pt-28 pb-44 md:px-10 md:pt-32 md:pb-56">
                    <div className="mx-auto grid max-w-[1120px] gap-16 lg:grid-cols-[1.54fr_1fr] lg:gap-16">
                        <ProductGallery />
                        <ProductInfo />
                    </div>
                </section>
                <ArtistReviews />
            </main>
        </ShopLayout>
    );
}

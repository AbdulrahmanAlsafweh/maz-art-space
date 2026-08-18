import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { primaryShopProduct, productGalleryImages } from '@/features/shop/product-data';
import { router } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Droplets, Maximize2, Paintbrush, Palette, ZoomIn, ZoomOut } from 'lucide-react';
import { type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent, useRef, useState } from 'react';
import { AddToCartButton } from './add-to-cart-button';
import { RatingStars } from './rating-stars';
import { ShopLayout } from './shop-layout';

const zoomSteps = [1, 1.35, 1.7, 2.1] as const;
const galleryImageCount = productGalleryImages.length;

const reviews = [
    {
        quote: '"The pigments blend with such an effortless grace. It feels less like painting and more like guiding colored water across the canvas. A truly premium experience."',
        author: '- ELENA R., ILLUSTRATOR',
        rating: 5,
    },
    {
        quote: '"I appreciate the intentionality of the minimal palette. It forces you to mix and discover new hues. The watercolor paper holds washes beautifully without buckling."',
        author: '- AHMAD T., FINE ARTIST',
        rating: 5,
    },
    {
        quote: '"Beautifully packaged and the brushes hold a phenomenal amount of water. A perfect travel companion for plein air studies."',
        author: '- SARAH L., HOBBYIST',
        rating: 4,
    },
] as const;

const howItWorksSteps = [
    {
        title: 'Fill the brush',
        description: 'Unscrew the brush, add water, screw it back on. Done. Instant grip and you’re ready to paint.',
        accent: '#159bd7',
        softColor: '#eaf7fd',
        icon: Droplets,
    },
    {
        title: 'Load your color',
        description:
            'Squeeze the brush gently. It’ll fill to a drip, then mix it on the palette until you like it. AKA: no cups. More watercolor, fewer miracles.',
        accent: '#e9b80f',
        softColor: '#fff8d9',
        icon: Palette,
    },
    {
        title: 'Paint',
        description: 'Brush fresh to paper and watch the color bloom. Doodle, blend, experiment. It’s hard to mess up.',
        accent: '#d84b68',
        softColor: '#fff0f3',
        icon: Paintbrush,
    },
    {
        title: 'Clean and go',
        description: 'Wipe, you’re done. Just shut the case. No rinsing. No scrubbing. Everything else stays stress-free.',
        accent: '#15915b',
        softColor: '#eaf8f0',
        icon: CheckCircle2,
    },
] as const;

type ProductGalleryImage = (typeof productGalleryImages)[number];

function ProductImageZoomDialog({ image, children }: { image: ProductGalleryImage; children: ReactNode }) {
    const [zoomStep, setZoomStep] = useState(0);
    const zoomLevel = zoomSteps[zoomStep];
    const canZoomOut = zoomStep > 0;
    const canZoomIn = zoomStep < zoomSteps.length - 1;

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setZoomStep(0)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[min(94vw,1280px)] gap-0 border-0 bg-white p-0 shadow-[0_28px_90px_rgba(18,59,109,0.18)] [&>button]:bg-white/90 [&>button]:text-[#123b6d]">
                <DialogTitle className="sr-only">Zoomed product image</DialogTitle>

                <div className="border-b border-[#e1e3e7] px-6 py-4">
                    <div className="flex items-center justify-between gap-4 pr-10">
                        <p className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">{image.alt}</p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setZoomStep((step) => Math.max(step - 1, 0))}
                                disabled={!canZoomOut}
                                className="size-10 rounded-none border-[#123b6d] text-[#123b6d] disabled:opacity-35"
                                aria-label="Zoom out product image"
                            >
                                <ZoomOut className="size-5" aria-hidden="true" />
                            </Button>
                            <span className="min-w-14 text-center text-[13px] font-medium text-[#4a4f58]">{Math.round(zoomLevel * 100)}%</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setZoomStep((step) => Math.min(step + 1, zoomSteps.length - 1))}
                                disabled={!canZoomIn}
                                className="size-10 rounded-none border-[#123b6d] text-[#123b6d] disabled:opacity-35"
                                aria-label="Zoom in product image"
                            >
                                <ZoomIn className="size-5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-h-[78vh] overflow-auto bg-[#fbfaf8] p-6 md:p-10">
                    <button
                        type="button"
                        onClick={() => setZoomStep((step) => (step === zoomSteps.length - 1 ? 0 : step + 1))}
                        className="mx-auto block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                        aria-label="Toggle product image zoom"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            decoding="async"
                            className={[
                                'max-h-[68vh] max-w-full object-contain transition-transform duration-300 ease-out',
                                zoomStep === zoomSteps.length - 1 ? 'cursor-zoom-out' : 'cursor-zoom-in',
                            ].join(' ')}
                            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                        />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ProductGallery() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragOffsetPercent, setDragOffsetPercent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [skipTrackTransition, setSkipTrackTransition] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const dragAxisRef = useRef<'pending' | 'horizontal' | 'vertical'>('pending');
    const dragMovedRef = useRef(false);
    const suppressClickRef = useRef(false);
    const activeImage = productGalleryImages[activeIndex];

    const goToImage = (index: number) => {
        const normalizedIndex = (index + galleryImageCount) % galleryImageCount;
        const shouldSkipTransition = Math.abs(normalizedIndex - activeIndex) > 1;

        setSkipTrackTransition(shouldSkipTransition);
        setActiveIndex(normalizedIndex);

        if (shouldSkipTransition) {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => setSkipTrackTransition(false));
            });
        }
    };

    const resetDrag = () => {
        dragStartRef.current = null;
        dragAxisRef.current = 'pending';
        setDragOffsetPercent(0);
        setIsDragging(false);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        dragStartRef.current = { x: event.clientX, y: event.clientY };
        dragAxisRef.current = 'pending';
        dragMovedRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (dragStartRef.current === null) {
            return;
        }

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;

        if (dragAxisRef.current === 'pending' && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
            dragAxisRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
        }

        if (dragAxisRef.current !== 'horizontal') {
            return;
        }

        event.preventDefault();
        dragMovedRef.current = true;
        setIsDragging(true);

        const viewportWidth = event.currentTarget.getBoundingClientRect().width;
        setDragOffsetPercent(Math.max(Math.min((deltaX / viewportWidth) * 100, 35), -35));
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (dragStartRef.current === null) {
            return;
        }

        const deltaX = event.clientX - dragStartRef.current.x;
        const swipeThreshold = Math.min(event.currentTarget.getBoundingClientRect().width * 0.16, 72);

        if (dragAxisRef.current === 'horizontal') {
            if (deltaX <= -swipeThreshold) {
                goToImage(activeIndex + 1);
            } else if (deltaX >= swipeThreshold) {
                goToImage(activeIndex - 1);
            }
        }

        suppressClickRef.current = dragMovedRef.current;
        resetDrag();

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        window.setTimeout(() => {
            suppressClickRef.current = false;
        }, 80);
    };

    const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
        resetDrag();

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    return (
        <div>
            <div className="relative">
                <ProductImageZoomDialog image={activeImage}>
                    <button
                        type="button"
                        className={[
                            'group relative flex aspect-[1.35/1] w-full touch-pan-y items-center justify-center overflow-hidden bg-white p-8 shadow-[0_22px_70px_rgba(18,59,109,0.06)] select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]',
                            isDragging ? 'cursor-grabbing' : 'cursor-grab',
                        ].join(' ')}
                        aria-label={`Open product image zoom for ${activeImage.alt}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onClickCapture={(event) => {
                            if (!suppressClickRef.current) {
                                return;
                            }

                            event.preventDefault();
                            event.stopPropagation();
                            suppressClickRef.current = false;
                        }}
                    >
                        <span className="relative block h-full w-full overflow-hidden">
                            <span
                                className={[
                                    'flex h-full ease-out',
                                    isDragging || skipTrackTransition ? 'transition-none' : 'transition-transform duration-500',
                                ].join(' ')}
                                style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffsetPercent}%))` }}
                            >
                                {productGalleryImages.map((image, index) => (
                                    <span key={image.src} className="relative block h-full w-full shrink-0">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            draggable={false}
                                            decoding="async"
                                            fetchPriority={index === 0 ? 'high' : 'auto'}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            className="absolute inset-0 h-full w-full object-contain"
                                        />
                                    </span>
                                ))}
                            </span>
                        </span>
                        <span className="absolute right-5 bottom-5 flex size-12 items-center justify-center bg-white/90 text-[#123b6d] shadow-[0_14px_30px_rgba(18,59,109,0.14)] transition-colors group-hover:bg-[#123b6d] group-hover:text-white">
                            <Maximize2 className="size-5" aria-hidden="true" />
                        </span>
                    </button>
                </ProductImageZoomDialog>

                {galleryImageCount > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goToImage(activeIndex - 1)}
                            className="absolute top-1/2 left-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white/90 text-[#123b6d] shadow-[0_12px_26px_rgba(18,59,109,0.12)] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                            aria-label="Show previous product image"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goToImage(activeIndex + 1)}
                            className="absolute top-1/2 right-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white/90 text-[#123b6d] shadow-[0_12px_26px_rgba(18,59,109,0.12)] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                            aria-label="Show next product image"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-[12px] font-medium tracking-[0.12em] text-[#123b6d] uppercase">
                <div className="flex items-center gap-2">
                    {productGalleryImages.map((image, index) => (
                        <button
                            key={image.src}
                            type="button"
                            onClick={() => goToImage(index)}
                            className={[
                                'size-2.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]',
                                index === activeIndex ? 'bg-[#123b6d]' : 'bg-[#c9ced6] hover:bg-[#7a818c]',
                            ].join(' ')}
                            aria-label={`Show product image ${index + 1}`}
                            aria-current={index === activeIndex}
                        />
                    ))}
                </div>
                <span>
                    {activeIndex + 1} / {galleryImageCount}
                </span>
            </div>
        </div>
    );
}

function handleBuyNowNavigation() {
    window.setTimeout(() => {
        router.visit('/cart', {
            preserveScroll: false,
        });
    }, 220);
}

function ProductInfo() {
    return (
        <aside className="pt-2 lg:pt-5">
            <h1 className="font-['Cormorant_Garamond'] text-[40px] leading-none font-semibold text-[#123b6d] md:text-[50px] lg:text-[64px]">
                MAZ Watercolor Kit
            </h1>
            <p className="mt-6 text-[26px] leading-none font-medium text-[#a0432f] lg:mt-8 lg:text-[34px]">{primaryShopProduct.price}</p>

            <p className="mt-10 text-[20px] leading-8 text-[#4a4f58] lg:mt-12 lg:text-[25px] lg:leading-[1.65]">
                Discover the fluidity of pigment and paper with the curated MAZ Watercolor Kit. Designed for artists who seek intentionality in every
                stroke. Includes 12 lightfast pigments, 2 professional brushes, and an 8 by 8 notebook with paper suitable for watercolors.
            </p>

            <div className="mt-12 space-y-4 lg:mt-14 lg:space-y-5">
                <AddToCartButton
                    product={primaryShopProduct}
                    className="h-[48px] w-full rounded-none border-[#123b6d] bg-white text-[13px] font-medium tracking-[0.18em] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white lg:h-[64px] lg:text-[15px]"
                    showIcon
                >
                    ADD TO CART
                </AddToCartButton>
                <AddToCartButton
                    product={primaryShopProduct}
                    className="h-[46px] w-full rounded-none border-[#838994] bg-white text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#f8f9fb] hover:text-[#123b6d] lg:h-[62px] lg:text-[15px]"
                    onAdded={handleBuyNowNavigation}
                    showQuantityControl={false}
                >
                    BUY NOW
                </AddToCartButton>
            </div>
        </aside>
    );
}

function HowItWorks() {
    return (
        <section className="relative overflow-hidden border-y border-[#dfe4e8] bg-[#fbfaf8] px-6 py-28 md:px-10 md:py-36 lg:py-44">
            <div aria-hidden="true" className="absolute top-0 left-[7%] h-3 w-40 bg-[#159bd7]" />
            <div aria-hidden="true" className="absolute top-0 left-[calc(7%+10rem)] h-3 w-40 bg-[#e9b80f]" />
            <div aria-hidden="true" className="absolute top-0 right-[calc(7%+10rem)] h-3 w-40 bg-[#d84b68]" />
            <div aria-hidden="true" className="absolute top-0 right-[7%] h-3 w-40 bg-[#15915b]" />

            <div className="mx-auto max-w-[1720px]">
                <ScrollReveal className="mx-auto max-w-[900px] text-center" y={36}>
                    <p className="text-[13px] font-semibold tracking-[0.24em] text-[#159bd7] uppercase lg:text-[16px]">From case to color</p>
                    <h2 className="mt-5 font-['Cormorant_Garamond'] text-[46px] leading-none font-semibold text-[#123b6d] md:text-[58px] lg:text-[72px]">
                        How It Works
                    </h2>
                    <p className="mx-auto mt-7 max-w-[720px] text-[17px] leading-7 text-[#4a4f58] lg:text-[22px] lg:leading-9">
                        Four simple steps. No cups, no complicated setup, and no stressful cleanup.
                    </p>
                </ScrollReveal>

                <div className="mt-20 grid gap-6 md:grid-cols-2 lg:mt-28 lg:grid-cols-4 lg:gap-8">
                    {howItWorksSteps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <ScrollReveal key={step.title} delay={index * 110} y={42}>
                                <article
                                    className="relative h-full overflow-hidden border border-[#dfe4e8] bg-white px-7 pt-9 pb-10 shadow-[0_22px_60px_rgba(18,59,109,0.07)] md:px-9 md:pt-11 md:pb-12 lg:min-h-[430px] lg:px-10 lg:pt-12"
                                    style={{ '--step-accent': step.accent, '--step-soft': step.softColor } as CSSProperties}
                                >
                                    <div className="absolute inset-x-0 top-0 h-2 bg-[var(--step-accent)]" aria-hidden="true" />
                                    <div className="absolute inset-x-0 top-2 h-36 bg-[var(--step-soft)]" aria-hidden="true" />
                                    <div className="relative flex items-center justify-between gap-5">
                                        <span className="flex size-16 items-center justify-center bg-white/85 text-[var(--step-accent)] shadow-[0_10px_28px_rgba(18,59,109,0.08)] lg:size-20">
                                            <Icon className="size-8 lg:size-10" strokeWidth={1.7} aria-hidden="true" />
                                        </span>
                                        <span className="font-['Cormorant_Garamond'] text-[44px] leading-none font-semibold text-[var(--step-accent)] lg:text-[58px]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="relative mt-9 font-['Cormorant_Garamond'] text-[31px] leading-none font-semibold text-[#123b6d] lg:mt-11 lg:text-[39px]">
                                        {step.title}
                                    </h3>
                                    <p className="relative mt-5 text-[16px] leading-7 text-[#4a4f58] lg:text-[20px] lg:leading-8">
                                        {step.description}
                                    </p>
                                </article>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ quote, author, rating }: (typeof reviews)[number]) {
    return (
        <figure className="bg-white p-8 shadow-[0_24px_70px_rgba(18,59,109,0.06)] md:p-9 lg:min-h-[420px] lg:p-12">
            <RatingStars count={rating} />
            <blockquote className="mt-8 text-[19px] leading-8 font-medium text-[#24272d] italic lg:text-[23px] lg:leading-10">{quote}</blockquote>
            <figcaption className="mt-8 text-[12px] leading-none font-semibold tracking-[0.12em] text-[#7a818c] uppercase lg:mt-10 lg:text-[14px]">
                {author}
            </figcaption>
        </figure>
    );
}

function ArtistReviews() {
    return (
        <section className="px-6 pt-24 pb-32 md:px-10 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48">
            <div className="mx-auto max-w-[1600px]">
                <ScrollReveal className="mx-auto max-w-[720px] text-center" y={38}>
                    <h2 className="font-['Cormorant_Garamond'] text-[38px] leading-none font-medium text-[#123b6d] md:text-[48px] lg:text-[64px]">
                        Artist Reviews
                    </h2>
                    <p className="mt-6 text-[16px] leading-7 text-[#4a4f58] lg:mt-8 lg:text-[21px] lg:leading-9">
                        Experiences from the studio. How the MAZ collection inspires creators worldwide.
                    </p>
                </ScrollReveal>

                <div className="mt-24 grid gap-8 md:grid-cols-3 lg:mt-28 lg:gap-10">
                    {reviews.map((review, index) => (
                        <ScrollReveal key={review.author} delay={index * 120} y={36}>
                            <ReviewCard {...review} />
                        </ScrollReveal>
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
                <section className="px-6 pt-28 pb-36 md:px-10 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
                    <div className="mx-auto grid max-w-[1120px] gap-16 lg:max-w-[1720px] lg:grid-cols-[1.38fr_1fr] lg:gap-24">
                        <ScrollReveal duration={880} y={32}>
                            <ProductGallery />
                        </ScrollReveal>
                        <ScrollReveal delay={140} duration={880} y={32}>
                            <ProductInfo />
                        </ScrollReveal>
                    </div>
                </section>
                <HowItWorks />
                <ArtistReviews />
            </main>
        </ShopLayout>
    );
}

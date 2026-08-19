import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { productGalleryImages, type ShopProduct } from '@/features/shop/product-data';
import { router } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Droplets, Maximize2, Paintbrush, Palette, ZoomIn, ZoomOut } from 'lucide-react';
import { type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent, useRef, useState } from 'react';
import { AddToCartButton } from './add-to-cart-button';
import { RatingStars } from './rating-stars';
import { ShopContainer, ShopSectionHeader } from './shop-design';
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
            <DialogContent className="max-w-[min(94vw,736px)] gap-0 border-0 bg-white p-0 shadow-[0_16px_52px_rgba(18,59,109,0.18)] [&>button]:bg-white/90 [&>button]:text-[#123b6d]">
                <DialogTitle className="sr-only">Zoomed product image</DialogTitle>

                <div className="border-b border-[#e1e3e7] px-6 py-4">
                    <div className="flex items-center justify-between gap-4 pr-10">
                        <p className="text-[7px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">{image.alt}</p>
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
                            <span className="min-w-14 text-center text-[7px] font-medium text-[#4a4f58]">{Math.round(zoomLevel * 100)}%</span>
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
                            'group maz-media-panel relative flex aspect-[1.18/1] w-full touch-pan-y items-center justify-center overflow-hidden p-7 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] sm:aspect-[1.35/1] md:p-10',
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
                                    'flex h-full w-full ease-out',
                                    isDragging || skipTrackTransition ? 'transition-none' : 'transition-transform duration-500',
                                ].join(' ')}
                                style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffsetPercent}%))` }}
                            >
                                {productGalleryImages.map((image, index) => (
                                    <span
                                        key={image.src}
                                        className="flex h-full w-full flex-none basis-full items-center justify-center overflow-hidden"
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            draggable={false}
                                            decoding="async"
                                            fetchPriority={index === 0 ? 'high' : 'auto'}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            className="max-h-full max-w-[68%] object-contain sm:max-w-full"
                                        />
                                    </span>
                                ))}
                            </span>
                        </span>
                        <span className="absolute right-5 bottom-5 flex size-12 items-center justify-center bg-white/90 text-[#123b6d] shadow-[0_8px_17px_rgba(18,59,109,0.14)] transition-colors group-hover:bg-[#123b6d] group-hover:text-white">
                            <Maximize2 className="size-5" aria-hidden="true" />
                        </span>
                    </button>
                </ProductImageZoomDialog>

                {galleryImageCount > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goToImage(activeIndex - 1)}
                            className="absolute top-1/2 left-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white/90 text-[#123b6d] shadow-[0_7px_15px_rgba(18,59,109,0.12)] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                            aria-label="Show previous product image"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goToImage(activeIndex + 1)}
                            className="absolute top-1/2 right-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white/90 text-[#123b6d] shadow-[0_7px_15px_rgba(18,59,109,0.12)] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                            aria-label="Show next product image"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-[7px] font-medium tracking-[0.12em] text-[#123b6d] uppercase">
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

function ProductInfo({ product }: { product: ShopProduct }) {
    return (
        <aside className="pt-2 lg:pt-5">
            <h1 className="maz-page-title">{product.detailTitle}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-7">
                {product.compareAtPrice ? (
                    <span className="text-[1.1rem] leading-none font-medium text-[#7a818c] line-through decoration-[#a0432f] decoration-2 lg:text-[1.25rem]">
                        {product.compareAtPrice}
                    </span>
                ) : null}
                <span className="text-[1.35rem] leading-none font-semibold text-[#a0432f] lg:text-[1.6rem]">{product.price}</span>
                {product.badgeLabel ? (
                    <span className="bg-[#123b6d] px-4 py-2 text-[0.72rem] leading-none font-bold tracking-[0.12em] text-white uppercase">
                        {product.badgeLabel}
                    </span>
                ) : null}
            </div>

            <p className="maz-lead mt-8 max-w-[50ch] lg:mt-10">{product.detailDescription}</p>

            <div className="mt-10 space-y-4 lg:mt-12 lg:space-y-5">
                <AddToCartButton product={product} className="w-full" showIcon>
                    ADD TO CART
                </AddToCartButton>
                <AddToCartButton
                    product={product}
                    className="maz-button-secondary w-full border-[#838994]"
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
        <section className="relative overflow-hidden border-y border-[#dfe4e8] bg-[#fbfaf8] py-20 sm:py-24 lg:py-32">
            <div aria-hidden="true" className="absolute top-0 left-[7%] h-3 w-40 bg-[#159bd7]" />
            <div aria-hidden="true" className="absolute top-0 left-[calc(7%+10rem)] h-3 w-40 bg-[#e9b80f]" />
            <div aria-hidden="true" className="absolute top-0 right-[calc(7%+10rem)] h-3 w-40 bg-[#d84b68]" />
            <div aria-hidden="true" className="absolute top-0 right-[7%] h-3 w-40 bg-[#15915b]" />

            <ShopContainer>
                <ScrollReveal y={36}>
                    <p className="maz-label mx-auto text-center text-[#159bd7]">From case to color</p>
                    <ShopSectionHeader title="How It Works" subtitle="Four simple steps. No cups, no complicated setup, and no stressful cleanup." />
                </ScrollReveal>

                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-18 lg:grid-cols-4 lg:gap-7">
                    {howItWorksSteps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <ScrollReveal key={step.title} delay={index * 110} y={42}>
                                <article
                                    className="maz-card relative h-full overflow-hidden px-7 pt-9 pb-10 md:px-8 md:pt-10 md:pb-11 lg:min-h-[300px]"
                                    style={{ '--step-accent': step.accent, '--step-soft': step.softColor } as CSSProperties}
                                >
                                    <div className="absolute inset-x-0 top-0 h-2 bg-[var(--step-accent)]" aria-hidden="true" />
                                    <div className="absolute inset-x-0 top-2 h-36 bg-[var(--step-soft)]" aria-hidden="true" />
                                    <div className="relative flex items-center justify-between gap-5">
                                        <span className="flex size-16 items-center justify-center bg-white/85 text-[var(--step-accent)] shadow-[0_6px_16px_rgba(18,59,109,0.08)] lg:size-20">
                                            <Icon className="size-8 lg:size-10" strokeWidth={1.7} aria-hidden="true" />
                                        </span>
                                        <span className="font-['Cormorant_Garamond'] text-[25px] leading-none font-semibold text-[var(--step-accent)] lg:text-[33px]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="maz-card-title relative mt-8">{step.title}</h3>
                                    <p className="maz-body relative mt-4">{step.description}</p>
                                </article>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </ShopContainer>
        </section>
    );
}

function ReviewCard({ quote, author, rating }: (typeof reviews)[number]) {
    return (
        <figure className="maz-card bg-white p-8 md:p-9 lg:min-h-[290px] lg:p-10">
            <RatingStars count={rating} />
            <blockquote className="mt-7 text-[0.98rem] leading-8 font-medium text-[#24272d] italic">{quote}</blockquote>
            <figcaption className="mt-8 text-[0.72rem] leading-none font-semibold tracking-[0.12em] text-[#7a818c] uppercase lg:mt-9">
                {author}
            </figcaption>
        </figure>
    );
}

function ArtistReviews() {
    return (
        <section className="py-20 sm:py-24 lg:py-32">
            <ShopContainer>
                <ScrollReveal y={38}>
                    <ShopSectionHeader
                        title="Artist Reviews"
                        subtitle="Experiences from the studio. How the MAZ collection inspires creators worldwide."
                    />
                </ScrollReveal>

                <div className="mt-14 grid gap-8 md:grid-cols-3 lg:mt-18 lg:gap-9">
                    {reviews.map((review, index) => (
                        <ScrollReveal key={review.author} delay={index * 120} y={36}>
                            <ReviewCard {...review} />
                        </ScrollReveal>
                    ))}
                </div>
            </ShopContainer>
        </section>
    );
}

export function ProductPage({ product }: { product: ShopProduct }) {
    return (
        <ShopLayout>
            <main>
                <section className="py-16 sm:py-20 lg:py-28">
                    <ShopContainer className="grid max-w-[760px] gap-12 lg:max-w-[1180px] lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                        <div>
                            <ProductGallery />
                        </div>
                        <div>
                            <ProductInfo product={product} />
                        </div>
                    </ShopContainer>
                </section>
                <HowItWorks />
                <ArtistReviews />
            </main>
        </ShopLayout>
    );
}

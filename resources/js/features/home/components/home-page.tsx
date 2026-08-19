import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RatingStars } from '@/features/shop/components/rating-stars';
import { ShopContainer, ShopSection, ShopSectionHeader } from '@/features/shop/components/shop-design';
import { ShopLayout } from '@/features/shop/components/shop-layout';
import { shopProducts } from '@/features/shop/product-data';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type PointerEvent as ReactPointerEvent, type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { BoxScrollTransition } from './box-scroll-transition';
import { ColorScrollAnimation } from './color-scroll-animation';
import { HeroColorMotion } from './hero-color-motion';
import { KitOptionCard, type KitOptionCardProps } from './kit-option-card';

const heroKitImage = '/optimized/box-1400.webp';

const kitOptions: KitOptionCardProps[] = shopProducts.map((product) => ({
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    badgeLabel: product.badgeLabel,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    productHref: product.productHref,
    cartProduct: product,
}));

const galleryImages = [
    {
        src: '/optimized/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.50%20(1).webp',
        alt: 'Artist workspace with MAZ watercolor supplies',
    },
    {
        src: '/optimized/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.50.webp',
        alt: 'Watercolor practice scene with MAZ kit',
    },
    {
        src: '/optimized/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.51%20(1).webp',
        alt: 'MAZ watercolor kit in use',
    },
    {
        src: '/optimized/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.51.webp',
        alt: 'Creative watercolor setup with MAZ tools',
    },
] as const;

const kitContents = [
    {
        title: 'Illustrated Kit Box',
        description: 'Protective keepsake packaging',
        imageSrc: heroKitImage,
        imageAlt: 'Illustrated MAZ watercolor kit box',
        className: 'col-span-2 md:col-span-12',
        imageClassName: 'max-w-[564px]',
    },
    {
        title: '12 Watercolour Tubes',
        description: 'Core pigment range',
        imageSrc: '/optimized/what_inside/colots.webp',
        imageAlt: 'Twelve MAZ watercolor paint tubes',
        className: 'md:col-span-12',
        imageClassName: 'max-w-[736px]',
    },
    {
        title: 'Clip',
        description: 'Keeps paper steady',
        imageSrc: '/optimized/what_inside/gold_clip.webp',
        imageAlt: 'Gold art clip',
        className: 'md:col-span-3 md:col-start-2',
        imageClassName: 'max-w-[150px]',
    },
    {
        title: 'Wood Mixing Palette',
        description: 'Compact removable tray',
        imageSrc: '/optimized/product/wood_palette.webp',
        imageAlt: 'Wood watercolor mixing palette',
        className: 'md:col-span-4',
        imageClassName: 'max-w-[241px]',
    },
    {
        title: 'Water Brush Pen',
        description: 'Refillable detail brush',
        imageSrc: '/optimized/what_inside/water_brush_pen.webp',
        imageAlt: 'Transparent refillable water brush pen',
        className: 'md:col-span-3',
        imageClassName: 'w-auto',
    },
    {
        title: 'Wrist Band',
        description: 'Comfortable artist wrist support',
        imageSrc: '/optimized/what_inside/white_sponge.webp',
        imageAlt: 'White watercolor sponge',
        className: 'md:col-span-4 md:col-start-3',
        imageClassName: 'max-w-[224px]',
    },
    {
        title: 'Notebook',
        description: '8 by 8 papers suitable for watercolors',
        imageSrc: '/optimized/what_inside/watercolor_paper_padi.webp',
        imageAlt: 'Watercolor paper pad',
        className: 'md:col-span-5',
        imageClassName: 'max-w-[264px]',
    },
] as const;

const testimonials = [
    {
        quote: '"The pigments blend with such an effortless grace. It has entirely elevated my daily practice."',
        author: '- SARAH J., ILLUSTRATOR',
    },
    {
        quote: '"Finally, a kit that feels truly cohesive. The quality of the brushes paired with this paper is unmatched."',
        author: '- AHMAD T., DESIGNER',
    },
    {
        quote: '"Compact enough for travel, but uncompromising on professional quality. My absolute go-to."',
        author: '- ELENA R., FINE ARTIST',
    },
    {
        quote: '"The colors stay luminous even after layering. It makes small studies feel polished and intentional."',
        author: '- LEILA K., ART TEACHER',
    },
    {
        quote: '"The kit has the right balance of essentials. I can set up quickly, mix confidently, and keep moving."',
        author: '- NOUR A., STUDIO ARTIST',
    },
    {
        quote: '"Every piece feels considered, from the travel case to the paper texture. It is easy to keep in my daily bag."',
        author: '- KARIM H., URBAN SKETCHER',
    },
];

function getVisibleTestimonialCount() {
    if (typeof window === 'undefined') {
        return 1;
    }

    if (window.innerWidth >= 1024) {
        return 3;
    }

    if (window.innerWidth >= 768) {
        return 2;
    }

    return 1;
}

const faqs = [
    {
        question: 'Is this kit suitable for absolute beginners?',
        answer: "Yes. We've curated the Single Kit specifically for those starting their journey, providing professional-grade tools that are intuitive and forgiving for new artists.",
    },
    {
        question: "What makes the paper 'Artisan' quality?",
        answer: 'Our 300gsm cotton paper is suitable for watercolors and specifically chosen to handle heavy washes and fine detail without warping or pilling.',
    },
    {
        question: 'How long does shipping take within Lebanon?',
        answer: 'We offer free delivery across Lebanon. Orders are typically processed within 24 hours and delivered within 2-4 business days.',
    },
    {
        question: 'Are the pigments lightfast?',
        answer: 'Absolutely. All 12 pigments in our kit are rated for high lightfastness, ensuring your artwork maintains its vibrancy for years to come.',
    },
];

function sectionHeading(title: string, subtitle?: string) {
    return (
        <ScrollReveal y={42}>
            <ShopSectionHeader title={title} subtitle={subtitle} />
        </ScrollReveal>
    );
}

interface HeroProps {
    imageRef: RefObject<HTMLImageElement | null>;
}

function Hero({ imageRef }: HeroProps) {
    return (
        <section id="shop" className="relative isolate z-[60] overflow-visible bg-[#fffaf5]">
            <HeroColorMotion />

            <ShopContainer className="grid min-h-[680px] items-center gap-12 py-14 sm:py-18 md:grid-cols-[0.85fr_1.15fr] md:py-0 lg:min-h-[720px] lg:gap-16">
                <div className="order-2 w-full max-w-[460px] min-w-0 md:order-1">
                    <h1 className="maz-display">
                        The Art of
                        <br />
                        Expression
                    </h1>
                    <p className="maz-lead mt-8">
                        Discover the fluidity of pigment and paper with the curated MAZ Watercolor Kit. Designed for artists who seek intentionality
                        in every stroke.
                    </p>
                    <div className="mt-7 flex max-w-full items-center gap-2.5 sm:max-w-[380px]" aria-hidden="true">
                        {['#1d9ee8', '#f43b2f', '#f7c70d', '#119d54', '#6f2dcf', '#103f91', '#8c4b2d'].map((color) => (
                            <span key={color} className="h-2.5 min-w-0 flex-1 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                    <Button asChild className="maz-button-base maz-button-primary mt-9">
                        <a href="#kit-options">SHOP THE KIT</a>
                    </Button>
                </div>

                <div className="order-1 flex min-w-0 items-center justify-center md:order-2 md:justify-end">
                    <div className="relative w-full max-w-[285px] min-w-0 sm:max-w-[520px] md:max-w-[700px]">
                        <div aria-hidden="true" className="absolute inset-x-[7%] bottom-[3%] h-[18%] bg-[#123b6d]/10 blur-2xl" />
                        <img
                            ref={imageRef}
                            src={heroKitImage}
                            srcSet="/optimized/box-900.webp 900w, /optimized/box-1400.webp 1400w"
                            sizes="(min-width: 768px) 58vw, 74vw"
                            alt="MAZ Watercolour Kit box"
                            width={1400}
                            height={788}
                            decoding="async"
                            fetchPriority="high"
                            loading="eager"
                            className="pointer-events-none relative z-[90] w-full object-contain drop-shadow-[0_17px_16px_rgba(20,20,20,0.2)]"
                        />
                    </div>
                </div>
            </ShopContainer>
        </section>
    );
}

interface KitContentFigureProps {
    title: (typeof kitContents)[number]['title'];
    description: (typeof kitContents)[number]['description'];
    imageSrc: (typeof kitContents)[number]['imageSrc'];
    imageAlt: (typeof kitContents)[number]['imageAlt'];
    className: string;
    imageClassName: string;
    targetRef?: RefObject<HTMLDivElement | null>;
}

function KitContentFigure({ title, description, imageSrc, imageAlt, className, imageClassName, targetRef }: KitContentFigureProps) {
    return (
        <figure className={['relative flex flex-col items-center text-center', className].join(' ')}>
            {targetRef ? (
                <div id="kit-box-landing" ref={targetRef} aria-hidden="true" className="aspect-[16/9] w-full max-w-[560px]" />
            ) : (
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    decoding="async"
                    loading="lazy"
                    className={[
                        'h-28 w-full object-contain drop-shadow-[0_10px_14px_rgba(18,59,109,0.12)] transition-opacity duration-150 sm:h-36 md:h-52',
                        imageClassName,
                    ].join(' ')}
                />
            )}
            <figcaption className="relative mt-5 max-w-[240px] before:absolute before:top-[-10px] before:left-1/2 before:h-3 before:w-px before:-translate-x-1/2 before:bg-[#c7cdd5]">
                <span className="mx-auto mb-3 block h-2.5 w-2.5 rounded-full border-2 border-white bg-[#123b6d] shadow-[0_0_0_1px_rgba(18,59,109,0.2)] md:h-3 md:w-3" />
                <h3 className="maz-card-title text-[1.15rem] md:text-[1.55rem]">{title}</h3>
                <p className="maz-caption mt-2 md:mt-3">{description}</p>
            </figcaption>
        </figure>
    );
}

interface WhatsInsideProps {
    boxTargetRef: RefObject<HTMLDivElement | null>;
}

function WhatsInside({ boxTargetRef }: WhatsInsideProps) {
    return (
        <ShopSection className="pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-36 lg:pb-14">
            <ShopContainer>
                {sectionHeading("What's Inside", "Everything you need, nothing you don't.")}

                <div className="mx-auto mt-14 grid max-w-[980px] grid-cols-2 items-end gap-x-6 gap-y-12 sm:mt-18 sm:gap-x-10 sm:gap-y-16 md:grid-cols-12 md:gap-y-20">
                    {kitContents.map((item, index) => (
                        <ScrollReveal key={item.title} className={item.className} delay={Math.min(index * 95, 420)} y={index === 0 ? 0 : 44}>
                            <KitContentFigure {...item} className="" targetRef={index === 0 ? boxTargetRef : undefined} />
                        </ScrollReveal>
                    ))}
                </div>
            </ShopContainer>
        </ShopSection>
    );
}

function KitOptions() {
    return (
        <ShopSection id="kit-options" className="pt-12 pb-24 lg:pt-16 lg:pb-32">
            <ShopContainer>
                {sectionHeading('Kit Options', 'Find the perfect setup for your artistic journey.')}

                <div className="mt-14 grid gap-8 md:mt-18 md:grid-cols-2 lg:grid-cols-3 lg:gap-9">
                    {kitOptions.map((option, index) => (
                        <ScrollReveal key={option.title} delay={index * 120} y={40}>
                            <KitOptionCard {...option} />
                        </ScrollReveal>
                    ))}
                </div>
            </ShopContainer>
        </ShopSection>
    );
}

function Testimonials() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [visibleCount, setVisibleCount] = useState(getVisibleTestimonialCount);
    const [isSliderPaused, setIsSliderPaused] = useState(false);
    const maxSlide = Math.max(testimonials.length - visibleCount, 0);
    const currentSlide = Math.min(activeSlide, maxSlide);
    const slideWidth = 100 / visibleCount;

    const goToPreviousSlide = useCallback(() => setActiveSlide((slide) => (slide === 0 ? maxSlide : slide - 1)), [maxSlide]);
    const goToNextSlide = useCallback(() => setActiveSlide((slide) => (slide >= maxSlide ? 0 : slide + 1)), [maxSlide]);

    useEffect(() => {
        const handleResize = () => setVisibleCount(getVisibleTestimonialCount());

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setActiveSlide((slide) => Math.min(slide, maxSlide));
    }, [maxSlide]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isSliderPaused || prefersReducedMotion || maxSlide === 0) {
            return;
        }

        const autoplayId = window.setInterval(goToNextSlide, 4500);

        return () => window.clearInterval(autoplayId);
    }, [goToNextSlide, isSliderPaused, maxSlide]);

    return (
        <ShopSection className="px-0 py-0">
            <ShopContainer>
                <div className="border-t border-[#d9dde2] py-24 lg:py-32">
                    {sectionHeading('Artist Perspectives')}

                    <ScrollReveal
                        className="mt-14 lg:mt-18"
                        delay={120}
                        y={38}
                        onFocus={() => setIsSliderPaused(true)}
                        onBlur={() => setIsSliderPaused(false)}
                    >
                        <div className="relative mx-auto max-w-[834px]">
                            <div
                                className="overflow-hidden"
                                onMouseEnter={() => setIsSliderPaused(true)}
                                onMouseLeave={() => setIsSliderPaused(false)}
                            >
                                <div
                                    className="flex transition-transform duration-700 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * slideWidth}%)` }}
                                >
                                    {testimonials.map((testimonial) => (
                                        <div key={testimonial.author} className="shrink-0 px-4 md:px-7" style={{ flexBasis: `${slideWidth}%` }}>
                                            <figure className="mx-auto flex min-h-[240px] max-w-[300px] flex-col items-center text-center">
                                                <RatingStars count={5} iconClassName="size-5" />
                                                <blockquote className="mt-7 text-[0.98rem] leading-8 font-normal text-[#434852] italic">
                                                    {testimonial.quote}
                                                </blockquote>
                                                <figcaption className="mt-auto pt-8 text-[0.72rem] leading-none font-semibold tracking-[0.14em] text-[#123b6d] uppercase">
                                                    {testimonial.author}
                                                </figcaption>
                                            </figure>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={goToPreviousSlide}
                                className="absolute top-1/2 left-0 hidden size-14 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] lg:flex"
                                aria-label="Show previous artist perspective"
                            >
                                <ChevronLeft className="size-7" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={goToNextSlide}
                                className="absolute top-1/2 right-0 hidden size-14 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] lg:flex"
                                aria-label="Show next artist perspective"
                            >
                                <ChevronRight className="size-7" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-5">
                            <button
                                type="button"
                                onClick={goToPreviousSlide}
                                className="flex size-12 items-center justify-center border border-[#123b6d] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] lg:hidden"
                                aria-label="Show previous artist perspective"
                            >
                                <ChevronLeft className="size-6" aria-hidden="true" />
                            </button>

                            <div className="flex items-center gap-3">
                                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveSlide(index)}
                                        className={[
                                            'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]',
                                            currentSlide === index ? 'w-10 bg-[#123b6d]' : 'w-2.5 bg-[#cfd5dd] hover:bg-[#123b6d]',
                                        ].join(' ')}
                                        aria-label={`Show artist perspective ${index + 1}`}
                                        aria-current={currentSlide === index}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={goToNextSlide}
                                className="flex size-12 items-center justify-center border border-[#123b6d] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] lg:hidden"
                                aria-label="Show next artist perspective"
                            >
                                <ChevronRight className="size-6" aria-hidden="true" />
                            </button>
                        </div>
                    </ScrollReveal>
                </div>
            </ShopContainer>
        </ShopSection>
    );
}

function PracticeGallery() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSliderPaused, setIsSliderPaused] = useState(false);
    const [dragOffsetPercent, setDragOffsetPercent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef<number | null>(null);
    const dragMovedRef = useRef(false);
    const suppressClickRef = useRef(false);

    const goToPreviousSlide = () => setActiveSlide((currentSlide) => (currentSlide === 0 ? galleryImages.length - 1 : currentSlide - 1));
    const goToNextSlide = () => setActiveSlide((currentSlide) => (currentSlide === galleryImages.length - 1 ? 0 : currentSlide + 1));

    const resetDrag = () => {
        dragStartXRef.current = null;
        setDragOffsetPercent(0);
        setIsDragging(false);
        setIsSliderPaused(false);
    };

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') {
            return;
        }

        dragStartXRef.current = event.clientX;
        dragMovedRef.current = false;
        setIsDragging(true);
        setIsSliderPaused(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartXRef.current === null) {
            return;
        }

        const deltaX = event.clientX - dragStartXRef.current;
        const viewportWidth = event.currentTarget.getBoundingClientRect().width;

        if (Math.abs(deltaX) > 8) {
            dragMovedRef.current = true;
        }

        setDragOffsetPercent(Math.max(Math.min((deltaX / viewportWidth) * 100, 35), -35));
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartXRef.current === null) {
            return;
        }

        const deltaX = event.clientX - dragStartXRef.current;
        const swipeThreshold = Math.min(event.currentTarget.getBoundingClientRect().width * 0.16, 72);

        if (deltaX <= -swipeThreshold) {
            goToNextSlide();
        } else if (deltaX >= swipeThreshold) {
            goToPreviousSlide();
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

    const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
        resetDrag();

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isSliderPaused || prefersReducedMotion) {
            return;
        }

        const autoplayId = window.setInterval(goToNextSlide, 4500);

        return () => window.clearInterval(autoplayId);
    }, [isSliderPaused]);

    return (
        <ShopSection id="gallery" className="px-0 py-0">
            <ShopContainer>
                <div className="border-t border-[#d9dde2] py-24 lg:py-32">
                    {sectionHeading('In Practice', 'Moments of creation with the MAZ Kit.')}

                    <ScrollReveal
                        className="mt-14 lg:mt-18"
                        delay={120}
                        y={38}
                        onFocus={() => setIsSliderPaused(true)}
                        onBlur={() => setIsSliderPaused(false)}
                    >
                        <div className="relative mx-auto max-w-[980px]">
                            <div
                                className="touch-pan-y overflow-hidden select-none md:select-auto"
                                onMouseEnter={() => setIsSliderPaused(true)}
                                onMouseLeave={() => setIsSliderPaused(false)}
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
                                <div
                                    className={['flex ease-out', isDragging ? 'transition-none' : 'transition-transform duration-700'].join(' ')}
                                    style={{ transform: `translateX(calc(-${activeSlide * 100}% + ${dragOffsetPercent}%))` }}
                                >
                                    {galleryImages.map((image) => (
                                        <div key={image.src} className="w-full shrink-0 px-0 md:px-12">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="group mx-auto flex aspect-[1.2/1] w-full max-w-[850px] items-center justify-center overflow-hidden bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] md:aspect-[1.45/1]"
                                                    >
                                                        <img
                                                            src={image.src}
                                                            alt={image.alt}
                                                            draggable={false}
                                                            decoding="async"
                                                            loading="lazy"
                                                            className="h-full w-full object-contain transition-opacity duration-300 ease-out group-hover:opacity-90"
                                                        />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[min(92vw,632px)] border-0 bg-transparent p-0 shadow-none [&>button]:bg-white/90 [&>button]:text-[#123b6d]">
                                                    <DialogTitle className="sr-only">{image.alt}</DialogTitle>
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt}
                                                        decoding="async"
                                                        className="max-h-[88vh] w-full rounded-[2px] object-contain"
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={goToPreviousSlide}
                                className="absolute top-1/2 left-0 hidden size-14 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] md:flex"
                                aria-label="Show previous gallery image"
                            >
                                <ChevronLeft className="size-7" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={goToNextSlide}
                                className="absolute top-1/2 right-0 hidden size-14 -translate-y-1/2 items-center justify-center border border-[#123b6d] bg-white text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] md:flex"
                                aria-label="Show next gallery image"
                            >
                                <ChevronRight className="size-7" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-5">
                            <button
                                type="button"
                                onClick={goToPreviousSlide}
                                className="flex size-12 items-center justify-center border border-[#123b6d] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] md:hidden"
                                aria-label="Show previous gallery image"
                            >
                                <ChevronLeft className="size-6" aria-hidden="true" />
                            </button>

                            <div className="flex items-center gap-3">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={image.src}
                                        type="button"
                                        onClick={() => setActiveSlide(index)}
                                        className={[
                                            'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]',
                                            activeSlide === index ? 'w-10 bg-[#123b6d]' : 'w-2.5 bg-[#cfd5dd] hover:bg-[#123b6d]',
                                        ].join(' ')}
                                        aria-label={`Show gallery image ${index + 1}`}
                                        aria-current={activeSlide === index}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={goToNextSlide}
                                className="flex size-12 items-center justify-center border border-[#123b6d] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d] md:hidden"
                                aria-label="Show next gallery image"
                            >
                                <ChevronRight className="size-6" aria-hidden="true" />
                            </button>
                        </div>
                    </ScrollReveal>
                </div>
            </ShopContainer>
        </ShopSection>
    );
}

function Faq() {
    return (
        <ShopSection className="px-0 py-0">
            <ShopContainer>
                <div className="border-t border-[#d9dde2] py-24 lg:py-32">
                    {sectionHeading('Common Questions', 'Everything you need to know about the MAZ experience.')}

                    <div className="mx-auto mt-12 max-w-[760px] lg:mt-16">
                        {faqs.map((faq, index) => (
                            <ScrollReveal key={faq.question} delay={index * 75} y={28}>
                                <Collapsible className="border-b border-[#cfd5dd]">
                                    <CollapsibleTrigger className="group/faq flex w-full items-center justify-between gap-6 py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]">
                                        <span className="maz-card-title text-[1.3rem] md:text-[1.55rem]">{faq.question}</span>
                                        <ChevronDown
                                            className="size-7 shrink-0 text-[#123b6d] transition-transform duration-300 ease-out group-data-[state=open]/faq:rotate-180"
                                            aria-hidden="true"
                                        />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden">
                                        <p className="maz-body max-w-[62ch] pb-8">{faq.answer}</p>
                                    </CollapsibleContent>
                                </Collapsible>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </ShopContainer>
        </ShopSection>
    );
}

export function HomePage() {
    const heroBoxImageRef = useRef<HTMLImageElement>(null);
    const insideBoxTargetRef = useRef<HTMLDivElement>(null);

    return (
        <ShopLayout>
            <main>
                <Hero imageRef={heroBoxImageRef} />
                <WhatsInside boxTargetRef={insideBoxTargetRef} />
                <BoxScrollTransition sourceRef={heroBoxImageRef} targetRef={insideBoxTargetRef} />
                <ColorScrollAnimation />
                <KitOptions />
                <Testimonials />
                <PracticeGallery />
                <div id="faq">
                    <Faq />
                </div>
            </main>
        </ShopLayout>
    );
}

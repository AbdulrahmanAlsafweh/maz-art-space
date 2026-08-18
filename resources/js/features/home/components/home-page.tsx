import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RatingStars } from '@/features/shop/components/rating-stars';
import { ShopLayout } from '@/features/shop/components/shop-layout';
import { shopProducts } from '@/features/shop/product-data';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
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
        imageClassName: 'max-w-[980px]',
    },
    {
        title: '12 Watercolour Tubes',
        description: 'Core pigment range',
        imageSrc: '/optimized/what_inside/colots.webp',
        imageAlt: 'Twelve MAZ watercolor paint tubes',
        className: 'md:col-span-12',
        imageClassName: 'max-w-[1280px]',
    },
    {
        title: 'Gold Binder Clip',
        description: 'Keeps paper steady',
        imageSrc: '/optimized/what_inside/gold_clip.webp',
        imageAlt: 'Gold binder clip',
        className: 'md:col-span-3 md:col-start-2',
        imageClassName: 'max-w-[260px]',
    },
    {
        title: 'Wood Mixing Palette',
        description: 'Compact removable tray',
        imageSrc: '/optimized/what_inside/wood_palette.webp',
        imageAlt: 'Wood watercolor mixing palette',
        className: 'md:col-span-4',
        imageClassName: 'max-w-[420px]',
    },
    {
        title: 'Water Brush Pen',
        description: 'Refillable detail brush',
        imageSrc: '/optimized/what_inside/water_brush_pen.webp',
        imageAlt: 'Transparent refillable water brush pen',
        className: 'md:col-span-3',
        imageClassName: 'max-h-[180px] w-auto md:max-h-[520px]',
    },
    {
        title: 'Wrist Band',
        description: 'Comfortable artist wrist support',
        imageSrc: '/optimized/what_inside/white_sponge.webp',
        imageAlt: 'White watercolor sponge',
        className: 'md:col-span-4 md:col-start-3',
        imageClassName: 'max-w-[390px]',
    },
    {
        title: 'Notebook',
        description: '8*8',
        imageSrc: '/optimized/what_inside/watercolor_paper_padi.webp',
        imageAlt: 'Watercolor paper pad',
        className: 'md:col-span-5',
        imageClassName: 'max-w-[460px]',
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
        <ScrollReveal className="mx-auto max-w-3xl text-center" y={42}>
            <h2 className="font-['Cormorant_Garamond'] text-[50px] leading-none font-medium text-[#123b6d] md:text-[72px]">{title}</h2>
            {subtitle ? <p className="mt-7 text-[18px] leading-7 text-[#4c525c]">{subtitle}</p> : null}
        </ScrollReveal>
    );
}

interface HeroProps {
    imageRef: RefObject<HTMLImageElement | null>;
}

function Hero({ imageRef }: HeroProps) {
    return (
        <section id="shop" className="relative isolate z-10 bg-[#fffaf5]">
            <HeroColorMotion />

            <div className="mx-auto grid min-h-[770px] max-w-[1788px] items-center gap-12 px-6 py-20 md:grid-cols-[0.78fr_1.22fr] md:px-10 md:py-0 xl:px-0">
                <ScrollReveal className="order-2 max-w-[690px] pt-2 md:order-1" duration={900} y={28}>
                    <h1 className="font-['Cormorant_Garamond'] text-[64px] leading-[0.94] font-medium text-[#123b6d] md:text-[92px] lg:text-[108px]">
                        The Art of
                        <br />
                        Expression
                    </h1>
                    <p className="mt-10 max-w-[585px] text-[20px] leading-9 text-[#4a4f58] md:text-[22px]">
                        Discover the fluidity of pigment and paper with the curated MAZ Watercolor Kit. Designed for artists who seek intentionality
                        in every stroke.
                    </p>
                    <div className="mt-9 flex items-center gap-3" aria-hidden="true">
                        {['#1d9ee8', '#f43b2f', '#f7c70d', '#119d54', '#6f2dcf', '#103f91', '#8c4b2d'].map((color) => (
                            <span key={color} className="h-3 w-12 rounded-full shadow-sm md:w-16" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                    <Button
                        asChild
                        className="mt-12 h-[62px] rounded-[3px] bg-[#123b6d] px-12 text-[14px] font-medium tracking-[0.2em] text-white hover:bg-[#0f315b]"
                    >
                        <a href="#kit-options">SHOP THE KIT</a>
                    </Button>
                </ScrollReveal>

                <div className="order-1 flex items-center justify-center md:order-2 md:justify-end">
                    <ScrollReveal className="relative w-full max-w-[1080px]" delay={140} duration={960} y={0}>
                        <div aria-hidden="true" className="absolute inset-x-[7%] bottom-[3%] h-[18%] bg-[#123b6d]/10 blur-2xl" />
                        <img
                            ref={imageRef}
                            src={heroKitImage}
                            srcSet="/optimized/box-900.webp 900w, /optimized/box-1400.webp 1400w"
                            sizes="(min-width: 768px) 58vw, 92vw"
                            alt="MAZ Watercolour Kit box"
                            width={1400}
                            height={788}
                            decoding="async"
                            fetchPriority="high"
                            loading="eager"
                            className="pointer-events-none relative z-40 w-full object-contain drop-shadow-[0_30px_28px_rgba(20,20,20,0.2)]"
                        />
                    </ScrollReveal>
                </div>
            </div>
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
                <div
                    id="kit-box-landing"
                    ref={targetRef}
                    aria-hidden="true"
                    className="h-[180px] w-full max-w-[320px] md:h-[520px] md:max-w-[924px]"
                />
            ) : (
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    decoding="async"
                    loading="lazy"
                    className={[
                        'max-h-[180px] w-full object-contain drop-shadow-[0_18px_24px_rgba(18,59,109,0.12)] transition-opacity duration-150 md:max-h-[520px]',
                        imageClassName,
                    ].join(' ')}
                />
            )}
            <figcaption className="relative mt-5 max-w-[360px] before:absolute before:top-[-18px] before:left-1/2 before:h-3 before:w-px before:-translate-x-1/2 before:bg-[#c7cdd5]">
                <span className="mx-auto mb-3 block h-2.5 w-2.5 rounded-full border-2 border-white bg-[#123b6d] shadow-[0_0_0_1px_rgba(18,59,109,0.2)] md:h-3 md:w-3" />
                <h3 className="font-['Cormorant_Garamond'] text-[23px] leading-none font-medium text-[#123b6d] sm:text-[28px] md:text-[36px]">
                    {title}
                </h3>
                <p className="mt-2 text-[13px] leading-snug text-[#4b5058] sm:text-[15px] md:mt-3 md:text-[18px]">{description}</p>
            </figcaption>
        </figure>
    );
}

interface WhatsInsideProps {
    boxTargetRef: RefObject<HTMLDivElement | null>;
}

function WhatsInside({ boxTargetRef }: WhatsInsideProps) {
    return (
        <section className="bg-white px-6 pt-40 pb-36 md:px-10 md:pt-52 md:pb-48">
            <div className="mx-auto max-w-[1700px]">
                {sectionHeading("What's Inside", "Everything you need, nothing you don't.")}

                <div className="mx-auto mt-20 grid max-w-[1500px] grid-cols-2 items-end gap-x-5 gap-y-14 sm:mt-24 sm:gap-x-10 sm:gap-y-20 md:grid-cols-12 md:gap-y-24">
                    {kitContents.map((item, index) => (
                        <ScrollReveal key={item.title} className={item.className} delay={Math.min(index * 95, 420)} y={index === 0 ? 0 : 44}>
                            <KitContentFigure {...item} className="" targetRef={index === 0 ? boxTargetRef : undefined} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function KitOptions() {
    return (
        <section id="kit-options" className="bg-white px-6 pt-12 pb-36 md:px-10 md:pt-8 md:pb-48">
            <div className="mx-auto max-w-[1788px]">
                {sectionHeading('Kit Options', 'Find the perfect setup for your artistic journey.')}

                <div className="mt-28 grid gap-12 md:grid-cols-3 md:gap-12">
                    {kitOptions.map((option, index) => (
                        <ScrollReveal key={option.title} delay={index * 120} y={40}>
                            <KitOptionCard {...option} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
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
        <section className="bg-white px-6 md:px-10">
            <div className="mx-auto max-w-[1788px] border-t border-[#d9dde2] py-36 md:py-44">
                {sectionHeading('Artist Perspectives')}

                <ScrollReveal className="mt-20" delay={120} y={38} onFocus={() => setIsSliderPaused(true)} onBlur={() => setIsSliderPaused(false)}>
                    <div className="relative mx-auto max-w-[1450px]">
                        <div className="overflow-hidden" onMouseEnter={() => setIsSliderPaused(true)} onMouseLeave={() => setIsSliderPaused(false)}>
                            <div
                                className="flex transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${currentSlide * slideWidth}%)` }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.author} className="shrink-0 px-4 md:px-7" style={{ flexBasis: `${slideWidth}%` }}>
                                        <figure className="mx-auto flex min-h-[330px] max-w-[430px] flex-col items-center text-center">
                                            <RatingStars count={5} iconClassName="size-5" />
                                            <blockquote className="mt-8 text-[20px] leading-9 font-normal text-[#434852] italic">
                                                {testimonial.quote}
                                            </blockquote>
                                            <figcaption className="mt-auto pt-9 text-[18px] leading-none font-medium tracking-[0.2em] text-[#123b6d]">
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

                    <div className="mt-12 flex items-center justify-center gap-5">
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
        </section>
    );
}

function PracticeGallery() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSliderPaused, setIsSliderPaused] = useState(false);

    const goToPreviousSlide = () => setActiveSlide((currentSlide) => (currentSlide === 0 ? galleryImages.length - 1 : currentSlide - 1));
    const goToNextSlide = () => setActiveSlide((currentSlide) => (currentSlide === galleryImages.length - 1 ? 0 : currentSlide + 1));

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isSliderPaused || prefersReducedMotion) {
            return;
        }

        const autoplayId = window.setInterval(goToNextSlide, 4500);

        return () => window.clearInterval(autoplayId);
    }, [isSliderPaused]);

    return (
        <section id="gallery" className="bg-white px-6 md:px-10">
            <div className="mx-auto max-w-[1788px] border-t border-[#d9dde2] py-36 md:py-44">
                {sectionHeading('In Practice', 'Moments of creation with the MAZ Kit.')}

                <ScrollReveal className="mt-24" delay={120} y={38} onFocus={() => setIsSliderPaused(true)} onBlur={() => setIsSliderPaused(false)}>
                    <div className="relative mx-auto max-w-[1320px]">
                        <div className="overflow-hidden" onMouseEnter={() => setIsSliderPaused(true)} onMouseLeave={() => setIsSliderPaused(false)}>
                            <div
                                className="flex transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                            >
                                {galleryImages.map((image) => (
                                    <div key={image.src} className="w-full shrink-0 px-0 md:px-10">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="group mx-auto flex aspect-[1.42/1] w-full max-w-[1120px] items-center justify-center overflow-hidden bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                                                >
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt}
                                                        decoding="async"
                                                        loading="lazy"
                                                        className="h-full w-full object-contain transition-opacity duration-300 ease-out group-hover:opacity-90"
                                                    />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[min(92vw,1100px)] border-0 bg-transparent p-0 shadow-none [&>button]:bg-white/90 [&>button]:text-[#123b6d]">
                                                <DialogTitle className="sr-only">{image.alt}</DialogTitle>
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    decoding="async"
                                                    className="max-h-[88vh] w-full rounded-[4px] object-contain"
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

                    <div className="mt-10 flex items-center justify-center gap-5">
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
        </section>
    );
}

function Faq() {
    return (
        <section className="bg-white px-6 md:px-10">
            <div className="mx-auto max-w-[1788px] border-t border-[#d9dde2] py-36 md:py-44">
                {sectionHeading('Common Questions', 'Everything you need to know about the MAZ experience.')}

                <div className="mx-auto mt-20 max-w-[1160px]">
                    {faqs.map((faq, index) => (
                        <ScrollReveal key={faq.question} delay={index * 75} y={28}>
                            <Collapsible className="border-b border-[#cfd5dd]">
                                <CollapsibleTrigger className="group/faq flex w-full items-center justify-between gap-6 py-10 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]">
                                    <span className="font-['Cormorant_Garamond'] text-[29px] leading-snug font-medium text-[#123b6d] md:text-[33px]">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className="size-7 shrink-0 text-[#123b6d] transition-transform duration-300 ease-out group-data-[state=open]/faq:rotate-180"
                                        aria-hidden="true"
                                    />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden">
                                    <p className="max-w-[980px] pb-10 text-[19px] leading-8 text-[#4a4f58]">{faq.answer}</p>
                                </CollapsibleContent>
                            </Collapsible>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
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

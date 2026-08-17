import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShopLayout } from '@/features/shop/components/shop-layout';
import { kitImage, mazWatercolorKitPath } from '@/features/shop/product-data';
import { ChevronDown } from 'lucide-react';
import { ColorScrollAnimation } from './color-scroll-animation';
import { KitOptionCard, type KitOptionCardProps } from './kit-option-card';

const kitOptions: KitOptionCardProps[] = [
    {
        title: 'Essential Kit',
        description: 'The core watercolor experience.',
        price: '$45.00',
        imageSrc: kitImage,
        imageAlt: 'MAZ Watercolour Essential Kit',
        productHref: mazWatercolorKitPath,
    },
    {
        title: 'Pro Bundle',
        description: 'Kit + Canvas Carry Bag.',
        price: '$65.00',
        imageSrc: kitImage,
        imageAlt: 'MAZ Watercolour Pro Bundle',
        productHref: mazWatercolorKitPath,
        featured: true,
    },
    {
        title: "Artist's Suite",
        description: 'Kit + Bag + Extra Artisan Paper.',
        price: '$85.00',
        imageSrc: kitImage,
        imageAlt: "MAZ Watercolour Artist's Suite",
        productHref: mazWatercolorKitPath,
    },
];

const galleryImages = [
    {
        src: '/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.50%20(1).jpeg',
        alt: 'Artist workspace with MAZ watercolor supplies',
    },
    {
        src: '/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.50.jpeg',
        alt: 'Watercolor practice scene with MAZ kit',
    },
    {
        src: '/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.51%20(1).jpeg',
        alt: 'MAZ watercolor kit in use',
    },
    {
        src: '/gallery/WhatsApp%20Image%202026-08-16%20at%2020.53.51.jpeg',
        alt: 'Creative watercolor setup with MAZ tools',
    },
] as const;

const kitContents = [
    {
        title: 'Illustrated Kit Box',
        description: 'Protective keepsake packaging',
        imageSrc: '/what_inside/box.png',
        imageAlt: 'Illustrated MAZ watercolor kit box',
        className: 'sm:col-span-2 md:col-span-12',
        imageClassName: 'max-w-[980px]',
    },
    {
        title: '12 Watercolour Tubes',
        description: 'Core pigment range',
        imageSrc: '/what_inside/colots.png',
        imageAlt: 'Twelve MAZ watercolor paint tubes',
        className: 'sm:col-span-2 md:col-span-12',
        imageClassName: 'max-w-[1280px]',
    },
    {
        title: 'Gold Binder Clip',
        description: 'Keeps paper steady',
        imageSrc: '/what_inside/gold_clip.png',
        imageAlt: 'Gold binder clip',
        className: 'md:col-span-3 md:col-start-2',
        imageClassName: 'max-w-[260px]',
    },
    {
        title: 'Wood Mixing Palette',
        description: 'Compact removable tray',
        imageSrc: '/what_inside/wood_palette.png',
        imageAlt: 'Wood watercolor mixing palette',
        className: 'md:col-span-4',
        imageClassName: 'max-w-[420px]',
    },
    {
        title: 'Water Brush Pen',
        description: 'Refillable detail brush',
        imageSrc: '/what_inside/water_brush_pen.png',
        imageAlt: 'Transparent refillable water brush pen',
        className: 'md:col-span-3',
        imageClassName: 'max-h-[520px] w-auto',
    },
    {
        title: 'White Sponge',
        description: 'For lifting and cleanup',
        imageSrc: '/what_inside/white_sponge.png',
        imageAlt: 'White watercolor sponge',
        className: 'md:col-span-4 md:col-start-3',
        imageClassName: 'max-w-[390px]',
    },
    {
        title: 'Watercolor Paper Pad',
        description: 'Premium cold-pressed sheets',
        imageSrc: '/what_inside/watercolor_paper_padi.png',
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
        author: '- MARCUS T., DESIGNER',
    },
    {
        quote: '"Compact enough for travel, but uncompromising on professional quality. My absolute go-to."',
        author: '- ELENA R., FINE ARTIST',
    },
];

const faqs = [
    {
        question: 'Is this kit suitable for absolute beginners?',
        answer: "Yes. We've curated the Essential Kit specifically for those starting their journey, providing professional-grade tools that are intuitive and forgiving for new artists.",
    },
    {
        question: "What makes the paper 'Artisan' quality?",
        answer: 'Our paper is 300gsm cold-pressed cotton, specifically chosen for its ability to handle heavy washes and fine detail without warping or pilling.',
    },
    {
        question: 'How long does shipping take within Lebanon?',
        answer: 'We offer free delivery across Lebanon. Orders are typically processed within 24 hours and delivered within 2-4 business days.',
    },
    {
        question: 'Are the pigments lightfast?',
        answer: 'Absolutely. All 20 pigments in our kit are rated for high lightfastness, ensuring your artwork maintains its vibrancy for years to come.',
    },
];

function sectionHeading(title: string, subtitle?: string) {
    return (
        <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-['Cormorant_Garamond'] text-[50px] leading-none font-medium text-[#123b6d] md:text-[72px]">{title}</h2>
            {subtitle ? <p className="mt-7 text-[18px] leading-7 text-[#4c525c]">{subtitle}</p> : null}
        </div>
    );
}

function Hero() {
    return (
        <section id="shop" className="bg-[#fefdfc]">
            <div className="mx-auto grid min-h-[770px] max-w-[1788px] items-center gap-12 px-6 py-20 md:grid-cols-[0.78fr_1.22fr] md:px-10 md:py-0 xl:px-0">
                <div className="max-w-[660px] pt-2">
                    <h1 className="font-['Cormorant_Garamond'] text-[64px] leading-[0.94] font-medium text-[#123b6d] md:text-[92px] lg:text-[108px]">
                        The Art of
                        <br />
                        Expression
                    </h1>
                    <p className="mt-10 max-w-[585px] text-[20px] leading-9 text-[#4a4f58] md:text-[22px]">
                        Discover the fluidity of pigment and paper with the curated MAZ Watercolor Kit. Designed for artists who seek intentionality
                        in every stroke.
                    </p>
                    <Button
                        asChild
                        className="mt-12 h-[62px] rounded-[3px] bg-[#123b6d] px-12 text-[14px] font-medium tracking-[0.2em] text-white hover:bg-[#0f315b]"
                    >
                        <a href="#kit-options">SHOP THE KIT</a>
                    </Button>
                </div>

                <div className="flex items-center justify-center md:justify-end">
                    <img
                        src={kitImage}
                        alt="MAZ Watercolour Kit box"
                        className="w-full max-w-[960px] object-contain drop-shadow-[0_28px_26px_rgba(20,20,20,0.22)]"
                    />
                </div>
            </div>
        </section>
    );
}

function KitContentFigure({ title, description, imageSrc, imageAlt, className, imageClassName }: (typeof kitContents)[number]) {
    return (
        <figure className={['relative flex flex-col items-center text-center', className].join(' ')}>
            <img
                src={imageSrc}
                alt={imageAlt}
                className={['max-h-[520px] w-full object-contain drop-shadow-[0_18px_24px_rgba(18,59,109,0.12)]', imageClassName].join(' ')}
            />
            <figcaption className="relative mt-5 max-w-[360px] before:absolute before:top-[-18px] before:left-1/2 before:h-3 before:w-px before:-translate-x-1/2 before:bg-[#c7cdd5]">
                <span className="mx-auto mb-3 block h-3 w-3 rounded-full border-2 border-white bg-[#123b6d] shadow-[0_0_0_1px_rgba(18,59,109,0.2)]" />
                <h3 className="font-['Cormorant_Garamond'] text-[32px] leading-none font-medium text-[#123b6d] md:text-[36px]">{title}</h3>
                <p className="mt-3 text-[16px] leading-snug text-[#4b5058] md:text-[18px]">{description}</p>
            </figcaption>
        </figure>
    );
}

function WhatsInside() {
    return (
        <section className="bg-white px-6 pt-40 pb-36 md:px-10 md:pt-52 md:pb-48">
            <div className="mx-auto max-w-[1700px]">
                {sectionHeading("What's Inside", "Everything you need, nothing you don't.")}

                <div className="mx-auto mt-24 grid max-w-[1500px] grid-cols-1 items-end gap-x-10 gap-y-20 sm:grid-cols-2 md:grid-cols-12 md:gap-y-24">
                    {kitContents.map((item) => (
                        <KitContentFigure key={item.title} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function KitOptions() {
    return (
        <section id="kit-options" className="bg-white px-6 py-36 md:px-10 md:py-48">
            <div className="mx-auto max-w-[1788px]">
                {sectionHeading('Kit Options', 'Find the perfect setup for your artistic journey.')}

                <div className="mt-28 grid gap-12 md:grid-cols-3 md:gap-12">
                    {kitOptions.map((option) => (
                        <KitOptionCard key={option.title} {...option} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section className="bg-white px-6 md:px-10">
            <div className="mx-auto max-w-[1788px] border-t border-[#d9dde2] py-36 md:py-44">
                {sectionHeading('Artist Perspectives')}

                <div className="mx-auto mt-20 grid max-w-[1450px] gap-14 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <figure key={testimonial.author} className="text-center">
                            <blockquote className="mx-auto max-w-[380px] text-[20px] leading-9 font-normal text-[#434852] italic">
                                {testimonial.quote}
                            </blockquote>
                            <figcaption className="mt-9 text-[18px] leading-none font-medium tracking-[0.2em] text-[#123b6d]">
                                {testimonial.author}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PracticeGallery() {
    return (
        <section id="gallery" className="bg-white px-6 md:px-10">
            <div className="mx-auto max-w-[1788px] border-t border-[#d9dde2] py-36 md:py-44">
                {sectionHeading('In Practice', 'Moments of creation with the MAZ Kit.')}

                <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryImages.map((image) => (
                        <Dialog key={image.src}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="group aspect-[1.15/1] overflow-hidden bg-[#f4f1ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123b6d]"
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[min(92vw,1100px)] border-0 bg-transparent p-0 shadow-none [&>button]:bg-white/90 [&>button]:text-[#123b6d]">
                                <DialogTitle className="sr-only">{image.alt}</DialogTitle>
                                <img src={image.src} alt={image.alt} className="max-h-[88vh] w-full rounded-[4px] object-contain" />
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
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
                    {faqs.map((faq) => (
                        <Collapsible key={faq.question} className="border-b border-[#cfd5dd]">
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
                    ))}
                </div>
            </div>
        </section>
    );
}

export function HomePage() {
    return (
        <ShopLayout>
            <main>
                <Hero />
                <WhatsInside />
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

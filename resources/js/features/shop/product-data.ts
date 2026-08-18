export const productImage = '/optimized/product/box.webp';
export const kitImage = productImage;

export const mazWatercolorKitPath = '/products/maz-watercolor-kit';

export interface ShopProduct {
    slug: string;
    title: string;
    description: string;
    priceCents: number;
    price: string;
    compareAtPriceCents?: number;
    compareAtPrice?: string;
    badgeLabel?: string;
    imageSrc: string;
    imageAlt: string;
    productHref: string;
}

export function formatMoney(cents: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
}

export const shopProducts: ShopProduct[] = [
    {
        slug: 'essential-kit',
        title: 'Single Kit',
        description: 'One complete MAZ watercolor kit.',
        priceCents: 2500,
        price: formatMoney(2500),
        imageSrc: productImage,
        imageAlt: 'MAZ Watercolour Single Kit box',
        productHref: mazWatercolorKitPath,
    },
    {
        slug: 'pro-bundle',
        title: 'Double Kit Bundle',
        description: 'Two MAZ watercolor kits. Save $10.',
        priceCents: 4000,
        price: formatMoney(4000),
        compareAtPriceCents: 5000,
        compareAtPrice: formatMoney(5000),
        badgeLabel: 'SAVE $10',
        imageSrc: productImage,
        imageAlt: 'MAZ Watercolour Double Kit Bundle box',
        productHref: mazWatercolorKitPath,
    },
];

export const primaryShopProduct = shopProducts[0];

export const productGalleryImages = [
    {
        src: productImage,
        alt: 'MAZ Watercolour Kit illustrated box',
    },
    {
        src: '/optimized/product/colots.webp',
        alt: 'MAZ watercolor colors set',
    },
    {
        src: '/optimized/product/gold_clip.webp',
        alt: 'Gold binder clip from the MAZ kit',
    },
    {
        src: '/optimized/product/kit_content.webp',
        alt: 'MAZ watercolor kit contents',
    },
    {
        src: '/optimized/product/watercolor_paper_padi.webp',
        alt: 'MAZ notebook 8 by 8 paper pad',
    },
    {
        src: '/optimized/product/water_brush_pen.webp',
        alt: 'Transparent refillable water brush pen',
    },
    {
        src: '/optimized/product/WhatsApp%20Image%202026-08-16%20at%2020.53.50%20(1).webp',
        alt: 'Open watercolor palette with MAZ pigments',
    },
    {
        src: '/optimized/product/WhatsApp%20Image%202026-08-16%20at%2020.53.50.webp',
        alt: 'Brushes and watercolor wash from the MAZ kit',
    },
    {
        src: '/optimized/product/WhatsApp%20Image%202026-08-16%20at%2020.53.51%20(1).webp',
        alt: 'MAZ kit packaging in a studio setting',
    },
    {
        src: '/optimized/product/WhatsApp%20Image%202026-08-16%20at%2020.53.51.webp',
        alt: 'MAZ watercolor kit in use',
    },
    {
        src: '/optimized/product/white_sponge.webp',
        alt: 'Wrist band from the MAZ kit',
    },
    {
        src: '/optimized/product/wood_palette.webp',
        alt: 'Wood watercolor mixing palette',
    },
] as const;

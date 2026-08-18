import { ProductPage } from '@/features/shop/components/product-page';
import { Head } from '@inertiajs/react';

export default function MazWatercolorKit() {
    return (
        <>
            <Head title="MAZ Watercolor Kit">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link rel="preload" as="image" href="/optimized/product/box.webp" />
                <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <ProductPage />
        </>
    );
}

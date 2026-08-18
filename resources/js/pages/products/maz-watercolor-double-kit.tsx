import { ProductPage } from '@/features/shop/components/product-page';
import { doubleKitProduct } from '@/features/shop/product-data';
import { Head } from '@inertiajs/react';

export default function MazWatercolorDoubleKit() {
    return (
        <>
            <Head title="MAZ Double Kit Bundle">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link rel="preload" as="image" href={doubleKitProduct.imageSrc} />
                <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <ProductPage product={doubleKitProduct} />
        </>
    );
}

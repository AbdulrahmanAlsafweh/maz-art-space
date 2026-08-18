import { HomePage } from '@/features/home/components/home-page';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="MAZ Watercolour Kit">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    rel="preload"
                    as="image"
                    href="/optimized/box-1400.webp"
                    imageSrcSet="/optimized/box-900.webp 900w, /optimized/box-1400.webp 1400w"
                    imageSizes="(min-width: 768px) 58vw, 92vw"
                />
                <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <HomePage />
        </>
    );
}

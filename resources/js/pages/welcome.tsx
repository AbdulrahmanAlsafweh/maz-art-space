import { HomePage } from '@/features/home/components/home-page';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="MAZ Watercolour Kit">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <HomePage />
        </>
    );
}

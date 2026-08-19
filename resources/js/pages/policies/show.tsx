import { PolicyPage } from '@/features/shop/components/policy-page';
import { Head } from '@inertiajs/react';

interface PolicyShowProps {
    policy: {
        title: string;
        slug: string;
        content: string;
        updatedAt?: string | null;
    };
}

export default function PolicyShow({ policy }: PolicyShowProps) {
    return (
        <>
            <Head title={policy.title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <PolicyPage policy={policy} />
        </>
    );
}

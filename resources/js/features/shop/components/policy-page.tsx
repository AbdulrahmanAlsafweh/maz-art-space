import { ShopContainer, ShopSection } from './shop-design';
import { ShopLayout } from './shop-layout';

interface PolicyPageProps {
    policy: {
        title: string;
        slug: string;
        content: string;
        updatedAt?: string | null;
    };
}

export function PolicyPage({ policy }: PolicyPageProps) {
    const sections = policy.content
        .split(/\n{2,}/)
        .map((section) => section.trim())
        .filter(Boolean);

    return (
        <ShopLayout>
            <main>
                <ShopSection className="pt-16 pb-24 sm:pt-20 lg:pt-24">
                    <ShopContainer className="max-w-[840px]">
                        <p className="maz-label text-[#a0432f]">MAZ Art Space</p>
                        <h1 className="maz-section-title mt-5 text-left">{policy.title}</h1>
                        {policy.updatedAt ? <p className="maz-body mt-5">Last updated {policy.updatedAt}</p> : null}

                        <article className="maz-policy-content mt-12">
                            {sections.map((section) => (
                                <p key={section}>{section}</p>
                            ))}
                        </article>
                    </ShopContainer>
                </ShopSection>
            </main>
        </ShopLayout>
    );
}

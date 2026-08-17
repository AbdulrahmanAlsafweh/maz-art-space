import { Button } from '@/components/ui/button';

export interface KitOptionCardProps {
    title: string;
    description: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
    featured?: boolean;
}

export function KitOptionCard({ title, description, price, imageSrc, imageAlt, featured = false }: KitOptionCardProps) {
    return (
        <article className="flex h-full flex-col items-center text-center">
            <div className="flex aspect-square w-full items-center justify-center bg-[#f4f1ed] px-6">
                <img src={imageSrc} alt={imageAlt} className="w-full max-w-[410px] object-contain" />
            </div>

            <div className="flex w-full flex-1 flex-col items-center pt-9">
                <h3 className="font-['Cormorant_Garamond'] text-[32px] leading-none font-medium text-[#123b6d] md:text-[36px]">{title}</h3>
                <p className="mt-5 text-[17px] leading-7 text-[#4a4f58]">{description}</p>
                <p className="mt-8 font-['Instrument_Sans'] text-[17px] leading-none font-medium tracking-[0.18em] text-[#123b6d]">{price}</p>
                <Button
                    type="button"
                    variant={featured ? 'default' : 'outline'}
                    className={[
                        'mt-10 h-[64px] w-full rounded-[2px] border-[#123b6d] font-["Instrument_Sans"] text-[15px] font-medium tracking-[0.22em]',
                        featured ? 'bg-[#123b6d] text-white hover:bg-[#0f315b]' : 'bg-white text-[#123b6d] hover:bg-[#f8f9fb] hover:text-[#123b6d]',
                    ].join(' ')}
                >
                    ADD TO CART
                </Button>
            </div>
        </article>
    );
}

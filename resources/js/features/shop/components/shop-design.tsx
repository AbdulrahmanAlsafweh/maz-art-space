import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

export function ShopContainer({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
    return <div className={cn('mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8', className)} {...props} />;
}

export function ShopSection({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
    return <section className={cn('bg-white py-20 sm:py-24 lg:py-32', className)} {...props} />;
}

export function ShopSectionHeader({
    title,
    subtitle,
    align = 'center',
    className,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    align?: 'center' | 'left';
    className?: string;
}) {
    return (
        <div className={cn('max-w-[680px]', align === 'center' ? 'mx-auto text-center' : '', className)}>
            <h2 className="maz-section-title">{title}</h2>
            {subtitle ? <p className="maz-section-copy mx-auto mt-5 max-w-[62ch]">{subtitle}</p> : null}
        </div>
    );
}

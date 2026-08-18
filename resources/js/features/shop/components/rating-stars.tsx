import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
    count?: number;
    half?: boolean;
    className?: string;
    iconClassName?: string;
}

export function RatingStars({ count = 5, half = false, className, iconClassName = 'size-4' }: RatingStarsProps) {
    return (
        <span className={cn('inline-flex items-center gap-0.5 text-[#a0432f]', className)} aria-hidden="true">
            {Array.from({ length: count }).map((_, index) => (
                <Star key={index} className={cn('fill-current stroke-current', iconClassName)} />
            ))}
            {half ? <StarHalf className={cn('fill-current stroke-current', iconClassName)} /> : null}
        </span>
    );
}

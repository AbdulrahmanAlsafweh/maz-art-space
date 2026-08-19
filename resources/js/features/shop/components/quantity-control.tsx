import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
    quantity: number;
    onChange: (quantity: number) => void;
    min?: number;
    max?: number;
    className?: string;
    buttonClassName?: string;
    valueClassName?: string;
}

export function QuantityControl({ quantity, onChange, min = 0, max = 20, className, buttonClassName, valueClassName }: QuantityControlProps) {
    const normalizedQuantity = Math.min(Math.max(quantity, min), max);

    return (
        <div className={cn('inline-flex h-11 items-center border border-[#c9ced6] bg-white text-[#123b6d]', className)}>
            <button
                type="button"
                onClick={() => onChange(normalizedQuantity - 1)}
                disabled={normalizedQuantity <= min}
                className={cn(
                    'flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35',
                    buttonClassName,
                )}
                aria-label="Decrease quantity"
            >
                <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className={cn('w-12 text-center text-[9px] font-medium tabular-nums', valueClassName)}>{normalizedQuantity}</span>
            <button
                type="button"
                onClick={() => onChange(normalizedQuantity + 1)}
                disabled={normalizedQuantity >= max}
                className={cn(
                    'flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35',
                    buttonClassName,
                )}
                aria-label="Increase quantity"
            >
                <Plus className="size-4" aria-hidden="true" />
            </button>
        </div>
    );
}

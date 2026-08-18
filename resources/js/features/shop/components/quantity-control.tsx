import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
    quantity: number;
    onChange: (quantity: number) => void;
    min?: number;
    max?: number;
}

export function QuantityControl({ quantity, onChange, min = 0, max = 20 }: QuantityControlProps) {
    const normalizedQuantity = Math.min(Math.max(quantity, min), max);

    return (
        <div className="inline-flex h-11 items-center border border-[#c9ced6] bg-white text-[#123b6d]">
            <button
                type="button"
                onClick={() => onChange(normalizedQuantity - 1)}
                disabled={normalizedQuantity <= min}
                className="flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Decrease quantity"
            >
                <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-12 text-center text-[16px] font-medium tabular-nums">{normalizedQuantity}</span>
            <button
                type="button"
                onClick={() => onChange(normalizedQuantity + 1)}
                disabled={normalizedQuantity >= max}
                className="flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Increase quantity"
            >
                <Plus className="size-4" aria-hidden="true" />
            </button>
        </div>
    );
}

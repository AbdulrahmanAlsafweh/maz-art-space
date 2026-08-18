import { useToast } from '@/components/shared/toast-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ShoppingBag } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { type ShopProduct } from '../product-data';
import { useCart } from './cart-context';

interface AddToCartButtonProps {
    product: ShopProduct;
    className?: string;
    children?: ReactNode;
    showIcon?: boolean;
    onAdded?: () => void;
}

function playCartTickSound() {
    try {
        const AudioContextClass =
            window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
        oscillator.onended = () => void audioContext.close();
    } catch {
        // Browsers can block audio in strict modes; cart feedback should still work without sound.
    }
}

export function AddToCartButton({ product, className, children = 'ADD TO CART', showIcon = false, onAdded }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [recentlyAdded, setRecentlyAdded] = useState(false);

    const handleAddToCart = () => {
        addItem(product);
        playCartTickSound();
        showToast({
            title: 'Item added successfully',
            description: `${product.title} has been added to your cart.`,
            variant: 'success',
        });
        setRecentlyAdded(true);
        window.setTimeout(() => setRecentlyAdded(false), 1400);
        onAdded?.();
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleAddToCart}
            className={cn(
                'rounded-[2px] border-[#123b6d] bg-white font-["Instrument_Sans"] font-medium tracking-[0.22em] text-[#123b6d] transition-colors hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white',
                className,
            )}
        >
            {showIcon ? (
                recentlyAdded ? (
                    <Check className="size-4" aria-hidden="true" />
                ) : (
                    <ShoppingBag className="size-4" aria-hidden="true" />
                )
            ) : null}
            {recentlyAdded ? 'ADDED' : children}
        </Button>
    );
}

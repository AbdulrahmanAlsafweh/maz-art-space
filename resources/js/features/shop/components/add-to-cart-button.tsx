import { useToast } from '@/components/shared/toast-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ShoppingBag } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { type ShopProduct } from '../product-data';
import { useCart } from './cart-context';
import { QuantityControl } from './quantity-control';

interface AddToCartButtonProps {
    product: ShopProduct;
    className?: string;
    children?: ReactNode;
    showIcon?: boolean;
    onAdded?: () => void;
    showQuantityControl?: boolean;
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

export function AddToCartButton({
    product,
    className,
    children = 'ADD TO CART',
    showIcon = false,
    onAdded,
    showQuantityControl = true,
}: AddToCartButtonProps) {
    const { addItem, items, updateQuantity } = useCart();
    const { showToast } = useToast();
    const [recentlyAdded, setRecentlyAdded] = useState(false);
    const addLockRef = useRef(false);
    const animationTimeoutRef = useRef<number | null>(null);
    const cartItem = items.find((item) => item.productSlug === product.slug);

    useEffect(
        () => () => {
            if (animationTimeoutRef.current !== null) {
                window.clearTimeout(animationTimeoutRef.current);
            }
        },
        [],
    );

    const handleAddToCart = () => {
        if (addLockRef.current) {
            return;
        }

        if (cartItem) {
            onAdded?.();

            return;
        }

        addLockRef.current = true;
        addItem(product);
        playCartTickSound();
        showToast({
            title: 'Item added successfully',
            description: `${product.title} has been added to your cart.`,
            variant: 'success',
        });
        setRecentlyAdded(true);
        animationTimeoutRef.current = window.setTimeout(() => {
            setRecentlyAdded(false);
            addLockRef.current = false;
        }, 700);
        onAdded?.();
    };

    if (showQuantityControl && cartItem && !recentlyAdded) {
        return (
            <QuantityControl
                quantity={cartItem.quantity}
                min={1}
                max={20}
                onChange={(quantity) => updateQuantity(product.slug, quantity)}
                className={cn(
                    'maz-button-base animate-in fade-in-0 zoom-in-95 w-full border-[#123b6d] bg-white p-0 font-["Instrument_Sans"] text-[#123b6d] duration-300',
                    className,
                    'bg-white text-[#123b6d] hover:bg-white hover:text-[#123b6d]',
                )}
                buttonClassName="w-[26%] hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white focus-visible:outline-none"
                valueClassName="flex-1 text-[0.9rem] font-semibold"
            />
        );
    }

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleAddToCart}
            className={cn(
                'maz-button-base border-[#123b6d] bg-white font-["Instrument_Sans"] font-medium text-[#123b6d] transition-[color,background-color,border-color,transform] duration-300 hover:bg-[#123b6d] hover:text-white focus-visible:bg-[#123b6d] focus-visible:text-white',
                className,
                recentlyAdded && 'scale-[0.985] border-[#2f8f61] bg-[#2f8f61] text-white hover:bg-[#2f8f61] focus-visible:bg-[#2f8f61]',
            )}
        >
            {recentlyAdded ? <Check className="size-4 animate-[bounce_0.45s_ease-out_1]" aria-hidden="true" /> : null}
            {!recentlyAdded && showIcon ? <ShoppingBag className="size-4" aria-hidden="true" /> : null}
            {recentlyAdded ? 'ADDED' : children}
        </Button>
    );
}

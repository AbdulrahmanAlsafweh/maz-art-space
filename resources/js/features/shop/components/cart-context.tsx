import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cartDiscountCents, cartSubtotalCents, cartTotalCents } from '../pricing';
import { shopProducts, type ShopProduct } from '../product-data';

const cartStorageKey = 'maz-shop-cart';
const productsBySlug = new Map(shopProducts.map((product) => [product.slug, product]));

export interface CartItem {
    productSlug: string;
    title: string;
    priceCents: number;
    imageSrc: string;
    imageAlt: string;
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    totalQuantity: number;
    subtotalCents: number;
    discountCents: number;
    totalCents: number;
    addItem: (product: ShopProduct, quantity?: number) => void;
    updateQuantity: (productSlug: string, quantity: number) => void;
    removeItem: (productSlug: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart() {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage.getItem(cartStorageKey);
    } catch {
        return null;
    }
}

function writeStoredCart(items: CartItem[]) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
    } catch {
        // Some iOS Safari configurations block storage writes. The cart should
        // still work for the current page session when persistence is unavailable.
    }
}

function clearStoredCart() {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.removeItem(cartStorageKey);
    } catch {
        // Ignore blocked storage cleanup.
    }
}

function sanitizeCartItems(items: unknown) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }

            const cartItem = item as Partial<CartItem>;
            const product = cartItem.productSlug ? productsBySlug.get(cartItem.productSlug) : null;

            if (!product) {
                return null;
            }

            return {
                productSlug: product.slug,
                title: product.title,
                priceCents: product.priceCents,
                imageSrc: product.imageSrc,
                imageAlt: product.imageAlt,
                quantity: Number(cartItem.quantity),
            };
        })
        .filter((item): item is CartItem => item !== null && Number.isFinite(item.quantity) && item.quantity > 0)
        .map((item) => ({
            ...item,
            quantity: Math.min(Math.max(Math.trunc(item.quantity), 1), 20),
        }));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hasLoadedCart, setHasLoadedCart] = useState(false);

    useEffect(() => {
        const storedCart = readStoredCart();

        if (!storedCart) {
            setHasLoadedCart(true);

            return;
        }

        try {
            setItems(sanitizeCartItems(JSON.parse(storedCart)));
        } catch {
            clearStoredCart();
        }

        setHasLoadedCart(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedCart) {
            return;
        }

        writeStoredCart(items);
    }, [hasLoadedCart, items]);

    const value = useMemo<CartContextValue>(() => {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotalCents = cartSubtotalCents(items);
        const discountCents = cartDiscountCents(items);
        const totalCents = cartTotalCents(items);

        return {
            items,
            totalQuantity,
            subtotalCents,
            discountCents,
            totalCents,
            addItem(product, quantity = 1) {
                setItems((currentItems) => {
                    const existingItem = currentItems.find((item) => item.productSlug === product.slug);

                    if (existingItem) {
                        return currentItems.map((item) =>
                            item.productSlug === product.slug ? { ...item, quantity: Math.min(item.quantity + Math.max(quantity, 1), 20) } : item,
                        );
                    }

                    return [
                        ...currentItems,
                        {
                            productSlug: product.slug,
                            title: product.title,
                            priceCents: product.priceCents,
                            imageSrc: product.imageSrc,
                            imageAlt: product.imageAlt,
                            quantity: Math.min(Math.max(quantity, 1), 20),
                        },
                    ];
                });
            },
            updateQuantity(productSlug, quantity) {
                setItems((currentItems) =>
                    currentItems
                        .map((item) => (item.productSlug === productSlug ? { ...item, quantity: Math.trunc(quantity) } : item))
                        .filter((item) => item.quantity > 0)
                        .map((item) => ({ ...item, quantity: Math.min(item.quantity, 20) })),
                );
            },
            removeItem(productSlug) {
                setItems((currentItems) => currentItems.filter((item) => item.productSlug !== productSlug));
            },
            clearCart() {
                setItems([]);
            },
        };
    }, [items]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider.');
    }

    return context;
}

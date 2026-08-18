export const singleKitSlug = 'essential-kit';
export const singleKitBundleSize = 2;
export const singleKitBundlePriceCents = 4000;

export interface PricedCartLine {
    productSlug: string;
    priceCents: number;
    quantity: number;
}

export function lineOriginalTotalCents(item: PricedCartLine) {
    return item.priceCents * item.quantity;
}

export function lineDiscountCents(item: PricedCartLine) {
    if (item.productSlug !== singleKitSlug) {
        return 0;
    }

    const bundleCount = Math.floor(item.quantity / singleKitBundleSize);
    const originalBundlePriceCents = item.priceCents * singleKitBundleSize;
    const discountPerBundleCents = Math.max(originalBundlePriceCents - singleKitBundlePriceCents, 0);

    return bundleCount * discountPerBundleCents;
}

export function lineTotalCents(item: PricedCartLine) {
    return lineOriginalTotalCents(item) - lineDiscountCents(item);
}

export function cartSubtotalCents(items: PricedCartLine[]) {
    return items.reduce((sum, item) => sum + lineOriginalTotalCents(item), 0);
}

export function cartDiscountCents(items: PricedCartLine[]) {
    return items.reduce((sum, item) => sum + lineDiscountCents(item), 0);
}

export function cartTotalCents(items: PricedCartLine[]) {
    return cartSubtotalCents(items) - cartDiscountCents(items);
}

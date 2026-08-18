<?php

namespace App\Support;

class CartPricing
{
    private const SINGLE_KIT_SLUG = 'essential-kit';

    private const SINGLE_KIT_BUNDLE_SIZE = 2;

    private const SINGLE_KIT_BUNDLE_PRICE_CENTS = 4000;

    public static function lineDiscountCents(string $productSlug, int $unitPriceCents, int $quantity): int
    {
        if ($productSlug !== self::SINGLE_KIT_SLUG) {
            return 0;
        }

        $bundleCount = intdiv($quantity, self::SINGLE_KIT_BUNDLE_SIZE);
        $originalBundlePriceCents = $unitPriceCents * self::SINGLE_KIT_BUNDLE_SIZE;
        $discountPerBundleCents = max($originalBundlePriceCents - self::SINGLE_KIT_BUNDLE_PRICE_CENTS, 0);

        return $bundleCount * $discountPerBundleCents;
    }
}

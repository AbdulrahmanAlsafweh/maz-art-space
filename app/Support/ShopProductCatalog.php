<?php

namespace App\Support;

class ShopProductCatalog
{
    /**
     * @return array<string, array{title: string, price_cents: int}>
     */
    public static function products(): array
    {
        return [
            'essential-kit' => [
                'title' => 'Single Kit',
                'price_cents' => 2500,
            ],
            'pro-bundle' => [
                'title' => 'Double Kit Bundle',
                'price_cents' => 4000,
            ],
        ];
    }

    /**
     * @return array{title: string, price_cents: int}|null
     */
    public static function find(string $productSlug): ?array
    {
        return self::products()[$productSlug] ?? null;
    }
}

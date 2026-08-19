<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class DeliverySetting extends Model
{
    public const PRICING_MODE_BY_ZONE = 'by_zone';

    public const PRICING_MODE_SAME_PRICE = 'same_price';

    public const INSIDE_TRIPOLI = 'inside_tripoli';

    public const OUTSIDE_TRIPOLI = 'outside_tripoli';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'pricing_mode',
        'same_price_cents',
        'inside_tripoli_cents',
        'outside_tripoli_cents',
    ];

    /**
     * @return array<string, string>
     */
    public static function zoneOptions(): array
    {
        return [
            self::INSIDE_TRIPOLI => 'Inside Tripoli',
            self::OUTSIDE_TRIPOLI => 'Outside Tripoli',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function pricingModeOptions(): array
    {
        return [
            self::PRICING_MODE_BY_ZONE => 'Inside / outside Tripoli prices',
            self::PRICING_MODE_SAME_PRICE => 'Same delivery price',
        ];
    }

    public static function costForZone(string $zone): int
    {
        $settings = self::current();

        if (($settings?->pricing_mode ?? self::PRICING_MODE_BY_ZONE) === self::PRICING_MODE_SAME_PRICE) {
            return $settings?->same_price_cents ?? 0;
        }

        return match ($zone) {
            self::OUTSIDE_TRIPOLI => $settings?->outside_tripoli_cents ?? 0,
            default => $settings?->inside_tripoli_cents ?? 0,
        };
    }

    public static function labelForZone(?string $zone): string
    {
        $settings = self::current();

        if (($settings?->pricing_mode ?? self::PRICING_MODE_BY_ZONE) === self::PRICING_MODE_SAME_PRICE) {
            return 'Lebanon delivery';
        }

        return self::zoneOptions()[$zone] ?? 'Inside Tripoli';
    }

    /**
     * @return array{pricingMode: string, requiresZoneChoice: bool, samePrice: array{label: string, priceCents: int, price: string}, zones: array<string, array{label: string, priceCents: int, price: string}>}
     */
    public static function publicData(): array
    {
        $settings = self::current();
        $pricingMode = $settings?->pricing_mode ?? self::PRICING_MODE_BY_ZONE;
        $samePriceCents = $settings?->same_price_cents ?? 0;

        return [
            'pricingMode' => $pricingMode,
            'requiresZoneChoice' => $pricingMode === self::PRICING_MODE_BY_ZONE,
            'samePrice' => [
                'label' => 'Lebanon delivery',
                'priceCents' => $samePriceCents,
                'price' => self::money($samePriceCents),
            ],
            'zones' => [
                self::INSIDE_TRIPOLI => [
                    'label' => self::labelForZone(self::INSIDE_TRIPOLI),
                    'priceCents' => $settings?->inside_tripoli_cents ?? 0,
                    'price' => self::money($settings?->inside_tripoli_cents ?? 0),
                ],
                self::OUTSIDE_TRIPOLI => [
                    'label' => self::labelForZone(self::OUTSIDE_TRIPOLI),
                    'priceCents' => $settings?->outside_tripoli_cents ?? 0,
                    'price' => self::money($settings?->outside_tripoli_cents ?? 0),
                ],
            ],
        ];
    }

    private static function current(): ?self
    {
        try {
            return self::query()->first();
        } catch (QueryException) {
            return null;
        }
    }

    private static function money(int $cents): string
    {
        return '$'.number_format($cents / 100, 2);
    }
}

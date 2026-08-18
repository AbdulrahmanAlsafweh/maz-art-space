<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class DeliverySetting extends Model
{
    public const INSIDE_TRIPOLI = 'inside_tripoli';

    public const OUTSIDE_TRIPOLI = 'outside_tripoli';

    /**
     * @var list<string>
     */
    protected $fillable = [
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

    public static function costForZone(string $zone): int
    {
        $settings = self::current();

        return match ($zone) {
            self::OUTSIDE_TRIPOLI => $settings?->outside_tripoli_cents ?? 0,
            default => $settings?->inside_tripoli_cents ?? 0,
        };
    }

    public static function labelForZone(?string $zone): string
    {
        return self::zoneOptions()[$zone] ?? 'Inside Tripoli';
    }

    /**
     * @return array{zones: array<string, array{label: string, priceCents: int, price: string}>}
     */
    public static function publicData(): array
    {
        $settings = self::current();

        return [
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

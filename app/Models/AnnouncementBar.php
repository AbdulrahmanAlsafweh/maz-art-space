<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class AnnouncementBar extends Model
{
    public const DEFAULT_BACKGROUND_COLOR = '#123b6d';

    public const DEFAULT_TEXT_COLOR = '#ffffff';

    public const DEFAULT_TEXT_ONE = 'FREE DELIVERY OVER LEBANON';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'is_enabled',
        'text_one',
        'text_two',
        'background_color',
        'text_color',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    /**
     * @return array{enabled: bool, texts: list<string>, backgroundColor: string, textColor: string}
     */
    public static function publicData(): array
    {
        try {
            $announcementBar = self::query()->first();
        } catch (QueryException) {
            $announcementBar = null;
        }

        $texts = collect([
            $announcementBar?->text_one ?: self::DEFAULT_TEXT_ONE,
            $announcementBar?->text_two,
        ])
            ->filter(fn (?string $text): bool => filled(trim($text ?? '')))
            ->map(fn (string $text): string => trim($text))
            ->values()
            ->all();

        return [
            'enabled' => $announcementBar?->is_enabled ?? true,
            'texts' => $texts,
            'backgroundColor' => $announcementBar?->background_color ?: self::DEFAULT_BACKGROUND_COLOR,
            'textColor' => $announcementBar?->text_color ?: self::DEFAULT_TEXT_COLOR,
        ];
    }
}

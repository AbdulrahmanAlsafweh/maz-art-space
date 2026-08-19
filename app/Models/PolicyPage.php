<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class PolicyPage extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'is_enabled',
        'display_order',
        'content',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * @return list<array{title: string, href: string}>
     */
    public static function publicLinks(): array
    {
        try {
            return self::query()
                ->where('is_enabled', true)
                ->orderBy('display_order')
                ->orderBy('title')
                ->get(['title', 'slug'])
                ->map(fn (self $policy): array => [
                    'title' => $policy->title,
                    'href' => route('policies.show', ['slug' => $policy->slug]),
                ])
                ->values()
                ->all();
        } catch (QueryException) {
            return [];
        }
    }
}

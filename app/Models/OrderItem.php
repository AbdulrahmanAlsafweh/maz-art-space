<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'product_slug',
        'product_title',
        'unit_price_cents',
        'quantity',
        'total_cents',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

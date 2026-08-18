<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'status',
        'currency',
        'subtotal_cents',
        'discount_cents',
        'shipping_cents',
        'delivery_zone',
        'total_cents',
        'payment_method',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_full_name',
        'shipping_line_one',
        'shipping_line_two',
        'shipping_city',
        'shipping_region',
        'shipping_postal_code',
        'shipping_country',
        'billing_same_as_shipping',
        'billing_full_name',
        'billing_line_one',
        'billing_line_two',
        'billing_city',
        'billing_region',
        'billing_postal_code',
        'billing_country',
        'notes',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'billing_same_as_shipping' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

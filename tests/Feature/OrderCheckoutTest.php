<?php

use App\Models\DeliverySetting;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

it('stores guest checkout orders with separate billing details', function () {
    $response = $this->post('/orders', [
        'order_number' => 'MAZ-260818-ABC123',
        'items' => [
            [
                'product_slug' => 'essential-kit',
                'quantity' => 2,
            ],
            [
                'product_slug' => 'pro-bundle',
                'quantity' => 1,
            ],
        ],
        'delivery_zone' => 'inside_tripoli',
        'customer' => [
            'name' => 'Mariam Artist',
            'email' => 'mariam@example.com',
            'phone' => '70000000',
        ],
        'shipping_address' => [
            'full_name' => 'Mariam Artist',
            'line_one' => 'Gemmayze Street',
            'line_two' => 'Floor 2',
            'city' => 'Beirut',
            'region' => 'Beirut',
            'country' => 'Lebanon',
        ],
        'billing_same_as_shipping' => false,
        'billing_address' => [
            'full_name' => 'Studio Billing',
            'line_one' => 'Hamra Street',
            'line_two' => '',
            'city' => 'Beirut',
            'region' => 'Beirut',
            'country' => 'Lebanon',
        ],
        'payment_method' => 'cash_on_delivery',
        'notes' => 'Call before delivery.',
    ]);

    $response
        ->assertRedirect(route('cart'))
        ->assertSessionHas('success')
        ->assertSessionHas('order.number', 'MAZ-260818-ABC123')
        ->assertSessionHas('order.items.0.title', '2 Single Kits')
        ->assertSessionHas('order.items.0.original_total', '$50.00')
        ->assertSessionHas('order.items.0.discount', '$10.00')
        ->assertSessionHas('order.items.0.total', '$40.00')
        ->assertSessionHas('order.subtotal', '$90.00')
        ->assertSessionHas('order.discount', '$10.00')
        ->assertSessionHas('order.delivery', '$0.00')
        ->assertSessionHas('order.total', '$80.00');

    $this->assertDatabaseHas('orders', [
        'order_number' => 'MAZ-260818-ABC123',
        'customer_email' => 'mariam@example.com',
        'customer_phone' => '+961 70000000',
        'subtotal_cents' => 9000,
        'discount_cents' => 1000,
        'shipping_cents' => 0,
        'total_cents' => 8000,
        'billing_same_as_shipping' => false,
        'billing_full_name' => 'Studio Billing',
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_slug' => 'essential-kit',
        'product_title' => 'Single Kit',
        'unit_price_cents' => 2500,
        'quantity' => 2,
        'total_cents' => 4000,
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_slug' => 'pro-bundle',
        'product_title' => 'Double Kit Bundle',
        'unit_price_cents' => 4000,
        'quantity' => 1,
        'total_cents' => 4000,
    ]);
});

it('rejects Whish orders while the payment method is coming soon', function () {
    $response = $this->post('/orders', [
        'items' => [
            [
                'product_slug' => 'essential-kit',
                'quantity' => 1,
            ],
        ],
        'delivery_zone' => 'outside_tripoli',
        'customer' => [
            'name' => 'Gateway Customer',
            'email' => '',
            'phone' => '71111111',
        ],
        'shipping_address' => [
            'full_name' => 'Gateway Customer',
            'line_one' => 'Verdun Street',
            'line_two' => '',
            'city' => 'Beirut',
            'region' => 'Beirut',
            'country' => 'Lebanon',
        ],
        'billing_same_as_shipping' => true,
        'billing_address' => [
            'full_name' => '',
            'line_one' => '',
            'line_two' => '',
            'city' => '',
            'region' => '',
            'country' => 'Lebanon',
        ],
        'payment_method' => 'whish',
        'notes' => '',
    ]);

    $response->assertSessionHasErrors('payment_method');

    $this->assertDatabaseMissing('orders', [
        'customer_phone' => '+961 71111111',
    ]);
});

it('applies admin delivery pricing based on the selected delivery zone', function () {
    DeliverySetting::query()->first()->update([
        'inside_tripoli_cents' => 200,
        'outside_tripoli_cents' => 500,
    ]);

    $response = $this->post('/orders', [
        'items' => [
            [
                'product_slug' => 'essential-kit',
                'quantity' => 1,
            ],
        ],
        'delivery_zone' => 'outside_tripoli',
        'customer' => [
            'name' => 'Outside Customer',
            'email' => '',
            'phone' => '72222222',
        ],
        'shipping_address' => [
            'full_name' => 'Outside Customer',
            'line_one' => 'Mina Road',
            'line_two' => '',
            'city' => 'Zgharta',
            'region' => 'North',
            'country' => 'Lebanon',
        ],
        'billing_same_as_shipping' => true,
        'billing_address' => [
            'full_name' => '',
            'line_one' => '',
            'line_two' => '',
            'city' => '',
            'region' => '',
            'country' => 'Lebanon',
        ],
        'payment_method' => 'cash_on_delivery',
        'notes' => '',
    ]);

    $response
        ->assertRedirect(route('cart'))
        ->assertSessionHas('order.delivery', '$5.00')
        ->assertSessionHas('order.delivery_label', 'Outside Tripoli')
        ->assertSessionHas('order.total', '$30.00');

    $this->assertDatabaseHas('orders', [
        'delivery_zone' => 'outside_tripoli',
        'shipping_cents' => 500,
        'total_cents' => 3000,
    ]);
});

it('uses same delivery pricing regardless of selected delivery zone', function () {
    DeliverySetting::query()->first()->update([
        'pricing_mode' => DeliverySetting::PRICING_MODE_SAME_PRICE,
        'same_price_cents' => 300,
        'inside_tripoli_cents' => 100,
        'outside_tripoli_cents' => 900,
    ]);

    $response = $this->post('/orders', [
        'items' => [
            [
                'product_slug' => 'essential-kit',
                'quantity' => 1,
            ],
        ],
        'delivery_zone' => 'outside_tripoli',
        'customer' => [
            'name' => 'Same Price Customer',
            'email' => '',
            'phone' => '73333333',
        ],
        'shipping_address' => [
            'full_name' => 'Same Price Customer',
            'line_one' => 'Mina Road',
            'line_two' => '',
            'city' => 'Tripoli',
            'region' => 'North',
            'country' => 'Lebanon',
        ],
        'billing_same_as_shipping' => true,
        'billing_address' => [
            'full_name' => '',
            'line_one' => '',
            'line_two' => '',
            'city' => '',
            'region' => '',
            'country' => 'Lebanon',
        ],
        'payment_method' => 'cash_on_delivery',
        'notes' => '',
    ]);

    $response
        ->assertRedirect(route('cart'))
        ->assertSessionHas('order.delivery', '$3.00')
        ->assertSessionHas('order.delivery_label', 'Lebanon delivery')
        ->assertSessionHas('order.total', '$28.00');

    $this->assertDatabaseHas('orders', [
        'delivery_zone' => 'outside_tripoli',
        'shipping_cents' => 300,
        'total_cents' => 2800,
    ]);
});

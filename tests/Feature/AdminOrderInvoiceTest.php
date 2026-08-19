<?php

use App\Models\Order;
use App\Models\User;

function createInvoiceOrder(): Order
{
    $order = Order::query()->create([
        'order_number' => 'MAZ-260819-ADMIN1',
        'status' => 'pending',
        'currency' => 'USD',
        'subtotal_cents' => 5000,
        'discount_cents' => 1000,
        'shipping_cents' => 300,
        'delivery_zone' => 'inside_tripoli',
        'total_cents' => 4300,
        'payment_method' => 'cash_on_delivery',
        'customer_name' => 'Invoice Customer',
        'customer_email' => 'invoice@example.com',
        'customer_phone' => '+961 81309837',
        'shipping_full_name' => 'Invoice Customer',
        'shipping_line_one' => 'Main Street',
        'shipping_line_two' => 'Floor 2',
        'shipping_city' => 'Tripoli',
        'shipping_region' => 'North',
        'shipping_country' => 'Lebanon',
        'billing_same_as_shipping' => true,
        'notes' => 'Call before delivery.',
    ]);

    $order->items()->create([
        'product_slug' => 'essential-kit',
        'product_title' => 'Single Kit',
        'unit_price_cents' => 2500,
        'quantity' => 2,
        'total_cents' => 4000,
    ]);

    return $order;
}

it('lets admins print a customer invoice from the admin order area', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $order = createInvoiceOrder();

    $this->actingAs($admin)
        ->get(route('admin.orders.invoice', ['order' => $order]))
        ->assertOk()
        ->assertSee('MAZ')
        ->assertSee('Order number: MAZ-260819-ADMIN1')
        ->assertSee('Invoice Customer')
        ->assertSee('2 Single Kits')
        ->assertSee('Bundle discount')
        ->assertSee('$43.00');
});

it('blocks non admins from printing admin customer invoices', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $order = createInvoiceOrder();

    $this->actingAs($user)
        ->get(route('admin.orders.invoice', ['order' => $order]))
        ->assertForbidden();
});

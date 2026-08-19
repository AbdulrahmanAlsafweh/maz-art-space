<?php

use App\Models\DeliverySetting;
use Inertia\Testing\AssertableInertia as Assert;

it('shares editable delivery prices with the storefront', function () {
    DeliverySetting::query()->first()->update([
        'inside_tripoli_cents' => 200,
        'outside_tripoli_cents' => 500,
    ]);

    $this->get('/cart')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('deliverySettings.zones.inside_tripoli.label', 'Inside Tripoli')
            ->where('deliverySettings.zones.inside_tripoli.priceCents', 200)
            ->where('deliverySettings.zones.inside_tripoli.price', '$2.00')
            ->where('deliverySettings.zones.outside_tripoli.label', 'Outside Tripoli')
            ->where('deliverySettings.zones.outside_tripoli.priceCents', 500)
            ->where('deliverySettings.zones.outside_tripoli.price', '$5.00'));
});

it('shares same delivery price mode with the storefront', function () {
    DeliverySetting::query()->first()->update([
        'pricing_mode' => DeliverySetting::PRICING_MODE_SAME_PRICE,
        'same_price_cents' => 300,
    ]);

    $this->get('/cart')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('deliverySettings.pricingMode', DeliverySetting::PRICING_MODE_SAME_PRICE)
            ->where('deliverySettings.requiresZoneChoice', false)
            ->where('deliverySettings.samePrice.label', 'Lebanon delivery')
            ->where('deliverySettings.samePrice.priceCents', 300)
            ->where('deliverySettings.samePrice.price', '$3.00'));
});

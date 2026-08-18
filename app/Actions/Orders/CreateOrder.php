<?php

namespace App\Actions\Orders;

use App\Models\DeliverySetting;
use App\Models\Order;
use App\Support\CartPricing;
use App\Support\ShopProductCatalog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrder
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Order
    {
        $lineItems = collect($data['items'])
            ->groupBy('product_slug')
            ->map(fn ($items, string $productSlug): array => [
                'product_slug' => $productSlug,
                'quantity' => $items->sum('quantity'),
            ])
            ->values();

        $pricedItems = $lineItems->map(function (array $item): array {
            $product = ShopProductCatalog::find($item['product_slug']);

            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => 'One of the selected products is no longer available.',
                ]);
            }

            $originalTotalCents = $product['price_cents'] * $item['quantity'];
            $lineDiscountCents = CartPricing::lineDiscountCents($item['product_slug'], $product['price_cents'], $item['quantity']);

            return [
                'product_slug' => $item['product_slug'],
                'product_title' => $product['title'],
                'unit_price_cents' => $product['price_cents'],
                'quantity' => $item['quantity'],
                'total_cents' => $originalTotalCents - $lineDiscountCents,
                'original_total_cents' => $originalTotalCents,
                'discount_cents' => $lineDiscountCents,
            ];
        });

        $subtotalCents = $pricedItems->sum('original_total_cents');
        $discountCents = $pricedItems->sum('discount_cents');
        $deliveryZone = (string) $data['delivery_zone'];
        $shippingCents = DeliverySetting::costForZone($deliveryZone);
        $totalCents = $subtotalCents - $discountCents + $shippingCents;
        $customer = $data['customer'];
        $shippingAddress = $data['shipping_address'];
        $billingSameAsShipping = (bool) $data['billing_same_as_shipping'];
        $billingAddress = $billingSameAsShipping ? [] : $data['billing_address'];

        return DB::transaction(function () use (
            $billingAddress,
            $billingSameAsShipping,
            $customer,
            $data,
            $pricedItems,
            $shippingAddress,
            $shippingCents,
            $deliveryZone,
            $subtotalCents,
            $discountCents,
            $totalCents
        ): Order {
            $order = Order::create([
                'order_number' => $data['order_number'] ?? $this->makeOrderNumber(),
                'status' => 'pending',
                'currency' => 'USD',
                'subtotal_cents' => $subtotalCents,
                'discount_cents' => $discountCents,
                'shipping_cents' => $shippingCents,
                'delivery_zone' => $deliveryZone,
                'total_cents' => $totalCents,
                'payment_method' => $data['payment_method'],
                'customer_name' => $customer['name'],
                'customer_email' => $customer['email'] ?? null,
                'customer_phone' => $this->lebanonPhone($customer['phone']),
                'shipping_full_name' => $shippingAddress['full_name'],
                'shipping_line_one' => $shippingAddress['line_one'],
                'shipping_line_two' => $shippingAddress['line_two'] ?? null,
                'shipping_city' => $shippingAddress['city'],
                'shipping_region' => $shippingAddress['region'],
                'shipping_postal_code' => $shippingAddress['postal_code'] ?? null,
                'shipping_country' => $shippingAddress['country'],
                'billing_same_as_shipping' => $billingSameAsShipping,
                'billing_full_name' => $billingAddress['full_name'] ?? null,
                'billing_line_one' => $billingAddress['line_one'] ?? null,
                'billing_line_two' => $billingAddress['line_two'] ?? null,
                'billing_city' => $billingAddress['city'] ?? null,
                'billing_region' => $billingAddress['region'] ?? null,
                'billing_postal_code' => $billingAddress['postal_code'] ?? null,
                'billing_country' => $billingAddress['country'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $order->items()->createMany(
                $pricedItems
                    ->map(fn (array $item): array => [
                        'product_slug' => $item['product_slug'],
                        'product_title' => $item['product_title'],
                        'unit_price_cents' => $item['unit_price_cents'],
                        'quantity' => $item['quantity'],
                        'total_cents' => $item['total_cents'],
                    ])
                    ->all()
            );

            return $order;
        });
    }

    private function makeOrderNumber(): string
    {
        do {
            $orderNumber = 'MAZ-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    private function lebanonPhone(string $phone): string
    {
        return '+961 '.$phone;
    }
}

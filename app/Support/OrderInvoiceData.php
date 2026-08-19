<?php

namespace App\Support;

use App\Models\DeliverySetting;
use App\Models\Order;

class OrderInvoiceData
{
    /**
     * @return array{
     *     number: string,
     *     created_at: string,
     *     subtotal: string,
     *     discount: string,
     *     discount_cents: int,
     *     delivery: string,
     *     delivery_zone: string,
     *     delivery_label: string,
     *     total: string,
     *     payment_method: string,
     *     payment_label: string,
     *     customer: array{name: string, email: string|null, phone: string},
     *     shipping_address: array{lines: list<string>},
     *     billing_same_as_shipping: bool,
     *     billing_address: array{lines: list<string>}|null,
     *     items: list<array{title: string, quantity: int, unit_price: string, original_total: string, discount: string, discount_cents: int, total: string}>,
     *     notes: string|null
     * }
     */
    public static function fromOrder(Order $order): array
    {
        $order->loadMissing('items');

        return [
            'number' => $order->order_number,
            'created_at' => $order->created_at->format('Y-m-d H:i'),
            'subtotal' => self::money($order->subtotal_cents),
            'discount' => self::money($order->discount_cents),
            'discount_cents' => $order->discount_cents,
            'delivery' => self::money($order->shipping_cents),
            'delivery_zone' => $order->delivery_zone,
            'delivery_label' => DeliverySetting::labelForZone($order->delivery_zone),
            'total' => self::money($order->total_cents),
            'payment_method' => $order->payment_method,
            'payment_label' => self::paymentLabel($order->payment_method),
            'customer' => [
                'name' => $order->customer_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
            ],
            'shipping_address' => [
                'lines' => self::addressLines([
                    $order->shipping_full_name,
                    $order->shipping_line_one,
                    $order->shipping_line_two,
                    trim($order->shipping_city.', '.$order->shipping_region, ', '),
                    $order->shipping_country,
                ]),
            ],
            'billing_same_as_shipping' => $order->billing_same_as_shipping,
            'billing_address' => $order->billing_same_as_shipping ? null : [
                'lines' => self::addressLines([
                    $order->billing_full_name,
                    $order->billing_line_one,
                    $order->billing_line_two,
                    trim(($order->billing_city ?? '').', '.($order->billing_region ?? ''), ', '),
                    $order->billing_country,
                ]),
            ],
            'items' => $order->items
                ->map(function ($item): array {
                    $lineDiscountCents = CartPricing::lineDiscountCents($item->product_slug, $item->unit_price_cents, $item->quantity);

                    return [
                        'title' => self::lineDisplayTitle($item->product_slug, $item->product_title, $item->quantity),
                        'quantity' => $item->quantity,
                        'unit_price' => self::money($item->unit_price_cents),
                        'original_total' => self::money($item->unit_price_cents * $item->quantity),
                        'discount' => self::money($lineDiscountCents),
                        'discount_cents' => $lineDiscountCents,
                        'total' => self::money($item->total_cents),
                    ];
                })
                ->values()
                ->all(),
            'notes' => $order->notes,
        ];
    }

    private static function money(int $cents): string
    {
        return '$'.number_format($cents / 100, 2);
    }

    /**
     * @param  list<string|null>  $lines
     * @return list<string>
     */
    private static function addressLines(array $lines): array
    {
        return array_values(array_filter($lines, fn (?string $line): bool => filled($line)));
    }

    private static function paymentLabel(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'whish', 'which_gateway' => 'Whish',
            default => 'Cash on delivery',
        };
    }

    private static function lineDisplayTitle(string $productSlug, string $productTitle, int $quantity): string
    {
        if ($productSlug === 'essential-kit' && $quantity > 1) {
            return "{$quantity} Single Kits";
        }

        return $productTitle;
    }
}

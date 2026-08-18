<?php

namespace App\Http\Controllers;

use App\Actions\Orders\CreateOrder;
use App\Http\Requests\StoreOrderRequest;
use App\Models\DeliverySetting;
use App\Support\CartPricing;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, CreateOrder $createOrder): RedirectResponse
    {
        $order = $createOrder->handle($request->validated());
        $order->load('items');

        return redirect()
            ->route('cart')
            ->with('success', 'Thank you. Your order has been submitted.')
            ->with('order', [
                'number' => $order->order_number,
                'created_at' => $order->created_at->format('Y-m-d H:i'),
                'subtotal' => $this->money($order->subtotal_cents),
                'discount' => $this->money($order->discount_cents),
                'discount_cents' => $order->discount_cents,
                'delivery' => $this->money($order->shipping_cents),
                'delivery_zone' => $order->delivery_zone,
                'delivery_label' => DeliverySetting::labelForZone($order->delivery_zone),
                'total' => $this->money($order->total_cents),
                'payment_method' => $order->payment_method,
                'payment_label' => $this->paymentLabel($order->payment_method),
                'customer' => [
                    'name' => $order->customer_name,
                    'email' => $order->customer_email,
                    'phone' => $order->customer_phone,
                ],
                'shipping_address' => [
                    'lines' => $this->addressLines([
                        $order->shipping_full_name,
                        $order->shipping_line_one,
                        $order->shipping_line_two,
                        trim($order->shipping_city.', '.$order->shipping_region, ', '),
                        $order->shipping_country,
                    ]),
                ],
                'billing_same_as_shipping' => $order->billing_same_as_shipping,
                'billing_address' => $order->billing_same_as_shipping ? null : [
                    'lines' => $this->addressLines([
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
                            'title' => $this->lineDisplayTitle($item->product_slug, $item->product_title, $item->quantity),
                            'quantity' => $item->quantity,
                            'unit_price' => $this->money($item->unit_price_cents),
                            'original_total' => $this->money($item->unit_price_cents * $item->quantity),
                            'discount' => $this->money($lineDiscountCents),
                            'discount_cents' => $lineDiscountCents,
                            'total' => $this->money($item->total_cents),
                        ];
                    })
                    ->values()
                    ->all(),
                'notes' => $order->notes,
            ]);
    }

    private function money(int $cents): string
    {
        return '$'.number_format($cents / 100, 2);
    }

    /**
     * @param  list<string|null>  $lines
     * @return list<string>
     */
    private function addressLines(array $lines): array
    {
        return array_values(array_filter($lines, fn (?string $line): bool => filled($line)));
    }

    private function paymentLabel(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'whish', 'which_gateway' => 'Whish',
            default => 'Cash on delivery',
        };
    }

    private function lineDisplayTitle(string $productSlug, string $productTitle, int $quantity): string
    {
        if ($productSlug === 'essential-kit' && $quantity > 1) {
            return "{$quantity} Single Kits";
        }

        return $productTitle;
    }
}

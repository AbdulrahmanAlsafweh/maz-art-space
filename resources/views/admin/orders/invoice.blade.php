<!DOCTYPE html>
<html lang="en" style="color-scheme: only light;">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $invoice['customer']['name'] }} - MAZ order</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cormorant-garamond:400,500,600,700|instrument-sans:400,500,600" rel="stylesheet">
        <style>
            :root {
                color-scheme: only light;
                --maz-blue: #123b6d;
                --maz-border: #d9dde2;
                --maz-muted: #404651;
                --maz-red: #a0432f;
            }

            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                background: #f4f6f8;
                color: var(--maz-muted);
                font-family: "Instrument Sans", Arial, sans-serif;
            }

            .toolbar {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding: 20px;
            }

            .button {
                border: 1px solid var(--maz-blue);
                background: var(--maz-blue);
                color: #ffffff;
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.16em;
                padding: 13px 22px;
                text-transform: uppercase;
            }

            .invoice-shell {
                width: min(100%, 860px);
                margin: 0 auto 42px;
                padding: 34px;
                background: #ffffff;
            }

            .invoice {
                border: 1px solid var(--maz-border);
                padding: 32px;
            }

            .invoice-header {
                display: flex;
                justify-content: space-between;
                gap: 32px;
                border-bottom: 1px solid var(--maz-border);
                padding-bottom: 32px;
            }

            .logo {
                color: #000000;
                font-family: "Cormorant Garamond", Georgia, serif;
                font-size: 33px;
                font-weight: 500;
                line-height: 1;
            }

            .kicker,
            .label {
                color: var(--maz-blue);
                font-size: 8px;
                font-weight: 600;
                letter-spacing: 0.18em;
                text-transform: uppercase;
            }

            .number {
                margin-top: 12px;
                color: var(--maz-blue);
                font-size: 9px;
                font-weight: 600;
            }

            .date {
                font-size: 9px;
                line-height: 1.8;
                text-align: right;
            }

            .address-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 32px;
                border-bottom: 1px solid var(--maz-border);
                padding: 32px 0;
            }

            .text-block {
                margin-top: 14px;
                font-size: 9px;
                line-height: 1.9;
            }

            .text-block p {
                margin: 0 0 4px;
            }

            .items {
                border-bottom: 1px solid var(--maz-border);
                padding: 32px 0;
            }

            .items-header,
            .item-row {
                display: grid;
                grid-template-columns: 1fr 57px 75px 75px;
                gap: 16px;
            }

            .items-header {
                border-bottom: 1px solid #edf0f3;
                padding-bottom: 14px;
                color: var(--maz-blue);
                font-size: 7px;
                font-weight: 600;
                letter-spacing: 0.16em;
                text-transform: uppercase;
            }

            .item-row {
                border-bottom: 1px solid #edf0f3;
                padding: 18px 0;
                font-size: 9px;
            }

            .item-row:last-child {
                border-bottom: 0;
            }

            .item-title {
                display: block;
                color: var(--maz-blue);
                font-weight: 600;
            }

            .discount-note {
                display: block;
                margin-top: 8px;
                color: #5c626d;
                font-size: 8px;
                line-height: 1.6;
            }

            .center {
                text-align: center;
            }

            .right {
                text-align: right;
            }

            .totals {
                width: 100%;
                margin-top: 30px;
                font-size: 10px;
            }

            .totals-row {
                display: flex;
                justify-content: space-between;
                gap: 24px;
                padding: 7px 0;
            }

            .discount {
                color: var(--maz-red);
            }

            .total-row {
                margin-top: 8px;
                border-top: 1px solid var(--maz-border);
                color: var(--maz-blue);
                font-size: 14px;
                font-weight: 600;
                padding-top: 18px;
            }

            .notes {
                margin-top: 30px;
                border-top: 1px solid var(--maz-border);
                padding-top: 22px;
            }

            .notes p {
                margin: 12px 0 0;
                font-size: 9px;
                line-height: 1.8;
            }

            @media print {
                @page {
                    size: A4;
                    margin: 12mm;
                }

                body {
                    background: #ffffff;
                }

                .toolbar {
                    display: none;
                }

                .invoice-shell {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                .invoice {
                    border: 0;
                    padding: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="toolbar">
            <button class="button" type="button" onclick="window.print()">Print invoice</button>
        </div>

        <main class="invoice-shell">
            <section class="invoice">
                <header class="invoice-header">
                    <div>
                        <div class="logo">MAZ</div>
                        <p class="kicker">Order invoice</p>
                        <p class="number">Order number: {{ $invoice['number'] }}</p>
                    </div>
                    <div class="date">
                        <p><strong style="color: var(--maz-blue);">Date:</strong> {{ $invoice['created_at'] }}</p>
                    </div>
                </header>

                <section class="address-grid">
                    <div>
                        <h2 class="label">Customer</h2>
                        <div class="text-block">
                            <p>{{ $invoice['customer']['name'] }}</p>
                            @if ($invoice['customer']['email'])
                                <p>{{ $invoice['customer']['email'] }}</p>
                            @endif
                            <p>{{ $invoice['customer']['phone'] }}</p>
                        </div>
                    </div>
                    <div>
                        <h2 class="label">Shipping</h2>
                        <div class="text-block">
                            @foreach ($invoice['shipping_address']['lines'] as $line)
                                <p>{{ $line }}</p>
                            @endforeach
                        </div>
                    </div>
                    <div>
                        <h2 class="label">Billing</h2>
                        <div class="text-block">
                            @if ($invoice['billing_same_as_shipping'])
                                <p>Same as shipping address</p>
                            @else
                                @foreach ($invoice['billing_address']['lines'] as $line)
                                    <p>{{ $line }}</p>
                                @endforeach
                            @endif
                        </div>
                    </div>
                </section>

                <section class="items">
                    <div class="items-header">
                        <span>Item</span>
                        <span class="center">Qty</span>
                        <span class="right">Unit</span>
                        <span class="right">Total</span>
                    </div>

                    @foreach ($invoice['items'] as $item)
                        <div class="item-row">
                            <span>
                                <span class="item-title">{{ $item['title'] }}</span>
                                @if ($item['discount_cents'] > 0)
                                    <span class="discount-note">
                                        Original: {{ $item['original_total'] }}<br>
                                        Discount: -{{ $item['discount'] }}
                                    </span>
                                @endif
                            </span>
                            <span class="center">Qty: {{ $item['quantity'] }}</span>
                            <span class="right">{{ $item['unit_price'] }}</span>
                            <span class="right"><strong>{{ $item['total'] }}</strong></span>
                        </div>
                    @endforeach
                </section>

                <section class="totals">
                    <div class="totals-row">
                        <span>Subtotal</span>
                        <span>{{ $invoice['subtotal'] }}</span>
                    </div>
                    @if ($invoice['discount_cents'] > 0)
                        <div class="totals-row discount">
                            <span>Bundle discount</span>
                            <span>-{{ $invoice['discount'] }}</span>
                        </div>
                    @endif
                    <div class="totals-row">
                        <span>Delivery ({{ $invoice['delivery_label'] }})</span>
                        <span>{{ $invoice['delivery'] }}</span>
                    </div>
                    <div class="totals-row">
                        <span>Payment</span>
                        <span>{{ $invoice['payment_label'] }}</span>
                    </div>
                    <div class="totals-row total-row">
                        <span>Total</span>
                        <span>{{ $invoice['total'] }}</span>
                    </div>
                </section>

                @if ($invoice['notes'])
                    <section class="notes">
                        <h2 class="label">Notes</h2>
                        <p>{{ $invoice['notes'] }}</p>
                    </section>
                @endif
            </section>
        </main>
    </body>
</html>

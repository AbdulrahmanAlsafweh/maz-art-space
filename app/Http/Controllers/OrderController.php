<?php

namespace App\Http\Controllers;

use App\Actions\Orders\CreateOrder;
use App\Http\Requests\StoreOrderRequest;
use App\Support\OrderInvoiceData;
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
            ->with('order', OrderInvoiceData::fromOrder($order));
    }
}

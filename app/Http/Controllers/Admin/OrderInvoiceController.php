<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\OrderInvoiceData;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class OrderInvoiceController extends Controller
{
    public function __invoke(Request $request, Order $order): View
    {
        abort_unless($request->user()?->is_admin, 403);

        return view('admin.orders.invoice', [
            'invoice' => OrderInvoiceData::fromOrder($order),
        ]);
    }
}

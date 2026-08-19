<?php

use App\Http\Controllers\Admin\OrderInvoiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PolicyPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/products/maz-watercolor-kit', function () {
    return Inertia::render('products/maz-watercolor-kit');
})->name('products.maz-watercolor-kit');

Route::get('/products/maz-watercolor-double-kit', function () {
    return Inertia::render('products/maz-watercolor-double-kit');
})->name('products.maz-watercolor-double-kit');

Route::get('/cart', function () {
    return Inertia::render('cart');
})->name('cart');

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::get('/policies/{slug}', PolicyPageController::class)->name('policies.show');

Route::get('/admin/orders/{order}/invoice', OrderInvoiceController::class)
    ->middleware('auth')
    ->name('admin.orders.invoice');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

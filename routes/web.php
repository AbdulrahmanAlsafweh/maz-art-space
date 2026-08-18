<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/products/maz-watercolor-kit', function () {
    return Inertia::render('products/maz-watercolor-kit');
})->name('products.maz-watercolor-kit');

Route::get('/cart', function () {
    return Inertia::render('cart');
})->name('cart');

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

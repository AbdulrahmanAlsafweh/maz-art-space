<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('status')->default('pending');
            $table->string('currency', 3)->default('USD');
            $table->unsignedInteger('subtotal_cents');
            $table->unsignedInteger('shipping_cents')->default(0);
            $table->string('delivery_zone', 40)->default('inside_tripoli');
            $table->unsignedInteger('total_cents');
            $table->string('payment_method')->default('cash_on_delivery');
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone');
            $table->string('shipping_full_name');
            $table->string('shipping_line_one');
            $table->string('shipping_line_two')->nullable();
            $table->string('shipping_city');
            $table->string('shipping_region');
            $table->string('shipping_postal_code')->nullable();
            $table->string('shipping_country');
            $table->boolean('billing_same_as_shipping')->default(true);
            $table->string('billing_full_name')->nullable();
            $table->string('billing_line_one')->nullable();
            $table->string('billing_line_two')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_region')->nullable();
            $table->string('billing_postal_code')->nullable();
            $table->string('billing_country')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('product_slug');
            $table->string('product_title');
            $table->unsignedInteger('unit_price_cents');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('total_cents');
            $table->timestamps();

            $table->index('product_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policy_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->string('slug', 80)->unique();
            $table->boolean('is_enabled')->default(true);
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->longText('content');
            $table->timestamps();
        });

        $now = now();

        DB::table('policy_pages')->insert([
            [
                'title' => 'Delivery Policy',
                'slug' => 'delivery-policy',
                'is_enabled' => true,
                'display_order' => 10,
                'content' => "We deliver MAZ orders across Lebanon.\n\nDelivery timing and cost are shown during checkout before the order is submitted. Orders are prepared after confirmation, and our team may contact you to verify the address or delivery details.\n\nPlease make sure the phone number and address are correct so the courier can reach you smoothly.",
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'is_enabled' => true,
                'display_order' => 20,
                'content' => "If there is an issue with your order, contact MAZ Art Space with your order number and photos of the product condition.\n\nRefunds or replacements are reviewed case by case. Items must be unused and kept in their original packaging unless the issue is caused by damage or a fulfillment mistake.\n\nDelivery fees may be excluded from refunds unless the return is caused by an error from our side.",
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'is_enabled' => true,
                'display_order' => 30,
                'content' => "We collect only the information needed to process and deliver your order, such as your name, phone number, address, email when provided, and order details.\n\nCustomer information is used for order confirmation, delivery, customer support, and store communication when needed.\n\nWe do not sell customer information. Access is limited to the people and services needed to complete your order.",
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Terms & Conditions',
                'slug' => 'terms-and-conditions',
                'is_enabled' => true,
                'display_order' => 40,
                'content' => "By placing an order through MAZ Art Space, you confirm that the information you submit is accurate and that you are available to receive the order.\n\nProduct images and colors are presented as accurately as possible, but small differences may appear depending on screen settings and production batches.\n\nMAZ Art Space may update product availability, pricing, delivery options, and these terms when needed.",
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('policy_pages');
    }
};

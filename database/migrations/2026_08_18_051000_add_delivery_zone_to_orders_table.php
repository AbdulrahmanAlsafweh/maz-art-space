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
        if (Schema::hasColumn('orders', 'delivery_zone')) {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_zone', 40)
                ->default('inside_tripoli')
                ->after('shipping_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('orders', 'delivery_zone')) {
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_zone');
        });
    }
};

<?php

use App\Models\DeliverySetting;
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
        Schema::table('delivery_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('delivery_settings', 'pricing_mode')) {
                $table->string('pricing_mode', 40)
                    ->default(DeliverySetting::PRICING_MODE_BY_ZONE)
                    ->after('id');
            }

            if (! Schema::hasColumn('delivery_settings', 'same_price_cents')) {
                $table->unsignedInteger('same_price_cents')
                    ->default(0)
                    ->after('pricing_mode');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_settings', function (Blueprint $table) {
            if (Schema::hasColumn('delivery_settings', 'same_price_cents')) {
                $table->dropColumn('same_price_cents');
            }

            if (Schema::hasColumn('delivery_settings', 'pricing_mode')) {
                $table->dropColumn('pricing_mode');
            }
        });
    }
};

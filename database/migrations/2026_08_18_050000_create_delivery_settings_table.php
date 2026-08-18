<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('inside_tripoli_cents')->default(0);
            $table->unsignedInteger('outside_tripoli_cents')->default(0);
            $table->timestamps();
        });

        DB::table('delivery_settings')->insert([
            'inside_tripoli_cents' => 0,
            'outside_tripoli_cents' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_settings');
    }
};

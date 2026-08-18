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
        Schema::create('announcement_bars', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_enabled')->default(true);
            $table->string('text_one', 160)->default('FREE DELIVERY OVER LEBANON');
            $table->string('text_two', 160)->nullable();
            $table->string('background_color', 20)->default('#123b6d');
            $table->string('text_color', 20)->default('#ffffff');
            $table->timestamps();
        });

        DB::table('announcement_bars')->insert([
            'is_enabled' => true,
            'text_one' => 'FREE DELIVERY OVER LEBANON',
            'text_two' => '12-COLOR WATERCOLOR KIT NOW AVAILABLE',
            'background_color' => '#123b6d',
            'text_color' => '#ffffff',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_bars');
    }
};

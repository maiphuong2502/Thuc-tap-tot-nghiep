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
        Schema::table('results', function (Blueprint $table) {
            $table->decimal('listening_band', 3, 1)->nullable()->after('skipped_count');
            $table->decimal('reading_band', 3, 1)->nullable()->after('listening_band');
            $table->decimal('writing_band', 3, 1)->nullable()->after('reading_band');
            $table->decimal('speaking_band', 3, 1)->nullable()->after('writing_band');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropColumn(['listening_band', 'reading_band', 'writing_band', 'speaking_band']);
        });
    }
};

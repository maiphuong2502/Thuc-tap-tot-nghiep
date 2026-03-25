<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->string('test_id', 10)->primary();
            $table->string('test_name', 255);
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
            // User requested created_at only, dropping updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};

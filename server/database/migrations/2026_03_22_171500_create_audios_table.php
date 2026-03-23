<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audios', function (Blueprint $table) {
            $table->string('audio_id', 10)->primary();
            $table->string('audio_file', 255);
            $table->text('transcript')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audios');
    }
};

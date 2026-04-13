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
        Schema::create('speaking_submissions', function (Blueprint $table) {
            $table->string('speaking_id')->primary();
            $table->string('user_id', 10)->collation('utf8mb4_0900_ai_ci');
            $table->string('question_id', 10)->collation('utf8mb4_unicode_ci');
            $table->string('audio_url');
            $table->decimal('score', 5, 2)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speaking_submissions');
    }
};

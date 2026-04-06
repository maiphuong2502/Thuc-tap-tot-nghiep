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
        Schema::create('tfng_questions', function (Blueprint $table) {
            $table->string('question_id', 10)->primary();
            $table->text('content');

            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tfng_questions');
    }
};

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
        Schema::create('fill_answers', function (Blueprint $table) {
            $table->string('answer_id', 10)->primary();
            $table->string('question_id', 10);
            $table->string('correct_answer', 255);
            
            $table->foreign('question_id')->references('question_id')->on('fill_questions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fill_answers');
    }
};

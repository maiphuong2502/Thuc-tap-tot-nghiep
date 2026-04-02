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
        Schema::create('matching_answers', function (Blueprint $table) {
            $table->string('answer_id', 10)->primary();
            $table->string('question_id', 10);
            $table->string('left_item', 255);
            $table->string('right_item', 255);
            
            $table->foreign('question_id')->references('question_id')->on('matching_questions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matching_answers');
    }
};


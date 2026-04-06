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
        Schema::create('tfng_answers', function (Blueprint $table) {
            $table->string('answer_id', 10)->primary();
            $table->string('question_id', 10);
            $table->enum('correct_answer', ['TRUE', 'FALSE', 'NOT GIVEN']);

            $table->foreign('question_id')->references('question_id')->on('tfng_questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tfng_answers');
    }
};

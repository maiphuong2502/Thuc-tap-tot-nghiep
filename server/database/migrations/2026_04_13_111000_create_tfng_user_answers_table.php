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
        Schema::create('tfng_user_answers', function (Blueprint $table) {
            $table->string('tuw_id', 10)->primary();
            $table->string('result_id', 10);
            $table->string('question_id', 10);
            $table->enum('user_answer', ['TRUE', 'FALSE', 'NOT GIVEN'])->nullable();
            $table->boolean('is_correct');
            $table->timestamps();

            $table->foreign('result_id')->references('result_id')->on('results');
            $table->foreign('question_id')->references('question_id')->on('questions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tfng_user_answers');
    }
};

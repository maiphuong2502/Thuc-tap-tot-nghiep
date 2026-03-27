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
        Schema::create('questions', function (Blueprint $table) {
            $table->string('question_id', 10)->primary();
            $table->string('group_id', 10);
            $table->string('skill_id', 10);
            $table->enum('question_type', ['DROPDOWN', 'matching', 'FILL', 'MCQ']);
            $table->integer('order_index');
            $table->timestamps();

            $table->foreign('group_id')->references('group_id')->on('question_groups');
            $table->foreign('skill_id')->references('id')->on('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};

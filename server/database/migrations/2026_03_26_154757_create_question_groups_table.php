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
        Schema::create('question_groups', function (Blueprint $table) {
            $table->string('group_id', 10)->primary();
            $table->string('skill_id', 10);
            $table->string('title', 255);
            $table->string('passage_id', 10)->nullable();
            $table->string('audio_id', 10)->nullable();
            $table->string('type', 50);
            
            $table->foreign('skill_id')->references('id')->on('skills');
            $table->foreign('passage_id')->references('passage_id')->on('passages');
            $table->foreign('audio_id')->references('audio_id')->on('audios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_groups');
    }
};

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
        Schema::create('test_parts', function (Blueprint $table) {
            $table->string('part_id', 10)->primary();
            $table->string('test_id', 10);
            $table->string('skill_id', 10);
            $table->string('part_name', 255);
            $table->integer('order_index');
            
            $table->foreign('test_id')->references('test_id')->on('tests')->onDelete('cascade');
            $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_parts');
    }
};

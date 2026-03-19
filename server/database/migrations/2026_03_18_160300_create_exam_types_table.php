<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_type', function (Blueprint $table) {
            $table->integer('category_id', true); // INT AUTO_INCREMENT PRIMARY KEY
            $table->string('category_name', 100)->nullable();
            $table->string('description', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_type');
    }
};

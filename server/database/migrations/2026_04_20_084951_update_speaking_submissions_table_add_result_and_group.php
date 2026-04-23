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
        Schema::table('speaking_submissions', function (Blueprint $table) {
            $table->string('result_id')->after('user_id');
            $table->string('group_id')->after('result_id');
            
            // Phải drop foreign key trước khi sửa cột
            $table->dropForeign(['question_id']);
            $table->string('question_id')->nullable()->change();
            
            // Add lại foreign key
            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
            
            $table->foreign('result_id')->references('result_id')->on('results')->onDelete('cascade');
            $table->foreign('group_id')->references('group_id')->on('question_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('speaking_submissions', function (Blueprint $table) {
            $table->dropForeign(['result_id']);
            $table->dropForeign(['group_id']);
            $table->dropColumn(['result_id', 'group_id']);
            
            $table->dropForeign(['question_id']);
            $table->string('question_id')->nullable(false)->change();
            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
        });
    }
};

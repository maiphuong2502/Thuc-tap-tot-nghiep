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
        Schema::table('writing_submissions', function (Blueprint $table) {
            // First, drop the foreign key to make question_id modification safe
            $table->dropForeign(['question_id']);
            
            // Make question_id nullable
            $table->string('question_id', 10)->nullable()->change();
            
            // Add group_id column
            $table->string('group_id', 10)->nullable()->after('question_id');
            
            // Add new foreign keys
            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
            $table->foreign('group_id')->references('group_id')->on('question_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('writing_submissions', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropForeign(['question_id']);
            
            $table->dropColumn('group_id');
            $table->string('question_id', 10)->nullable(false)->change();
            
            $table->foreign('question_id')->references('question_id')->on('questions')->onDelete('cascade');
        });
    }
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatchingQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('matching_questions')->insert([
            ['question_id' => 'QS03', 'content' => 'Match the places with their descriptions.'],
        ]);
    }
}

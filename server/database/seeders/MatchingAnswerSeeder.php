<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatchingAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('matching_answers')->insert([
            ['answer_id' => 'MA01', 'question_id' => 'QS03', 'left_item' => 'Library', 'right_item' => 'Place to read books'],
            ['answer_id' => 'MA02', 'question_id' => 'QS03', 'left_item' => 'Restaurant', 'right_item' => 'Place to eat food'],
            ['answer_id' => 'MA03', 'question_id' => 'QS03', 'left_item' => 'School', 'right_item' => 'Place to study'],
            ['answer_id' => 'MA04', 'question_id' => 'QS03', 'left_item' => 'Hospital', 'right_item' => 'Place for medical care'],
        ]);
    }
}

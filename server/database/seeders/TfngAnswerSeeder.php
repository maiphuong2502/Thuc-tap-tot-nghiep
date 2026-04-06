<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TfngAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tfng_answers')->insert([
            ['answer_id' => 'TF01', 'question_id' => 'QS07', 'correct_answer' => 'TRUE'],
            ['answer_id' => 'TF02', 'question_id' => 'QS07', 'correct_answer' => 'FALSE'],
            ['answer_id' => 'TF03', 'question_id' => 'QS07', 'correct_answer' => 'NOT GIVEN'],
            ['answer_id' => 'TF04', 'question_id' => 'QS08', 'correct_answer' => 'TRUE'],
            ['answer_id' => 'TF05', 'question_id' => 'QS08', 'correct_answer' => 'FALSE'],
            ['answer_id' => 'TF06', 'question_id' => 'QS08', 'correct_answer' => 'NOT GIVEN'],
        ]);
    }
}

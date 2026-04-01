<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FillAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $answers = [
            ['answer_id' => 'FA01', 'question_id' => 'QS02', 'correct_answer' => '9:00'],
            ['answer_id' => 'FA02', 'question_id' => 'QS02', 'correct_answer' => '9 AM'],
            ['answer_id' => 'FA03', 'question_id' => 'QS02', 'correct_answer' => '9am'],
            ['answer_id' => 'FA04', 'question_id' => 'QS02', 'correct_answer' => '09:00'],
            ['answer_id' => 'FA05', 'question_id' => 'QS02', 'correct_answer' => 'nine'],
            ['answer_id' => 'FA06', 'question_id' => 'QS02', 'correct_answer' => 'nine o clock'],
            ['answer_id' => 'FA07', 'question_id' => 'QS02', 'correct_answer' => 'nine o’clock'],
        ];

        foreach ($answers as $answer) {
            \App\Models\FillAnswer::create($answer);
        }
    }
}

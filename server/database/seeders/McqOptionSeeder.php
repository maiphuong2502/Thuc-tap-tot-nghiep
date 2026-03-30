<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class McqOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            // QS01
            ['option_id' => 'MCQ01', 'question_id' => 'QS01', 'content' => 'To book a hotel room', 'is_correct' => false],
            ['option_id' => 'MCQ02', 'question_id' => 'QS01', 'content' => 'To ask for directions', 'is_correct' => false],
            ['option_id' => 'MCQ03', 'question_id' => 'QS01', 'content' => 'To make a complaint', 'is_correct' => true],
            ['option_id' => 'MCQ04', 'question_id' => 'QS01', 'content' => 'To order food', 'is_correct' => false],
            ['option_id' => 'MCQ05', 'question_id' => 'QS01', 'content' => 'To schedule a meeting', 'is_correct' => false],

            // QS05
            ['option_id' => 'MCQ06', 'question_id' => 'QS05', 'content' => 'The benefits of technology in education', 'is_correct' => true],
            ['option_id' => 'MCQ07', 'question_id' => 'QS05', 'content' => 'The history of transportation', 'is_correct' => false],
            ['option_id' => 'MCQ08', 'question_id' => 'QS05', 'content' => 'The importance of exercise', 'is_correct' => false],
            ['option_id' => 'MCQ09', 'question_id' => 'QS05', 'content' => 'The effects of climate change', 'is_correct' => false],
            ['option_id' => 'MCQ10', 'question_id' => 'QS05', 'content' => 'The role of government in economy', 'is_correct' => false],
        ];

        foreach ($options as $option) {
            \App\Models\McqOption::updateOrCreate(
                ['option_id' => $option['option_id']],
                $option
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\DropdownQuestion;
use App\Models\Question;
use Illuminate\Database\Seeder;

class DropdownQuestionSeeder extends Seeder
{
    /**
     * Sample rows for dropdown_questions (requires matching questions.question_id + DROPDOWN).
     */
    public function run(): void
    {
        // QS04 exists in QuestionSeeder (DROPDOWN). QS06 is added here so sample INSERTs match your spec.
        Question::firstOrCreate(
            ['question_id' => 'QS06'],
            [
                'group_id' => 'QG03',
                'skill_id' => 'SK01',
                'question_type' => 'DROPDOWN',
                'order_index' => 6,
            ]
        );

        $rows = [
            [
                'question_id' => 'QS06',
                'content' => 'Choose the correct word: The lecture ______ at 9 a.m.',
            ],
            [
                'question_id' => 'QS04',
                'content' => 'Choose the correct word: She ______ to school every day.',
            ],
        ];

        foreach ($rows as $row) {
            DropdownQuestion::updateOrCreate(
                ['question_id' => $row['question_id']],
                ['content' => $row['content']]
            );
        }
    }
}

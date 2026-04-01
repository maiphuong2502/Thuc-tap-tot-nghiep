<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FillQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            ['question_id' => 'QS02', 'content' => 'Complete the sentence: The meeting will start at ______ in the morning.']
        ];

        foreach ($questions as $q) {
            \App\Models\FillQuestion::updateOrCreate(
                ['question_id' => $q['question_id']],
                $q
            );
        }
    }
}

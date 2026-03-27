<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('skills')->insertOrIgnore([
            ['id' => 'SK01', 'skill_name' => 'Reading'],
            ['id' => 'SK02', 'skill_name' => 'Listening'],
        ]);

        DB::table('question_groups')->insertOrIgnore([
            ['group_id' => 'QG01', 'skill_id' => 'SK01', 'title' => 'Group 1', 'type' => 'Reading'],
            ['group_id' => 'QG02', 'skill_id' => 'SK01', 'title' => 'Group 2', 'type' => 'Reading'],
            ['group_id' => 'QG03', 'skill_id' => 'SK01', 'title' => 'Group 3', 'type' => 'Reading'],
            ['group_id' => 'QG04', 'skill_id' => 'SK02', 'title' => 'Group 4', 'type' => 'Listening'],
        ]);

        $questions = [
            ['question_id' => 'QS01', 'group_id' => 'QG01', 'skill_id' => 'SK01', 'question_type' => 'MCQ', 'order_index' => 1],
            ['question_id' => 'QS02', 'group_id' => 'QG01', 'skill_id' => 'SK01', 'question_type' => 'FILL', 'order_index' => 2],
            ['question_id' => 'QS03', 'group_id' => 'QG02', 'skill_id' => 'SK01', 'question_type' => 'matching', 'order_index' => 3],
            ['question_id' => 'QS04', 'group_id' => 'QG03', 'skill_id' => 'SK01', 'question_type' => 'DROPDOWN', 'order_index' => 4],
            ['question_id' => 'QS05', 'group_id' => 'QG04', 'skill_id' => 'SK02', 'question_type' => 'MCQ', 'order_index' => 5],
        ];

        // Ensure we handle constraints; insert via Model or DB logic
        foreach ($questions as $q) {
            Question::firstOrCreate(['question_id' => $q['question_id']], $q);
        }
    }
}

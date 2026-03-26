<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questionGroups = [
            [
                'group_id' => 'QR01',
                'skill_id' => 'SK02',
                'title' => 'Reading Passage 1',
                'passage_id' => 'PA01',
                'audio_id' => null,
                'type' => 'reading_passage',
            ],
            [
                'group_id' => 'QR02',
                'skill_id' => 'SK02',
                'title' => 'Table Completion Passage 2',
                'passage_id' => 'PA02',
                'audio_id' => null,
                'type' => 'table_completion',
            ],
        ];

        foreach ($questionGroups as $group) {
            DB::table('question_groups')->updateOrInsert(
                ['group_id' => $group['group_id']],
                $group
            );
        }
    }
}

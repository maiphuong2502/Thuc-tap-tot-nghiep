<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DropdownOptionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('dropdown_options')->insert([
            // QS06
            ['option_id' => 'DO01', 'question_id' => 'QS06', 'content' => 'start', 'is_correct' => false],
            ['option_id' => 'DO02', 'question_id' => 'QS06', 'content' => 'starts', 'is_correct' => true],
            ['option_id' => 'DO03', 'question_id' => 'QS06', 'content' => 'starting', 'is_correct' => false],
            ['option_id' => 'DO04', 'question_id' => 'QS06', 'content' => 'started', 'is_correct' => false],
            ['option_id' => 'DO05', 'question_id' => 'QS06', 'content' => 'to start', 'is_correct' => false],
            
            // QS04
            ['option_id' => 'DO06', 'question_id' => 'QS04', 'content' => 'go', 'is_correct' => false],
            ['option_id' => 'DO07', 'question_id' => 'QS04', 'content' => 'goes', 'is_correct' => true],
            ['option_id' => 'DO08', 'question_id' => 'QS04', 'content' => 'going', 'is_correct' => false],
            ['option_id' => 'DO09', 'question_id' => 'QS04', 'content' => 'gone', 'is_correct' => false],
            ['option_id' => 'DO10', 'question_id' => 'QS04', 'content' => 'went', 'is_correct' => false],
        ]);
    }
}

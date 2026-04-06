<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TfngQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tfng_questions')->insert([
            ['question_id' => 'QS07', 'content' => 'The Earth revolves around the Sun.'],
            ['question_id' => 'QS08', 'content' => 'Water boils at 50 degrees Celsius.'],
        ]);
    }
}

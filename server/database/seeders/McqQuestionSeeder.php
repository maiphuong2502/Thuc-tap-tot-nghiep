<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class McqQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = \Carbon\Carbon::now();
        
        \Illuminate\Support\Facades\DB::table('mcq_questions')->insert([
            [
                'question_id' => 'QS01',
                'content' => 'What is the main purpose of listening in this conversation?',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'question_id' => 'QS05',
                'content' => 'What is the main idea of the reading passage?',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ]);
    }
}

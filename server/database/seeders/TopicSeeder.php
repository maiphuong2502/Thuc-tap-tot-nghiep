<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            ['topic_name' => 'Education'],
            ['topic_name' => 'Environment'],
            ['topic_name' => 'Technology'],
            ['topic_name' => 'Health'],
            ['topic_name' => 'Travel'],
            ['topic_name' => 'Work'],
            ['topic_name' => 'Culture'],
            ['topic_name' => 'Science'],
            ['topic_name' => 'Food'],
            ['topic_name' => 'Sports'],
        ];

        DB::table('topics')->insert($topics);
    }
}

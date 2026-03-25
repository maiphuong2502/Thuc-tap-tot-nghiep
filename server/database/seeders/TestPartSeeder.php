<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('test_parts')->insert([
            ['part_id' => 'PT01', 'test_id' => 'TE01', 'skill_id' => 'SK01', 'part_name' => 'Listening Part 1', 'order_index' => 1],
            ['part_id' => 'PT02', 'test_id' => 'TE01', 'skill_id' => 'SK01', 'part_name' => 'Listening Part 2', 'order_index' => 2],
            ['part_id' => 'PT03', 'test_id' => 'TE01', 'skill_id' => 'SK03', 'part_name' => 'Writing Task 1', 'order_index' => 3],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tests')->insert([
            ['test_id' => 'TE01', 'test_name' => 'IELTS Test 1', 'description' => null, 'created_at' => Carbon::now()],
            ['test_id' => 'TE02', 'test_name' => 'IELTS Test 2', 'description' => null, 'created_at' => Carbon::now()],
            ['test_id' => 'TE03', 'test_name' => 'IELTS Test 3', 'description' => null, 'created_at' => Carbon::now()],
            ['test_id' => 'TE04', 'test_name' => 'IELTS Test 4', 'description' => null, 'created_at' => Carbon::now()],
            ['test_id' => 'TE05', 'test_name' => 'IELTS Test 5', 'description' => null, 'created_at' => Carbon::now()],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamTypeSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['category_name' => 'Academic', 'description' => 'Đề thi học thuật dành cho du học hoặc môi trường học tập'],
            ['category_name' => 'General Training', 'description' => 'Đề thi tổng quát dùng cho định cư hoặc làm việc'],
            ['category_name' => 'Mini Test', 'description' => 'Bài kiểm tra ngắn để luyện tập nhanh'],
            ['category_name' => 'Full Test', 'description' => 'Bài thi đầy đủ 4 kỹ năng như kỳ thi thật'],
            ['category_name' => 'Listening Test', 'description' => 'Đề thi tập trung vào kỹ năng nghe'],
            ['category_name' => 'Reading Test', 'description' => 'Đề thi tập trung vào kỹ năng đọc'],
            ['category_name' => 'Writing Task 1', 'description' => 'Bài viết dạng mô tả biểu đồ hoặc dữ liệu'],
            ['category_name' => 'Writing Task 2', 'description' => 'Bài viết dạng luận văn, nêu quan điểm'],
            ['category_name' => 'Speaking Practice', 'description' => 'Bài luyện nói theo chủ đề'],
            ['category_name' => 'Mock Test', 'description' => 'Đề thi thử mô phỏng kỳ thi thật'],
        ];

        DB::table('exam_type')->insert($data);
    }
}

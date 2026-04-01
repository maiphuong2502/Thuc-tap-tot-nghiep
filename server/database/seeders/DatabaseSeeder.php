<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            TopicSeeder::class,
            SkillSeeder::class,
            PassageSeeder::class,
            AudioSeeder::class,
            TestSeeder::class,
            TestPartSeeder::class,
            QuestionGroupSeeder::class,
            QuestionSeeder::class,
            DropdownQuestionSeeder::class,
            FillAnswerSeeder::class,
            MatchingQuestionSeeder::class,
            TfngQuestionSeeder::class,
            TfngAnswerSeeder::class,
        ]);
    }
}

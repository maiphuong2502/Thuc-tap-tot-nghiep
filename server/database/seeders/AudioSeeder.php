<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Audio;
use Illuminate\Support\Facades\Storage;

class AudioSeeder extends Seeder
{
    public function run(): void
    {
        $files = Storage::disk('public')->files('listening');

        foreach ($files as $file) {
            // Check if it's an audio file
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            if (in_array(strtolower($ext), ['mp3', 'wav', 'm4a', 'mp4'])) {
                Audio::create([
                    'audio_file' => '/storage/' . $file,
                    'transcript' => 'Transcript for ' . basename($file)
                ]);
            }
        }
    }
}

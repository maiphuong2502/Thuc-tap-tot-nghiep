<?php

namespace App\Repositories;

use App\Models\Audio;

class AudioRepository extends BaseRepository implements AudioRepositoryInterface
{
    public function getModel()
    {
        return Audio::class;
    }

    public function getAudiosOrderedById($search = null)
    {
        $query = $this->model->orderBy('audio_id');
        
        if ($search) {
            $query->where('audio_file', 'LIKE', '%' . $search . '%')
                  ->orWhere('transcript', 'LIKE', '%' . $search . '%');
        }

        return $query->get(['audio_id', 'audio_file', 'transcript']);
    }
}

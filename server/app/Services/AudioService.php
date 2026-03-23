<?php

namespace App\Services;

use App\Repositories\AudioRepositoryInterface;

class AudioService extends BaseService implements AudioServiceInterface
{
    public function getRepository()
    {
        return AudioRepositoryInterface::class;
    }

    public function getAudiosList($search = null)
    {
        return $this->repository->getAudiosOrderedById($search);
    }
}

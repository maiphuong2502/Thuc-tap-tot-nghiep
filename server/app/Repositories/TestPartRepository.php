<?php

namespace App\Repositories;

use App\Models\TestPart;

class TestPartRepository extends BaseRepository implements TestPartRepositoryInterface
{
    /**
     * Return model class name for BaseRepository.
     */
    public function getModel()
    {
        return TestPart::class;
    }
}

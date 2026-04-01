<?php

namespace App\Repositories;

use App\Models\DropdownOption;

class DropdownOptionRepository extends BaseRepository implements DropdownOptionRepositoryInterface
{
    public function getModel()
    {
        return DropdownOption::class;
    }

    public function generateOptionId()
    {
        $lastOption = $this->model->orderBy('option_id', 'desc')->first();
        if (!$lastOption) {
            return 'DO01';
        }

        $lastId = $lastOption->option_id;
        $number = (int) substr($lastId, 2);
        return 'DO' . str_pad($number + 1, 2, '0', STR_PAD_LEFT);
    }
}

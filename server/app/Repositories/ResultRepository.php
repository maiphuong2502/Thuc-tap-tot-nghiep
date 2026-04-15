<?php

namespace App\Repositories;

use App\Models\Result;

class ResultRepository extends BaseRepository implements ResultRepositoryInterface
{
    public function getModel()
    {
        return Result::class;
    }

    public function getPaginated(int $perPage, array $filters = [])
    {
        $query = $this->model->newQuery();

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['test_id'])) {
            $query->where('test_id', $filters['test_id']);
        }

        return $query->with(['user', 'test'])
                     ->orderBy('created_at', 'desc')
                     ->paginate($perPage);
    }

    public function getByUserId(string $userId)
    {
        return $this->model->where('user_id', $userId)
                           ->with(['test'])
                           ->orderBy('created_at', 'desc')
                           ->get();
    }
}

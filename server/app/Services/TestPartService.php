<?php

namespace App\Services;

use App\Models\TestPart;
use App\Repositories\TestPartRepositoryInterface;
use Illuminate\Support\Facades\Log;

class TestPartService extends BaseService implements TestPartServiceInterface
{
    /**
     * Get repository
     * @return string
     */
    public function getRepository()
    {
        return TestPartRepositoryInterface::class;
    }

    public function getTestParts(array $filters = [], int $perPage = 10)
    {
        try {
            $query = TestPart::query();
            $query->with(['test', 'skill']);

            if (!empty($filters['search'])) {
                $query->where('part_name', 'like', '%' . $filters['search'] . '%');
            }

            if (!empty($filters['test_id'])) {
                $query->where('test_id', $filters['test_id']);
            }

            if (!empty($filters['skill_id'])) {
                $query->where('skill_id', $filters['skill_id']);
            }

            $query->orderBy('order_index', 'asc');

            if ($perPage > 0) {
                return $query->paginate($perPage);
            }
            return $query->get();
            
        } catch (\Exception $e) {
            Log::error('Error in TestPartService@getTestParts: ' . $e->getMessage());
            throw $e;
        }
    }
    
    public function deleteTestPart(string $id)
    {
        try {
            $testPart = $this->repository->find($id);
            if (!$testPart) {
                throw new \Exception("Test part not found", 404);
            }
            
            // NOTE: Add constraint checks here, such as if test_part_question exists
            return $this->repository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error in TestPartService@deleteTestPart: ' . $e->getMessage());
            throw $e;
        }
    }
}

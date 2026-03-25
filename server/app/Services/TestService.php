<?php

namespace App\Services;

use App\Repositories\TestRepositoryInterface;

class TestService implements TestServiceInterface {
    protected $testRepo;

    public function __construct(TestRepositoryInterface $testRepo) {
        $this->testRepo = $testRepo;
    }

    public function getAllTests($keyword = null) {
        return $this->testRepo->getAll($keyword);
    }

    public function createTest(array $data) {
        if (empty($data['test_name'])) {
            throw new \Exception('test_name is required');
        }
        return $this->testRepo->create($data);
    }

    public function updateTest($id, array $data) {
        if (empty($data['test_name'])) {
            throw new \Exception('test_name is required');
        }
        return $this->testRepo->update($id, $data);
    }

    public function deleteTest($id) {
        return $this->testRepo->delete($id);
    }
}

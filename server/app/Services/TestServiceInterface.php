<?php

namespace App\Services;

interface TestServiceInterface {
    public function getAllTests($keyword = null);
    public function createTest(array $data);
    public function updateTest($id, array $data);
    public function deleteTest($id);
}

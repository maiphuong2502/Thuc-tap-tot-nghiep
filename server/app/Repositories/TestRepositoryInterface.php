<?php

namespace App\Repositories;

interface TestRepositoryInterface {
    public function getAll($keyword = null);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

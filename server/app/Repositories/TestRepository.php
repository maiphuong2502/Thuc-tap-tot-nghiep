<?php

namespace App\Repositories;

use App\Models\Test;

class TestRepository implements TestRepositoryInterface {
    public function getAll($keyword = null) {
        $query = Test::query();
        if ($keyword) {
            $query->where('test_name', 'like', '%' . $keyword . '%')
                  ->orWhere('description', 'like', '%' . $keyword . '%');
        }
        return $query->orderBy('created_at', 'desc')->get();
    }

    public function create(array $data) {
        return Test::create($data);
    }

    public function update($id, array $data) {
        $test = Test::findOrFail($id);
        $test->update($data);
        return $test;
    }

    public function delete($id) {
        $test = Test::findOrFail($id);
        return $test->delete();
    }
}

<?php

namespace App\Services;

interface SpeakingSubmissionServiceInterface
{
    public function getList(int $perPage, array $filters = []);
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

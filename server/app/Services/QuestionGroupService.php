<?php

namespace App\Services;

use App\Repositories\QuestionGroupRepositoryInterface;

class QuestionGroupService extends BaseService implements QuestionGroupServiceInterface
{
    public function __construct(QuestionGroupRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function getRepository()
    {
        return \App\Repositories\QuestionGroupRepositoryInterface::class;
    }

    public function getQuestionGroups(array $filters = [], int $perPage = 10)
    {
        try {
            $query = \App\Models\QuestionGroup::query();
            $query->with(['skill', 'passage', 'audio', 'part.test']);

            if (!empty($filters['search'])) {
                $query->where('title', 'like', '%' . $filters['search'] . '%');
            }

            if (!empty($filters['skill_id'])) {
                $query->where('skill_id', $filters['skill_id']);
            }
            if (!empty($filters['part_id'])) {
                $query->where('part_id', $filters['part_id']);
            }

            $query->orderBy('group_id', 'asc');

            if ($perPage > 0) {
                return $query->paginate($perPage);
            }
            return $query->get();
            
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in QuestionGroupService@getQuestionGroups: ' . $e->getMessage());
            throw $e;
        }
    }
}

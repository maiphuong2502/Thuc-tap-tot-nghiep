<?php

namespace App\Services;

use App\Repositories\BaseRepositoryInterface;

abstract class BaseService implements BaseServiceInterface
{
    /**
     * @var BaseRepositoryInterface
     */
    protected $repository;

    /**
     * BaseService constructor.
     */
    public function __construct()
    {
        $this->setRepository();
    }

    /**
     * Get repository class defined in child class
     * @return string
     */
    abstract public function getRepository();

    /**
     * Set repository object
     */
    public function setRepository()
    {
        $this->repository = app()->make(
            $this->getRepository()
        );
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function find($id)
    {
        return $this->repository->find($id);
    }

    public function create(array $attributes)
    {
        return $this->repository->create($attributes);
    }

    public function update($id, array $attributes)
    {
        return $this->repository->update($id, $attributes);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}

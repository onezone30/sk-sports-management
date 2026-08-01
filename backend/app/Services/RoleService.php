<?php

namespace App\Services;

use App\Exceptions\RoleInUseException;
use App\Models\Role;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RoleService
{
    public function __construct(private readonly RoleRepositoryInterface $roleRepo) {}

    public function getAll(int $perPage = 25): LengthAwarePaginator
    {
        return $this->roleRepo->findAll($perPage);
    }

    public function create(array $data): Role
    {
        return $this->roleRepo->create($data);
    }

    public function update(Role $role, array $data): Role
    {
        return $this->roleRepo->update($role->id, $data);
    }

    public function delete(Role $role): void
    {
        if ($role->users()->exists()) {
            throw new RoleInUseException($role->id);
        }

        $this->roleRepo->delete($role->id);
    }
}

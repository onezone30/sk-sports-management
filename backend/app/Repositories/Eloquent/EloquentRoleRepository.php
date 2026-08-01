<?php

namespace App\Repositories\Eloquent;

use App\Models\Role;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator
    {
        return Role::paginate($perPage);
    }

    public function findById(int $id): ?Role
    {
        return Role::find($id);
    }

    public function create(array $data): Role
    {
        // refresh() so DB column defaults (e.g. status) are reflected on the
        // returned model even when the caller didn't pass them explicitly.
        return Role::create($data)->refresh();
    }

    public function update(int $id, array $data): Role
    {
        $role = Role::findOrFail($id);
        $role->update($data);

        return $role;
    }

    public function delete(int $id): void
    {
        Role::findOrFail($id)->delete();
    }
}

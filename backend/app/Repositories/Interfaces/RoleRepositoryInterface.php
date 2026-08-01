<?php

namespace App\Repositories\Interfaces;

use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator;

    public function findById(int $id): ?Role;

    public function create(array $data): Role;

    public function update(int $id, array $data): Role;

    public function delete(int $id): void;
}

<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator
    {
        return User::with('role')->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::with('role')->find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user->load('role');
    }

    public function delete(int $id): void
    {
        User::findOrFail($id)->delete();
    }
}

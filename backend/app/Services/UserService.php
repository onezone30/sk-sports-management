<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(private readonly UserRepositoryInterface $userRepo) {}

    public function getAll(int $perPage = 25): LengthAwarePaginator
    {
        return $this->userRepo->findAll($perPage);
    }

    public function create(array $data): User
    {
        // Password hashing is handled by the `hashed` cast on User::casts().
        return $this->userRepo->create($data);
    }

    public function update(User $user, array $data): User
    {
        return $this->userRepo->update($user->id, $data);
    }

    public function delete(User $user): void
    {
        $this->userRepo->delete($user->id);
    }
}

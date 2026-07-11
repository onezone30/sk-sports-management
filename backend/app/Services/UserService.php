<?php

namespace App\Services;

use App\Exceptions\UserNotFoundException;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(private readonly UserRepositoryInterface $userRepo) {}

    public function getAll(int $perPage = 25): LengthAwarePaginator
    {
        return $this->userRepo->findAll($perPage);
    }

    public function findById(int $id): User
    {
        $user = $this->userRepo->findById($id);

        if (!$user) {
            throw new UserNotFoundException($id);
        }

        return $user;
    }

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return $this->userRepo->create($data);
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userRepo->update($user->id, $data);
    }

    public function delete(User $user): void
    {
        $this->userRepo->delete($user->id);
    }
}

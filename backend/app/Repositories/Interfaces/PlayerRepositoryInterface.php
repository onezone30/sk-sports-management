<?php

namespace App\Repositories\Interfaces;

use App\Models\Player;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PlayerRepositoryInterface
{
    public function findAll(int $perPage = 25, ?string $search = null): LengthAwarePaginator;

    public function findById(int $id): ?Player;

    public function create(array $data): Player;

    public function update(int $id, array $data): Player;

    public function delete(int $id): void;

    /** True if the player has recorded stats or roster history — used to block deletion. */
    public function hasDependents(int $id): bool;
}

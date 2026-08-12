<?php

namespace App\Repositories\Eloquent;

use App\Models\Player;
use App\Repositories\Interfaces\PlayerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentPlayerRepository implements PlayerRepositoryInterface
{
    public function findAll(int $perPage = 25, ?string $search = null): LengthAwarePaginator
    {
        return Player::query()
            ->when($search, fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            }))
            ->orderBy('last_name')
            ->paginate($perPage);
    }

    public function findById(int $id): ?Player
    {
        return Player::find($id);
    }

    public function create(array $data): Player
    {
        // refresh() so DB column defaults (e.g. status) are reflected on the
        // returned model even when the caller didn't pass them explicitly.
        return Player::create($data)->refresh();
    }

    public function update(int $id, array $data): Player
    {
        $player = Player::findOrFail($id);
        $player->update($data);

        return $player;
    }

    public function delete(int $id): void
    {
        Player::findOrFail($id)->delete();
    }

    public function hasDependents(int $id): bool
    {
        $player = Player::findOrFail($id);

        return $player->playerStats()->exists() || $player->teamPlayers()->exists();
    }
}

<?php

namespace App\Services;

use App\Exceptions\PlayerInUseException;
use App\Models\Player;
use App\Repositories\Interfaces\PlayerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PlayerService
{
    public function __construct(private readonly PlayerRepositoryInterface $playerRepo) {}

    public function getAll(int $perPage = 25, ?string $search = null): LengthAwarePaginator
    {
        return $this->playerRepo->findAll($perPage, $search);
    }

    public function create(array $data): Player
    {
        return $this->playerRepo->create($data);
    }

    public function update(Player $player, array $data): Player
    {
        return $this->playerRepo->update($player->id, $data);
    }

    public function delete(Player $player): void
    {
        if ($this->playerRepo->hasDependents($player->id)) {
            throw new PlayerInUseException($player->id);
        }

        $this->playerRepo->delete($player->id);
    }
}

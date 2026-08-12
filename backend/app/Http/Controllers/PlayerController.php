<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlayerRequest;
use App\Http\Requests\UpdatePlayerRequest;
use App\Http\Resources\PlayerResource;
use App\Models\Player;
use App\Services\PlayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlayerController extends Controller
{
    public function __construct(private readonly PlayerService $playerService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return PlayerResource::collection(
            $this->playerService->getAll(
                perPage: (int) $request->query('per_page', 25),
                search: $request->query('search'),
            )
        );
    }

    public function store(StorePlayerRequest $request): JsonResponse
    {
        $player = $this->playerService->create($request->validated());

        return (new PlayerResource($player))->response()->setStatusCode(201);
    }

    public function show(Player $player): PlayerResource
    {
        return new PlayerResource($player);
    }

    public function update(UpdatePlayerRequest $request, Player $player): PlayerResource
    {
        return new PlayerResource($this->playerService->update($player, $request->validated()));
    }

    public function destroy(Player $player): JsonResponse
    {
        $this->playerService->delete($player);

        return response()->json(['message' => 'Player deleted successfully']);
    }
}

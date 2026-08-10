<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVenueRequest;
use App\Http\Requests\UpdateVenueRequest;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use App\Services\VenueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VenueController extends Controller
{
    public function __construct(private readonly VenueService $venueService) {}

    public function index(): AnonymousResourceCollection
    {
        return VenueResource::collection($this->venueService->getAll());
    }

    public function store(StoreVenueRequest $request): JsonResponse
    {
        $venue = $this->venueService->create(
            $request->safe()->except('images'),
            $request->file('images', []),
            $request->user()->id,
        );

        return (new VenueResource($venue))->response()->setStatusCode(201);
    }

    public function show(Venue $venue): VenueResource
    {
        return new VenueResource($venue->loadMissing('images'));
    }

    public function update(UpdateVenueRequest $request, Venue $venue): VenueResource
    {
        return new VenueResource($this->venueService->update($venue, $request->validated()));
    }

    public function destroy(Venue $venue): JsonResponse
    {
        $this->venueService->delete($venue);

        return response()->json(['message' => 'Venue deleted successfully']);
    }
}

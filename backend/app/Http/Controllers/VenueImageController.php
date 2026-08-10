<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVenueImageRequest;
use App\Http\Resources\VenueImageResource;
use App\Models\Venue;
use App\Services\VenueService;
use Illuminate\Http\JsonResponse;

class VenueImageController extends Controller
{
    public function __construct(private readonly VenueService $venueService) {}

    public function store(StoreVenueImageRequest $request, Venue $venue): JsonResponse
    {
        $image = $this->venueService->addImage($venue, $request->file('image'), $request->user()->id);

        return (new VenueImageResource($image))->response()->setStatusCode(201);
    }

    public function destroy(Venue $venue, int $image): JsonResponse
    {
        $this->venueService->removeImage($venue, $image);

        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function setPrimary(Venue $venue, int $image): VenueImageResource
    {
        return new VenueImageResource($this->venueService->setPrimaryImage($venue, $image));
    }
}

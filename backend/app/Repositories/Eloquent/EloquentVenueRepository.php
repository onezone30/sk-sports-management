<?php

namespace App\Repositories\Eloquent;

use App\Models\Attachment;
use App\Models\Venue;
use App\Repositories\Interfaces\VenueRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentVenueRepository implements VenueRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator
    {
        return Venue::with('images')->paginate($perPage);
    }

    public function findById(int $id): ?Venue
    {
        return Venue::with('images')->find($id);
    }

    public function create(array $data): Venue
    {
        return Venue::create($data)->refresh();
    }

    public function update(int $id, array $data): Venue
    {
        $venue = Venue::findOrFail($id);
        $venue->update($data);

        return $venue->load('images');
    }

    public function delete(int $id): void
    {
        Venue::findOrFail($id)->delete();
    }

    public function countImages(Venue $venue): int
    {
        return $venue->images()->count();
    }

    public function createImage(Venue $venue, array $attributes): Attachment
    {
        return $venue->images()->create($attributes);
    }

    public function findImageOrFail(Venue $venue, int $imageId): Attachment
    {
        return $venue->images()->findOrFail($imageId);
    }

    public function deleteImageRecord(Attachment $image): void
    {
        $image->delete();
    }

    public function clearPrimaryFlag(Venue $venue): void
    {
        $venue->images()->where('is_primary', true)->update(['is_primary' => false]);
    }

    public function markPrimary(Attachment $image): Attachment
    {
        $image->update(['is_primary' => true]);

        return $image->refresh();
    }
}

<?php

namespace App\Repositories\Interfaces;

use App\Models\Attachment;
use App\Models\Venue;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VenueRepositoryInterface
{
    public function findAll(int $perPage = 25): LengthAwarePaginator;

    public function findById(int $id): ?Venue;

    public function create(array $data): Venue;

    public function update(int $id, array $data): Venue;

    public function delete(int $id): void;

    public function countImages(Venue $venue): int;

    public function createImage(Venue $venue, array $attributes): Attachment;

    public function findImageOrFail(Venue $venue, int $imageId): Attachment;

    public function deleteImageRecord(Attachment $image): void;

    public function clearPrimaryFlag(Venue $venue): void;

    public function markPrimary(Attachment $image): Attachment;
}

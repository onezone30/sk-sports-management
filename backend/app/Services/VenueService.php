<?php

namespace App\Services;

use App\Exceptions\VenueImageLimitExceededException;
use App\Models\Attachment;
use App\Models\Venue;
use App\Repositories\Interfaces\VenueRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class VenueService
{
    private const MAX_IMAGES = 8;

    public function __construct(private readonly VenueRepositoryInterface $venueRepo) {}

    public function getAll(int $perPage = 25): LengthAwarePaginator
    {
        return $this->venueRepo->findAll($perPage);
    }

    /** @param UploadedFile[] $images */
    public function create(array $data, array $images = [], ?int $uploadedBy = null): Venue
    {
        if (count($images) > self::MAX_IMAGES) {
            throw new VenueImageLimitExceededException();
        }

        $venue = $this->venueRepo->create($data);

        foreach ($images as $index => $file) {
            $this->storeImage($venue, $file, isPrimary: $index === 0, uploadedBy: $uploadedBy);
        }

        return $this->venueRepo->findById($venue->id);
    }

    public function update(Venue $venue, array $data): Venue
    {
        return $this->venueRepo->update($venue->id, $data);
    }

    public function delete(Venue $venue): void
    {
        foreach ($venue->images as $image) {
            $this->deleteImageFile($image);
            $this->venueRepo->deleteImageRecord($image);
        }

        $this->venueRepo->delete($venue->id);
    }

    public function addImage(Venue $venue, UploadedFile $file, ?int $uploadedBy = null): Attachment
    {
        $count = $this->venueRepo->countImages($venue);

        if ($count >= self::MAX_IMAGES) {
            throw new VenueImageLimitExceededException();
        }

        return $this->storeImage($venue, $file, isPrimary: $count === 0, uploadedBy: $uploadedBy);
    }

    public function removeImage(Venue $venue, int $imageId): void
    {
        $image = $this->venueRepo->findImageOrFail($venue, $imageId);
        $wasPrimary = $image->is_primary;

        $this->deleteImageFile($image);
        $this->venueRepo->deleteImageRecord($image);

        if ($wasPrimary) {
            $next = $venue->images()->first();
            if ($next) {
                $this->venueRepo->markPrimary($next);
            }
        }
    }

    public function setPrimaryImage(Venue $venue, int $imageId): Attachment
    {
        $image = $this->venueRepo->findImageOrFail($venue, $imageId);

        $this->venueRepo->clearPrimaryFlag($venue);

        return $this->venueRepo->markPrimary($image);
    }

    private function storeImage(Venue $venue, UploadedFile $file, bool $isPrimary, ?int $uploadedBy): Attachment
    {
        $path = $file->store('venues', 'public');

        return $this->venueRepo->createImage($venue, [
            'name' => $file->getClientOriginalName(),
            'type' => 'image',
            'extension' => $file->getClientOriginalExtension(),
            'size' => (string) $file->getSize(),
            'url' => $path,
            'uploaded_by' => $uploadedBy,
            'is_primary' => $isPrimary,
        ]);
    }

    private function deleteImageFile(Attachment $image): void
    {
        Storage::disk('public')->delete($image->url);
    }
}

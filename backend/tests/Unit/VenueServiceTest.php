<?php

namespace Tests\Unit;

use App\Exceptions\VenueImageLimitExceededException;
use App\Repositories\Interfaces\VenueRepositoryInterface;
use App\Services\VenueService;
use Illuminate\Http\UploadedFile;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryTestCase;

class VenueServiceTest extends MockeryTestCase
{
    public function test_create_throws_image_limit_exception_when_given_more_than_eight_images_without_touching_the_repository(): void
    {
        $images = collect(range(1, 9))->map(fn ($i) => UploadedFile::fake()->image("img{$i}.jpg"))->all();

        $repo = Mockery::mock(VenueRepositoryInterface::class);
        $repo->shouldNotReceive('create');

        $service = new VenueService($repo);

        $this->expectException(VenueImageLimitExceededException::class);

        $service->create(['name' => 'Big Venue'], $images);
    }
}

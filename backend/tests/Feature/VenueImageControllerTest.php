<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VenueImageControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $actingUser;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->actingUser = User::factory()->create(['role_id' => $adminRole->id]);

        Storage::fake('public');
    }

    public function test_store_uploads_image_and_marks_it_primary_when_first(): void
    {
        $venue = Venue::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('cover.jpg'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseCount('attachments', 1);
    }

    public function test_store_does_not_mark_second_image_primary(): void
    {
        $venue = Venue::factory()->create();
        $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('second.jpg'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_primary', false);
    }

    public function test_store_rejects_ninth_image(): void
    {
        $venue = Venue::factory()->create();
        for ($i = 0; $i < 8; $i++) {
            $venue->images()->create([
                'name' => "img{$i}.jpg", 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
                'url' => "venues/img{$i}.jpg", 'is_primary' => $i === 0,
            ]);
        }

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson("/api/venues/{$venue->id}/images", [
                'image' => UploadedFile::fake()->image('one_too_many.jpg'),
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Maximum of 8 images per venue.');

        $this->assertDatabaseCount('attachments', 8);
    }

    public function test_destroy_deletes_image_and_file(): void
    {
        $venue = Venue::factory()->create();
        $path = UploadedFile::fake()->image('cover.jpg')->store('venues', 'public');
        $image = $venue->images()->create([
            'name' => 'cover.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => $path, 'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$image->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('attachments', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_promotes_next_image_to_primary(): void
    {
        $venue = Venue::factory()->create();
        $first = $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);
        $second = $venue->images()->create([
            'name' => 'second.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/second.jpg', 'is_primary' => false,
        ]);

        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$first->id}")
            ->assertStatus(200);

        $this->assertDatabaseHas('attachments', ['id' => $second->id, 'is_primary' => true]);
    }

    public function test_destroy_returns_404_for_image_belonging_to_another_venue(): void
    {
        $venue = Venue::factory()->create();
        $otherVenue = Venue::factory()->create();
        $image = $otherVenue->images()->create([
            'name' => 'cover.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/cover.jpg', 'is_primary' => true,
        ]);

        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}/images/{$image->id}")
            ->assertStatus(404);

        $this->assertDatabaseHas('attachments', ['id' => $image->id]);
    }

    public function test_set_primary_swaps_primary_flag(): void
    {
        $venue = Venue::factory()->create();
        $first = $venue->images()->create([
            'name' => 'first.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/first.jpg', 'is_primary' => true,
        ]);
        $second = $venue->images()->create([
            'name' => 'second.jpg', 'type' => 'image', 'extension' => 'jpg', 'size' => '1000',
            'url' => 'venues/second.jpg', 'is_primary' => false,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/venues/{$venue->id}/images/{$second->id}/primary");

        $response->assertStatus(200)
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseHas('attachments', ['id' => $first->id, 'is_primary' => false]);
        $this->assertDatabaseHas('attachments', ['id' => $second->id, 'is_primary' => true]);
    }
}

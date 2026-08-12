<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VenueControllerTest extends TestCase
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

    // --- index ---

    public function test_index_returns_list_of_venues(): void
    {
        Venue::factory()->count(3)->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/venues');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'address_line', 'city', 'state', 'zip', 'capacity', 'status' => ['value', 'label', 'variant'], 'description', 'images', 'created_at'],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_index_returns_401_for_unauthenticated_request(): void
    {
        $this->getJson('/api/venues')->assertStatus(401);
    }

    // --- store ---

    public function test_store_creates_venue_and_returns_201(): void
    {
        $payload = [
            'name' => 'Central Stadium',
            'address_line' => '123 Main St',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'capacity' => 15000,
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Central Stadium')
            ->assertJsonPath('data.city', 'Springfield');

        $this->assertDatabaseHas('venues', ['name' => 'Central Stadium', 'city' => 'Springfield']);
    }

    public function test_store_creates_venue_with_images(): void
    {
        $payload = [
            'name' => 'Central Stadium',
            'images' => [
                UploadedFile::fake()->image('cover.jpg'),
                UploadedFile::fake()->image('side.jpg'),
            ],
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', $payload);

        $response->assertStatus(201)
            ->assertJsonCount(2, 'data.images')
            ->assertJsonPath('data.images.0.is_primary', true)
            ->assertJsonPath('data.images.1.is_primary', false);

        $this->assertDatabaseCount('attachments', 2);
    }

    public function test_store_fails_validation_with_missing_name(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_fails_validation_with_more_than_eight_images(): void
    {
        $images = collect(range(1, 9))->map(fn ($i) => UploadedFile::fake()->image("img{$i}.jpg"))->all();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', ['name' => 'Big Venue', 'images' => $images]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['images']);
    }

    public function test_store_fails_validation_with_non_image_file(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/venues', [
                'name' => 'Central Stadium',
                'images' => [UploadedFile::fake()->create('doc.pdf', 100)],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['images.0']);
    }

    // --- show ---

    public function test_show_returns_venue_with_images(): void
    {
        $venue = Venue::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson("/api/venues/{$venue->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $venue->id);
    }

    public function test_show_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/venues/99999')
            ->assertStatus(404);
    }

    // --- update ---

    public function test_update_patches_venue_name(): void
    {
        $venue = Venue::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/venues/{$venue->id}", ['name' => 'New Name']);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('venues', ['id' => $venue->id, 'name' => 'New Name']);
    }

    public function test_update_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson('/api/venues/99999', ['name' => 'Whatever'])
            ->assertStatus(404);
    }

    // --- destroy ---

    public function test_destroy_deletes_venue_and_its_image_files(): void
    {
        $venue = Venue::factory()->create();
        $path = UploadedFile::fake()->image('cover.jpg')->store('venues', 'public');
        $venue->images()->create([
            'name' => 'cover.jpg',
            'type' => 'image',
            'extension' => 'jpg',
            'size' => '1000',
            'url' => $path,
            'is_primary' => true,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Venue deleted successfully');

        $this->assertDatabaseMissing('venues', ['id' => $venue->id]);
        $this->assertDatabaseMissing('attachments', ['attachable_id' => $venue->id, 'attachable_type' => Venue::class]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_returns_404_for_nonexistent_venue(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson('/api/venues/99999')
            ->assertStatus(404);
    }

    // --- authorization ---

    public function test_non_admin_cannot_create_a_venue(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);

        $this->actingAs($nonAdmin, 'sanctum')
            ->postJson('/api/venues', ['name' => 'Central Stadium'])
            ->assertStatus(403);

        $this->assertDatabaseMissing('venues', ['name' => 'Central Stadium']);
    }

    public function test_non_admin_cannot_delete_a_venue(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);
        $venue = Venue::factory()->create();

        $this->actingAs($nonAdmin, 'sanctum')
            ->deleteJson("/api/venues/{$venue->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('venues', ['id' => $venue->id]);
    }
}

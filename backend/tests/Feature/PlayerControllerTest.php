<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Player;
use App\Models\PlayerStats;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlayerControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $actingUser;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['name' => 'Admin']);
        // Mutating endpoints are Admin-only (see EnsureRole middleware) — this
        // class tests CRUD behavior, not authorization, so the actor is an Admin.
        $this->actingUser = User::factory()->create(['role_id' => $adminRole->id]);
    }

    // --- index ---

    public function test_index_returns_list_of_players(): void
    {
        Player::factory()->count(3)->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/players');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'full_name', 'date_of_birth', 'age', 'gender', 'status' => ['value', 'label', 'variant'], 'created_at'],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_index_returns_401_for_unauthenticated_request(): void
    {
        $this->getJson('/api/players')->assertStatus(401);
    }

    public function test_index_filters_by_search(): void
    {
        Player::factory()->create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);
        Player::factory()->create(['first_name' => 'Maria', 'last_name' => 'Santos']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/players?search=Dela Cruz');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Dela Cruz');
    }

    // --- store ---

    public function test_store_creates_player_and_returns_201(): void
    {
        $payload = [
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'date_of_birth' => '2000-01-15',
            'gender' => 'male',
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/players', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.first_name', 'Juan')
            ->assertJsonPath('data.full_name', 'Juan Dela Cruz')
            ->assertJsonStructure(['data' => ['id', 'full_name', 'age', 'gender' => ['value', 'label'], 'status' => ['value', 'label', 'variant'], 'created_at']]);

        $this->assertDatabaseHas('players', ['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);
    }

    public function test_store_fails_validation_with_missing_fields(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/players', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name', 'date_of_birth', 'gender']);
    }

    public function test_store_fails_validation_with_future_date_of_birth(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/players', [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'date_of_birth' => now()->addYear()->toDateString(),
                'gender' => 'male',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date_of_birth']);
    }

    public function test_store_fails_validation_with_duplicate_player(): void
    {
        Player::factory()->create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'date_of_birth' => '2000-01-15',
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/players', [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'date_of_birth' => '2000-01-15',
                'gender' => 'male',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date_of_birth']);
    }

    // --- show ---

    public function test_show_returns_player(): void
    {
        $player = Player::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson("/api/players/{$player->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $player->id);
    }

    public function test_show_returns_404_for_nonexistent_player(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/players/99999')
            ->assertStatus(404);
    }

    // --- update ---

    public function test_update_patches_player_name(): void
    {
        $player = Player::factory()->create(['first_name' => 'Old']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/players/{$player->id}", ['first_name' => 'New']);

        $response->assertStatus(200)
            ->assertJsonPath('data.first_name', 'New');

        $this->assertDatabaseHas('players', ['id' => $player->id, 'first_name' => 'New']);
    }

    public function test_update_returns_404_for_nonexistent_player(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson('/api/players/99999', ['first_name' => 'Whatever'])
            ->assertStatus(404);
    }

    // --- destroy ---

    public function test_destroy_deletes_player_and_returns_message(): void
    {
        $player = Player::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/players/{$player->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Player deleted successfully');

        $this->assertDatabaseMissing('players', ['id' => $player->id]);
    }

    public function test_destroy_returns_409_when_player_has_stats(): void
    {
        $player = Player::factory()->create();
        PlayerStats::create([
            'player_id' => $player->id,
            'game_id' => Game::factory()->create()->id,
            'stats' => [],
            'games_played' => 1,
        ]);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/players/{$player->id}");

        $response->assertStatus(409);

        $this->assertDatabaseHas('players', ['id' => $player->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_player(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson('/api/players/99999')
            ->assertStatus(404);
    }

    // --- authorization ---

    public function test_non_admin_cannot_create_a_player(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);

        $this->actingAs($nonAdmin, 'sanctum')
            ->postJson('/api/players', [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'date_of_birth' => '2000-01-15',
                'gender' => 'male',
            ])
            ->assertStatus(403);
    }

    public function test_non_admin_cannot_delete_a_player(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);
        $player = Player::factory()->create();

        $this->actingAs($nonAdmin, 'sanctum')
            ->deleteJson("/api/players/{$player->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('players', ['id' => $player->id]);
    }
}

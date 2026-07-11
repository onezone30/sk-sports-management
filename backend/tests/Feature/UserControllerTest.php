<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private Role $role;
    private User $actingUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->role = Role::factory()->create(['name' => 'Player']);
        $this->actingUser = User::factory()->create();
    }

    // --- index ---

    public function test_index_returns_list_of_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'status', 'created_at'],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_index_returns_401_for_unauthenticated_request(): void
    {
        $this->getJson('/api/users')->assertStatus(401);
    }

    // --- store ---

    public function test_store_creates_user_and_returns_201(): void
    {
        $payload = [
            'name'     => 'Juan dela Cruz',
            'email'    => 'juan@example.com',
            'password' => 'password123',
            'role_id'  => $this->role->id,
        ];

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Juan dela Cruz')
            ->assertJsonPath('data.email', 'juan@example.com')
            ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role', 'status', 'created_at']]);

        $this->assertDatabaseHas('users', ['email' => 'juan@example.com']);
    }

    public function test_store_fails_validation_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/users', [
                'name'     => 'Someone',
                'email'    => 'taken@example.com',
                'password' => 'password123',
                'role_id'  => $this->role->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_store_fails_validation_with_missing_fields(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'role_id']);
    }

    public function test_store_fails_validation_with_nonexistent_role(): void
    {
        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->postJson('/api/users', [
                'name'     => 'Someone',
                'email'    => 'someone@example.com',
                'password' => 'password123',
                'role_id'  => 99999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role_id']);
    }

    // --- show ---

    public function test_show_returns_user_with_role(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role', 'status', 'created_at']]);
    }

    public function test_show_returns_404_for_nonexistent_user(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->getJson('/api/users/99999')
            ->assertStatus(404);
    }

    // --- update ---

    public function test_update_patches_user_name(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson("/api/users/{$user->id}", ['name' => 'New Name']);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);
    }

    public function test_update_returns_404_for_nonexistent_user(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->patchJson('/api/users/99999', ['name' => 'Whatever'])
            ->assertStatus(404);
    }

    // --- destroy ---

    public function test_destroy_deletes_user_and_returns_message(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'User deleted successfully');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_user(): void
    {
        $this->actingAs($this->actingUser, 'sanctum')
            ->deleteJson('/api/users/99999')
            ->assertStatus(404);
    }
}

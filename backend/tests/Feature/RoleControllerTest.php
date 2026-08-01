<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->adminUser = User::factory()->create(['role_id' => $adminRole->id]);
    }

    // --- index ---

    public function test_index_returns_paginated_list_of_roles(): void
    {
        Role::factory()->count(3)->create();

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/roles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name', 'description', 'status' => ['value', 'label', 'variant'], 'created_at']],
                'links',
                'meta',
            ]);
    }

    public function test_index_returns_401_for_unauthenticated_request(): void
    {
        $this->getJson('/api/roles')->assertStatus(401);
    }

    // --- store ---

    public function test_store_creates_role_and_returns_201(): void
    {
        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/roles', [
                'name' => 'Referee',
                'description' => 'Officiates games',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Referee')
            ->assertJsonPath('data.status.value', 'active');

        $this->assertDatabaseHas('roles', ['name' => 'Referee']);
    }

    public function test_store_fails_validation_with_duplicate_name(): void
    {
        Role::factory()->create(['name' => 'Referee']);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/roles', ['name' => 'Referee']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_fails_validation_with_invalid_status(): void
    {
        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/roles', [
                'name' => 'Referee',
                'status' => 'not-a-real-status',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_store_returns_403_for_non_admin(): void
    {
        $role = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($nonAdmin, 'sanctum')
            ->postJson('/api/roles', ['name' => 'Referee'])
            ->assertStatus(403);
    }

    // --- show ---

    public function test_show_returns_role(): void
    {
        $role = Role::factory()->create();

        $this->actingAs($this->adminUser, 'sanctum')
            ->getJson("/api/roles/{$role->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.id', $role->id);
    }

    public function test_show_returns_404_for_nonexistent_role(): void
    {
        $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/roles/99999')
            ->assertStatus(404);
    }

    // --- update ---

    public function test_update_patches_role_status(): void
    {
        $role = Role::factory()->create(['status' => 'active']);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->patchJson("/api/roles/{$role->id}", ['status' => 'inactive']);

        $response->assertStatus(200)
            ->assertJsonPath('data.status.value', 'inactive');

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'status' => 'inactive']);
    }

    public function test_update_fails_validation_when_status_is_boolean(): void
    {
        $role = Role::factory()->create();

        // Regression guard: the pre-refactor endpoint accepted a boolean into
        // this string-enum column ('status' => 'required|boolean').
        $this->actingAs($this->adminUser, 'sanctum')
            ->patchJson("/api/roles/{$role->id}", ['status' => true])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_update_returns_403_for_non_admin(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);
        $role = Role::factory()->create();

        $this->actingAs($nonAdmin, 'sanctum')
            ->patchJson("/api/roles/{$role->id}", ['name' => 'Hacked'])
            ->assertStatus(403);

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => $role->name]);
    }

    // --- destroy ---

    public function test_destroy_deletes_unused_role(): void
    {
        $role = Role::factory()->create();

        $this->actingAs($this->adminUser, 'sanctum')
            ->deleteJson("/api/roles/{$role->id}")
            ->assertStatus(200)
            ->assertJsonPath('message', 'Role deleted successfully');

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    public function test_destroy_returns_409_when_role_is_in_use(): void
    {
        $role = Role::factory()->create();
        User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($this->adminUser, 'sanctum')
            ->deleteJson("/api/roles/{$role->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_role(): void
    {
        $this->actingAs($this->adminUser, 'sanctum')
            ->deleteJson('/api/roles/99999')
            ->assertStatus(404);
    }

    public function test_destroy_returns_403_for_non_admin(): void
    {
        $spectatorRole = Role::factory()->create(['name' => 'Spectator']);
        $nonAdmin = User::factory()->create(['role_id' => $spectatorRole->id]);
        $role = Role::factory()->create();

        $this->actingAs($nonAdmin, 'sanctum')
            ->deleteJson("/api/roles/{$role->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }
}

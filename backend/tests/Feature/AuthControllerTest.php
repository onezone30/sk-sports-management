<?php

namespace Tests\Feature;

use App\Enums\ActiveStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(array $attributes = []): User
    {
        $role = Role::factory()->create();

        return User::factory()->create(array_merge(['role_id' => $role->id], $attributes));
    }

    public function test_login_succeeds_with_valid_credentials(): void
    {
        $user = $this->makeUser(['password' => 'password123']);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role'], 'access_token', 'token_type']);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = $this->makeUser(['password' => 'password123']);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertStatus(401);
    }

    public function test_login_rejects_inactive_user(): void
    {
        $user = $this->makeUser(['password' => 'password123', 'status' => ActiveStatus::INACTIVE]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(403);
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_login_is_throttled_after_five_attempts(): void
    {
        $user = $this->makeUser(['password' => 'password123']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = $this->makeUser();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $response->assertStatus(200);
        $this->assertSame(0, $user->tokens()->count());
    }
}

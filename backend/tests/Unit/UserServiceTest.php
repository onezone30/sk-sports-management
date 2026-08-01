<?php

namespace Tests\Unit;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\UserService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryTestCase;

class UserServiceTest extends MockeryTestCase
{
    public function test_get_all_delegates_to_repository_with_given_page_size(): void
    {
        $paginator = Mockery::mock(LengthAwarePaginator::class);
        $repo = Mockery::mock(UserRepositoryInterface::class);
        $repo->shouldReceive('findAll')->once()->with(10)->andReturn($paginator);

        $service = new UserService($repo);

        $this->assertSame($paginator, $service->getAll(10));
    }

    public function test_create_delegates_to_repository(): void
    {
        $user = Mockery::mock(User::class)->makePartial();
        $data = ['name' => 'Juan', 'email' => 'juan@example.com', 'password' => 'password123', 'role_id' => 1];

        $repo = Mockery::mock(UserRepositoryInterface::class);
        $repo->shouldReceive('create')->once()->with($data)->andReturn($user);

        $service = new UserService($repo);

        $this->assertSame($user, $service->create($data));
    }

    public function test_update_delegates_to_repository_with_the_users_id(): void
    {
        $user = Mockery::mock(User::class)->makePartial();
        $user->id = 42;
        $updated = Mockery::mock(User::class)->makePartial();

        $repo = Mockery::mock(UserRepositoryInterface::class);
        $repo->shouldReceive('update')->once()->with(42, ['name' => 'New Name'])->andReturn($updated);

        $service = new UserService($repo);

        $this->assertSame($updated, $service->update($user, ['name' => 'New Name']));
    }

    public function test_delete_delegates_to_repository_with_the_users_id(): void
    {
        $user = Mockery::mock(User::class)->makePartial();
        $user->id = 42;

        $repo = Mockery::mock(UserRepositoryInterface::class);
        $repo->shouldReceive('delete')->once()->with(42);

        $service = new UserService($repo);

        $service->delete($user);
    }
}

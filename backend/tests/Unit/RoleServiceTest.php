<?php

namespace Tests\Unit;

use App\Exceptions\RoleInUseException;
use App\Models\Role;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Services\RoleService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryTestCase;

class RoleServiceTest extends MockeryTestCase
{
    public function test_get_all_delegates_to_repository_with_given_page_size(): void
    {
        $paginator = Mockery::mock(LengthAwarePaginator::class);
        $repo = Mockery::mock(RoleRepositoryInterface::class);
        $repo->shouldReceive('findAll')->once()->with(10)->andReturn($paginator);

        $service = new RoleService($repo);

        $this->assertSame($paginator, $service->getAll(10));
    }

    public function test_create_delegates_to_repository(): void
    {
        $role = Mockery::mock(Role::class)->makePartial();
        $data = ['name' => 'Referee', 'description' => 'Officiates games'];

        $repo = Mockery::mock(RoleRepositoryInterface::class);
        $repo->shouldReceive('create')->once()->with($data)->andReturn($role);

        $service = new RoleService($repo);

        $this->assertSame($role, $service->create($data));
    }

    public function test_update_delegates_to_repository_with_the_roles_id(): void
    {
        $role = Mockery::mock(Role::class)->makePartial();
        $role->id = 7;
        $updated = Mockery::mock(Role::class)->makePartial();

        $repo = Mockery::mock(RoleRepositoryInterface::class);
        $repo->shouldReceive('update')->once()->with(7, ['status' => 'inactive'])->andReturn($updated);

        $service = new RoleService($repo);

        $this->assertSame($updated, $service->update($role, ['status' => 'inactive']));
    }

    public function test_delete_removes_role_with_no_users(): void
    {
        $usersRelation = Mockery::mock(HasMany::class);
        $usersRelation->shouldReceive('exists')->once()->andReturnFalse();

        $role = Mockery::mock(Role::class)->makePartial();
        $role->id = 7;
        $role->shouldReceive('users')->once()->andReturn($usersRelation);

        $repo = Mockery::mock(RoleRepositoryInterface::class);
        $repo->shouldReceive('delete')->once()->with(7);

        $service = new RoleService($repo);

        $service->delete($role);
    }

    public function test_delete_throws_when_role_is_still_assigned_to_users(): void
    {
        $usersRelation = Mockery::mock(HasMany::class);
        $usersRelation->shouldReceive('exists')->once()->andReturnTrue();

        $role = Mockery::mock(Role::class)->makePartial();
        $role->id = 7;
        $role->shouldReceive('users')->once()->andReturn($usersRelation);

        $repo = Mockery::mock(RoleRepositoryInterface::class);
        $repo->shouldNotReceive('delete');

        $service = new RoleService($repo);

        $this->expectException(RoleInUseException::class);

        $service->delete($role);
    }
}

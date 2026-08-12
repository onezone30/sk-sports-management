<?php

namespace Tests\Unit;

use App\Exceptions\PlayerInUseException;
use App\Models\Player;
use App\Repositories\Interfaces\PlayerRepositoryInterface;
use App\Services\PlayerService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryTestCase;

class PlayerServiceTest extends MockeryTestCase
{
    public function test_get_all_delegates_to_repository_with_given_page_size_and_search(): void
    {
        $paginator = Mockery::mock(LengthAwarePaginator::class);
        $repo = Mockery::mock(PlayerRepositoryInterface::class);
        $repo->shouldReceive('findAll')->once()->with(10, 'cruz')->andReturn($paginator);

        $service = new PlayerService($repo);

        $this->assertSame($paginator, $service->getAll(10, 'cruz'));
    }

    public function test_create_delegates_to_repository(): void
    {
        $player = Mockery::mock(Player::class)->makePartial();
        $data = ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'date_of_birth' => '2000-01-15', 'gender' => 'male'];

        $repo = Mockery::mock(PlayerRepositoryInterface::class);
        $repo->shouldReceive('create')->once()->with($data)->andReturn($player);

        $service = new PlayerService($repo);

        $this->assertSame($player, $service->create($data));
    }

    public function test_update_delegates_to_repository_with_the_players_id(): void
    {
        $player = Mockery::mock(Player::class)->makePartial();
        $player->id = 42;
        $updated = Mockery::mock(Player::class)->makePartial();

        $repo = Mockery::mock(PlayerRepositoryInterface::class);
        $repo->shouldReceive('update')->once()->with(42, ['first_name' => 'New Name'])->andReturn($updated);

        $service = new PlayerService($repo);

        $this->assertSame($updated, $service->update($player, ['first_name' => 'New Name']));
    }

    public function test_delete_delegates_to_repository_when_player_has_no_dependents(): void
    {
        $player = Mockery::mock(Player::class)->makePartial();
        $player->id = 42;

        $repo = Mockery::mock(PlayerRepositoryInterface::class);
        $repo->shouldReceive('hasDependents')->once()->with(42)->andReturn(false);
        $repo->shouldReceive('delete')->once()->with(42);

        $service = new PlayerService($repo);

        $service->delete($player);
    }

    public function test_delete_throws_player_in_use_exception_when_dependents_exist(): void
    {
        $player = Mockery::mock(Player::class)->makePartial();
        $player->id = 42;

        $repo = Mockery::mock(PlayerRepositoryInterface::class);
        $repo->shouldReceive('hasDependents')->once()->with(42)->andReturn(true);
        $repo->shouldNotReceive('delete');

        $service = new PlayerService($repo);

        $this->expectException(PlayerInUseException::class);

        $service->delete($player);
    }
}

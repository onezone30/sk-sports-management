---
name: backend-layers
description: Code patterns and examples for each backend layer in sk-sports-management (Laravel). Load when writing or editing Controllers, Services, Actions, Events/Listeners, domain Exceptions, Observers, Repositories, Form Requests, API Resources, or Models — i.e. any concrete implementation in backend/app/. The always-on rules live in backend/CLAUDE.md; this skill holds the copy-paste examples.
---

# Backend layer patterns

Concrete examples for each layer. The *rules* are in `backend/CLAUDE.md` — this is the "show me the code" companion.

## Controllers

HTTP only. No Eloquent, no business logic. Type-hint a Form Request, call exactly one Action or Service method, return a Resource.

```php
// Simple CRUD — calls a Service
public function __construct(private readonly UserService $userService) {}

public function store(StoreUserRequest $request): UserResource
{
    $user = $this->userService->create($request->validated());
    return new UserResource($user);
}

// Cross-domain — calls an Action
public function __construct(private readonly RegisterPlayerToTeamAction $registerPlayer) {}

public function store(RegisterPlayerRequest $request, int $teamId): TeamPlayerResource
{
    $teamPlayer = $this->registerPlayer->execute(
        $request->player_id,
        $teamId,
        $request->validated(),
    );
    return new TeamPlayerResource($teamPlayer);
}
```

## Services

Single-domain business logic in `app/Services/`. One class per domain (`UserService`, `SeasonService`...). Multiple CRUD-level methods. Receive repositories via constructor. Never import `Request` / return `Response`. Throw domain exceptions on failure.

```php
// app/Services/UserService.php
public function __construct(private readonly UserRepositoryInterface $userRepo) {}

public function create(array $data): User
{
    $data['password'] = Hash::make($data['password']);
    return $this->userRepo->create($data);
}
```

## Actions

Cross-domain operations in `app/Actions/`. Naming: `[Verb][Noun]Action`. Method is always `execute()` (never `handle()` — reserved by Laravel). Inject repositories (not services). Wrap any multi-table write in `DB::transaction()`. Throw domain exceptions for rule violations. Fire Events inside the transaction closure (Laravel fires them after commit).

```php
// app/Actions/RegisterPlayerToTeamAction.php
class RegisterPlayerToTeamAction
{
    public function __construct(
        private readonly PlayerRepositoryInterface $playerRepo,
        private readonly TeamRepositoryInterface $teamRepo,
        private readonly DivisionRepositoryInterface $divisionRepo,
        private readonly TeamPlayerRepositoryInterface $teamPlayerRepo,
    ) {}

    public function execute(int $playerId, int $teamId, array $data): TeamPlayer
    {
        return DB::transaction(function () use ($playerId, $teamId, $data) {
            $player   = $this->playerRepo->findById($playerId);
            $team     = $this->teamRepo->findById($teamId);
            $division = $this->divisionRepo->findById($team->division_id);

            if ($this->teamPlayerRepo->existsForTeam($playerId, $teamId)) {
                throw new PlayerAlreadyOnTeamException;
            }

            $age = now()->diffInYears($player->date_of_birth);
            if ($age < $division->min_age || $age > $division->max_age) {
                throw new DivisionAgeRequirementException($division->min_age, $division->max_age);
            }

            $currentCount = $this->teamPlayerRepo->countForTeam($teamId);
            if ($currentCount >= $division->sport->max_players_per_team) {
                throw new TeamCapacityExceededException($division->sport->max_players_per_team);
            }

            $teamPlayer = $this->teamPlayerRepo->create([...$data, 'player_id' => $playerId, 'team_id' => $teamId]);

            event(new PlayerRegisteredToTeam($player, $team));

            return $teamPlayer;
        });
    }
}
```

Actions this project needs:

| Action | Domains Touched |
|---|---|
| `RegisterPlayerToTeamAction` | Player, Team, Division, Sport, TeamPlayer |
| `RecordGameResultAction` | Game, PlayerStats, Player (MVP) |
| `CreateSeasonWithSportsAction` | Season, Sport |

## Events & Listeners

Use events for side effects logically separate from the primary operation. Only define an Event if it has at least one registered Listener — no dead events. Events: past-tense noun phrase. Listeners: imperative verb phrase.

```php
// app/Events/PlayerRegisteredToTeam.php
class PlayerRegisteredToTeam
{
    use Dispatchable;

    public function __construct(
        public readonly Player $player,  // pass models, not IDs — listener needs them
        public readonly Team   $team,
    ) {}
}

// app/Listeners/NotifyTeamHandlerOfRegistration.php
class NotifyTeamHandlerOfRegistration
{
    public function handle(PlayerRegisteredToTeam $event): void
    {
        // $event->team->handler — send notification, mail, etc.
    }
}
```

Register both in `AppServiceProvider::boot()`:

```php
use Illuminate\Support\Facades\Event;

public function boot(): void
{
    Event::listen(PlayerRegisteredToTeam::class, NotifyTeamHandlerOfRegistration::class);
    Event::listen(GameResultRecorded::class, UpdateStandingsAfterGame::class);
}
```

Add `implements ShouldQueue` to a Listener only after the queue driver is actually configured — queueing without a configured driver silently fails.

## Domain Exceptions

Thrown from Actions/Services for business-rule violations. In `app/Exceptions/`. Extend `Exception` directly (never `HttpException` — keeps domain code HTTP-agnostic). Map to HTTP responses once, centrally, in `bootstrap/app.php`.

```php
// app/Exceptions/TeamCapacityExceededException.php
class TeamCapacityExceededException extends Exception
{
    public function __construct(int $max)
    {
        parent::__construct("Team has reached its maximum capacity of {$max} players.");
    }
}
```

```php
// bootstrap/app.php — inside ->withExceptions()
$exceptions->render(function (TeamCapacityExceededException $e) {
    return response()->json(['message' => $e->getMessage()], 422);
});
$exceptions->render(function (DivisionAgeRequirementException $e) {
    return response()->json(['message' => $e->getMessage()], 422);
});
$exceptions->render(function (PlayerAlreadyOnTeamException $e) {
    return response()->json(['message' => $e->getMessage()], 409);
});
```

## Observers

Only for pure infrastructure side-effects on model lifecycle events — things always true regardless of who triggers the change. Never put business logic in an Observer. If you are querying another model or calling a Service inside an Observer, move that logic to an Action or Service instead.

Register in `AppServiceProvider::boot()`: `Team::observe(TeamObserver::class);`

This project needs exactly one Observer:

```php
// app/Observers/TeamObserver.php
class TeamObserver
{
    public function creating(Team $team): void
    {
        if (empty($team->slug)) {
            $team->slug = Str::slug($team->name);
        }
    }
}
```

## Repositories

The only layer that touches Eloquent. In `app/Repositories/`. Interface → `Interfaces/UserRepositoryInterface.php`; concrete → `Eloquent/EloquentUserRepository.php`.

```php
interface UserRepositoryInterface
{
    public function findAll(): Collection;
    public function findById(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): void;
}

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findAll(): Collection
    {
        return User::with('role')->get();
    }
    // ...
}
```

Bind in `RepositoryServiceProvider`, then register the provider in `AppServiceProvider::register()`:

```php
$this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
```

(List methods must paginate — see the `backend-scalability` skill.)

## Form Requests

One per mutation action, in `app/Http/Requests/`.

```php
public function authorize(): bool
{
    return true; // RBAC is handled at the route/middleware level
}

public function rules(): array
{
    return [
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', 'unique:users'],
        'password' => ['required', 'string', 'min:8'],
        'role_id'  => ['required', 'exists:roles,id'],
    ];
}
```

Add `messages()` only when default Laravel messages are ambiguous.

## API Resources

One per model, in `app/Http/Resources/`. Always define `toArray()` fields explicitly (never `parent::toArray()`). Responses are wrapped in `data` automatically. Use `UserResource::collection($users)` for index responses.

```php
public function toArray(Request $request): array
{
    return [
        'id'         => $this->id,
        'name'       => $this->name,
        'email'      => $this->email,
        'role'       => $this->whenLoaded('role', fn() => [
            'id'   => $this->role->id,
            'name' => $this->role->name,
        ]),
        'status'     => $this->status,
        'created_at' => $this->created_at->toDateTimeString(),
    ];
}
```

## Models

Data containers — no business logic. Always define `$fillable` (never `$guarded = []`). Use `$casts` for enums, JSON, dates. Define all relationships explicitly.

```php
protected $fillable = ['name', 'email', 'password', 'role_id'];

protected $casts = [
    'status'   => ActiveStatus::class,
    'password' => 'hashed',
];
```

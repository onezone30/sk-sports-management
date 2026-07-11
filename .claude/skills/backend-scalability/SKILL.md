---
name: backend-scalability
description: Scalability conventions to follow from the start in sk-sports-management (Laravel backend) — pagination, caching, rate limiting, and API versioning. Load when writing repository list methods, caching expensive reads (standings/leaderboards/stats), adding throttling to routes, or deciding whether to version the API. These are conventions to apply now to avoid a painful retrofit later, not features to build.
---

# Scalability conventions

Conventions to follow from the start so the app doesn't need a painful retrofit later.

## Pagination

All Repository list methods must use `paginate()` — never `get()` on unbounded queries.

```php
// Repository — always paginate lists
public function findAll(int $perPage = 25): LengthAwarePaginator
{
    return User::with('role')->paginate($perPage);
}

// Controller — pass paginated result directly to the Resource collection
return UserResource::collection($this->userService->getAll());
```

Laravel auto-wraps paginated responses with `meta` (total, per_page, current_page) and `links` (first, last, prev, next). Clients can pass `?page=2&per_page=50` — `paginate()` reads these automatically.

## Caching

Cache sits at the Repository level using `Cache::remember()`. Only cache expensive, rarely-changing reads — standings, leaderboards, stats aggregations.

```php
public function getStandings(int $divisionId): Collection
{
    return Cache::remember("standings.division.{$divisionId}", now()->addMinutes(10), function () use ($divisionId) {
        return Team::where('division_id', $divisionId)->withCount('wins')->orderByDesc('wins_count')->get();
    });
}
```

Invalidate via Listeners when source data changes — a `GameResultRecorded` listener flushes the relevant standings cache key. Do not cache per-request auth data or frequently-mutated records (users, roles).

## Rate Limiting

Apply throttling in `routes/api.php` via Laravel's built-in middleware:

```php
// Stricter limit on login to slow brute-force attempts
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Standard limit on all authenticated routes
Route::middleware(['auth:sanctum', 'active', 'throttle:60,1'])->group(function () {
    // ...
});
```

`throttle:60,1` = 60 requests per 1 minute per user. Laravel returns `429 Too Many Requests` automatically when the limit is exceeded.

## API Versioning

Not needed now. When a breaking change requires a new contract, prefix routes with `/api/v1/`. Do not mix versioned and unversioned routes in `api.php` — when versioning becomes necessary, move everything into a versioned group.

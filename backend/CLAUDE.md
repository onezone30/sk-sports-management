# Backend CLAUDE.md

## Stack

- Laravel 12, PHP 8.2+
- Laravel Sanctum (API token authentication)
- Laravel Pint (code style — run `php artisan pint`)
- SQLite (dev), MySQL/MariaDB (prod)
- PHPUnit 11 (tests)
- Env: `backend/.env` — SQLite DB path, Sanctum config, `APP_KEY`

---

## Where detailed guidance lives

This file holds the always-true rules. Depth and code examples live in on-demand skills and commands — pull them in when the task calls for it:

| Need | Load |
|---|---|
| Code patterns for a layer (Controllers, Services, Actions, Repos, Requests, Resources, Events, Exceptions, Observers, Models) | skill `backend-layers` |
| RBAC / permissions detail (source of truth, role-change rule, trait, middleware) | skill `backend-rbac` |
| Pagination, caching, rate limiting, API versioning | skill `backend-scalability` |
| Scaffold a whole new feature step-by-step | `/new-feature-backend` |
| Full project health check | `/check` |

---

## Architecture

Hybrid layered pattern. **Actions** and **Services** are both valid entry points from the Controller — choose via the decision rule.

```
HTTP Request
    ↓
Controller           — HTTP only: one FormRequest, one call, one Resource returned
    ↓
 ┌─────────┐
 │         │
Action   Service     — Action for cross-domain ops, Service for single-domain ops
 │         │
 └────┬────┘
      ↓
Repository           — Eloquent queries only, no business logic
      ↓
Model                — data container: fillable, casts, relationships only

Side channel:
Action ──► event(new SomethingHappened()) ──► Listener
```

**Decision rule:**
> Does the operation touch **two or more entity domains** (e.g. Player + Team, Game + Stats)? → **Use an Action.** Does it stay within one entity domain? → **Use a Service method.**

**Hard rules:**
- Controller calls **either** one Action **or** one Service method — never both in the same method
- Services never call other Services — that is an Action's job
- Actions fire Events; Listeners never fire new Events
- Domain exceptions are thrown from Actions/Services and mapped to HTTP responses in `bootstrap/app.php`

---

## Folder Structure

```
app/
├── Actions/                             # Cross-domain use-case classes (one per operation)
├── Enums/                               # String enums for status and type fields
├── Events/                              # Domain events (past-tense names)
├── Exceptions/                          # Domain exceptions (extend Exception, not HttpException)
├── Http/
│   ├── Controllers/                     # Thin controllers — HTTP only
│   ├── Middleware/                      # CheckInactivity (alias: active, logs out after 15 min idle), CheckPermission (alias: permission)
│   ├── Requests/                        # Form Request classes (one per mutation action)
│   └── Resources/                       # API Resource classes (one per model)
├── Listeners/                           # Event listeners (imperative names)
├── Models/                              # Eloquent models
├── Observers/                           # Infrastructure-only model lifecycle hooks
├── Providers/
│   ├── AppServiceProvider.php           # Registers events, observers; imports RepositoryServiceProvider
│   └── RepositoryServiceProvider.php    # Binds interfaces → concrete implementations
├── Repositories/
│   ├── Interfaces/                      # Repository contracts
│   └── Eloquent/                        # Concrete Eloquent implementations
├── Services/                            # Single-domain business logic classes
└── Traits/                              # HasPermissions, etc.
```

---

## Layer rules

Terse rules only — see the `backend-layers` skill for code examples.

**Controllers** — HTTP only; no Eloquent, no business logic.
- Type-hint a Form Request (never `$request->validate()`)
- Call exactly one Action or Service method per action
- Return an API Resource or `ResourceCollection`
- Standard method names: `index`, `store`, `show`, `update`, `destroy`
- Inject dependencies via constructor

**Services** — single-domain business logic in `app/Services/`.
- One class per domain; multiple CRUD-level methods
- Repositories via constructor injection
- Never import `Request` / return `Response` — HTTP-agnostic
- Throw domain exceptions on failure

**Actions** — cross-domain operations in `app/Actions/`.
- Naming `[Verb][Noun]Action`; method always `execute()` (never `handle()`)
- Inject repositories (not services)
- Multi-table writes wrapped in `DB::transaction()`
- Throw domain exceptions; fire Events inside the transaction closure

**Events & Listeners** — only define an Event if it has a registered Listener (no dead events). Events past-tense, Listeners imperative. Register in `AppServiceProvider::boot()`.

**Domain Exceptions** — extend `Exception` directly (never `HttpException`). Map to HTTP once, centrally, in `bootstrap/app.php`.

**Observers** — pure infrastructure side-effects only. Never business logic. Register in `AppServiceProvider::boot()`.

**Repositories** — the only layer that touches Eloquent; no business logic. Interface in `Interfaces/`, concrete in `Eloquent/`, bound in `RepositoryServiceProvider`. List methods must `paginate()`.

**Form Requests** — one per mutation. `authorize()` returns `true` (RBAC is route/middleware level). No business logic in `rules()`.

**API Resources** — one per model. Define `toArray()` fields explicitly (never `parent::toArray()`). Responses wrapped in `data`.

**Models** — data containers only. Always `$fillable` (never `$guarded = []`), `$casts` for enums/JSON/dates, all relationships explicit. Key relationships: `User → Role → Permission` (RBAC), `Season → Sport → Division → Team → Player`.

---

## Routing

All routes in `routes/api.php`.
- **Public:** `POST /login` only
- **Protected:** wrapped in `middleware(['auth:sanctum', 'active'])`
- Use `Route::apiResources([...])` — one entry per resource
- URL convention: plural noun everywhere — `/users`, `/users/{user}`
- Route model binding: type-hint the Eloquent model; Laravel resolves and 404s automatically

---

## Enums

All enums in `app/Enums/`. Always cast enum columns in the model.

| Enum | Values | Used on |
|---|---|---|
| `ActiveStatus` | `active \| inactive \| archived \| done` | User, Role, Season, Sport, Division, Player |
| `SportsType` | `basketball \| volleyball \| mobile_legends \| chess \| badminton` | Sport |
| `TeamStatus` | `active \| pending \| verified \| suspended \| disqualified \| withdrawn` | Team |

`SportsType` helpers: `stats()` (valid stat field names) and `category()` (`'team'` or `'individual'`).

---

## Testing

- **Feature tests** (`tests/Feature/`) — full HTTP cycles via `$this->postJson()` etc.
- **Unit tests** (`tests/Unit/`) — Service and Action methods directly (mock repositories)
- Always use `RefreshDatabase` in feature tests
- Use factories for all test data — never hardcode IDs
- In-memory SQLite pre-configured in `phpunit.xml`
- When unit-testing an Action, mock each repository and assert the correct domain exception is thrown per business rule

```bash
php artisan test                        # run all tests
php artisan test --filter UserTest      # run a single test class
```

---

## Implementation Status

| Area | Status |
|---|---|
| Auth (login/logout) | Complete |
| Users | Complete (needs refactor to new pattern) |
| Roles | Complete (needs refactor to new pattern) |
| Seasons | Complete (needs refactor to new pattern) |
| Sports | Complete (needs refactor to new pattern) |
| Divisions | Complete (needs refactor to new pattern) |
| Teams | Controller exists — **routes not registered** |
| Players | Controller is empty — **not implemented** |
| Permission enforcement on routes | Permissions exist in DB — **not enforced yet** |

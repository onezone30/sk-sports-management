Scaffold a new backend feature in sk-sports-management following the layered architecture. First read `backend/CLAUDE.md` for the rules, and load the `backend-layers` skill for code patterns.

Decide which path applies:

> Does the operation touch **two or more entity domains** (e.g. Player + Team)? → **Path B (Action).** Does it stay within one entity domain? → **Path A (Service).**

If the feature has both a single-domain CRUD part and a cross-domain operation, do Path A for the CRUD, then Path B for the operation.

---

## Path A — Single-domain CRUD

Use when the feature creates/reads/updates/deletes within **one entity domain** (e.g. full CRUD for Venues).

1. Create migration (`php artisan make:migration create_<table>_table`)
2. Create/update model — `$fillable`, `$casts`, relationships
3. Create factory + seeder
4. Create repository interface (`app/Repositories/Interfaces/`)
5. Create Eloquent implementation (`app/Repositories/Eloquent/`) — list methods must `paginate()`
6. Bind interface → concrete in `RepositoryServiceProvider`
7. Create service (`app/Services/`)
8. Create Form Request(s) (`app/Http/Requests/`)
9. Create API Resource (`app/Http/Resources/`)
10. Create controller — inject Service via constructor
11. Register routes in `routes/api.php`
12. Write feature tests (full HTTP cycle) + unit tests (Service methods)

## Path B — Cross-domain operation

Use when the operation touches **two or more entity domains** (e.g. register a player to a team).

1. Confirm all relevant Repositories exist — create missing ones via Path A steps 1–6 first
2. Create domain exceptions (`app/Exceptions/`) for each business rule violation
3. Map those exceptions to HTTP responses in `bootstrap/app.php`
4. Create the Action (`app/Actions/`) — inject repos, write `execute()`, wrap multi-table writes in `DB::transaction()`
5. If there are side effects: create Event (`app/Events/`) + Listener (`app/Listeners/`), register in `AppServiceProvider::boot()`
6. Create Form Request for the Action's input
7. Wire the Action into the Controller — inject via constructor, call `execute()` in the method
8. Add route in `routes/api.php`
9. Write unit tests for the Action (mock repos, assert each exception is thrown correctly)
10. Write feature test for the full HTTP flow

---

After scaffolding, run `php artisan test` to confirm nothing is broken.

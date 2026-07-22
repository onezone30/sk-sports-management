Run a full project health check for sk-sports-management. Do every step in order.

## Step 1 — Run existing tests
Run `php artisan test` from `backend/`. Note how many pass/fail.

## Step 2 — Read guidelines
Read `backend/CLAUDE.md` in full. If any frontend files are in the diff, also read `frontend/CLAUDE.md` and load the `frontend-components` skill.

## Step 3 — Get the diff
Run `git diff HEAD`. If empty, run `git diff HEAD~1`.

## Step 4 — Architecture review
Check each changed PHP file against these rules:

**Controllers** (`app/Http/Controllers/`)
- [ ] No direct Eloquent (`Model::`, `->find`, `->where`, `->save`, `->delete`)
- [ ] No inline `$request->validate()` — must use a Form Request class
- [ ] Each method calls exactly ONE Service method OR one Action — not both, not zero
- [ ] Returns an API Resource, ResourceCollection, or JsonResponse only
- [ ] Dependencies injected via constructor

**Services** (`app/Services/`)
- [ ] No calls to other Service classes
- [ ] No `Request` or `Response` imports
- [ ] Password hashing done here, not in the controller
- [ ] Throws domain exceptions (from `app/Exceptions/`) on failure

**Repositories** (`app/Repositories/`)
- [ ] Only layer that calls Eloquent methods directly
- [ ] No business logic, no hashing, no decisions
- [ ] Concrete class implements its interface

**Actions** (`app/Actions/`)
- [ ] Method is named `execute()` — never `handle()`
- [ ] Multi-table writes wrapped in `DB::transaction()`
- [ ] Events fired after the transaction

**Form Requests** (`app/Http/Requests/`)
- [ ] `authorize()` returns `true`
- [ ] No business logic in `rules()`

**Resources** (`app/Http/Resources/`)
- [ ] `toArray()` lists every field explicitly — no `parent::toArray()`

**Models** (`app/Models/`)
- [ ] Only `$fillable`, `$casts`, and relationships — no business logic

## Step 5 — Test coverage check
For every controller file in the diff:
1. List its public methods (index, store, show, update, destroy, etc.)
2. Check if `tests/Feature/[ResourceName]ControllerTest.php` exists
3. If it exists, grep for test methods and check which controller methods are covered
4. If the test file does not exist, or if specific methods are not covered — proceed to Step 6
5. If everything is covered, skip Step 6

## Step 6 — Generate missing tests
If Step 5 found untested methods or a missing test file, generate the complete test file now.

Rules for generating the test:
- File goes in `tests/Feature/[ResourceName]ControllerTest.php`
- Class extends `Tests\TestCase` and uses `RefreshDatabase`
- `setUp()` must create `Role::factory()->create(['name' => 'Player'])` FIRST, then create the acting user via `User::factory()->create()`
- All requests must use `$this->actingAs($this->actingUser, 'sanctum')`
- For each controller method, generate these test cases:
  - `index` → happy path (200, paginated `data` array with `links` and `meta`)
  - `store` → happy path (201, resource in DB), validation failure (422), unauthenticated (401)
  - `show` → happy path (200, `data.id` matches), not found (404)
  - `update` → happy path (200, field updated in DB), not found (404)
  - `destroy` → happy path (200, message returned, row missing from DB), not found (404)
- Use `assertJsonPath('data.field', value)` — responses are always wrapped in `data`
- Use `assertDatabaseHas` / `assertDatabaseMissing` to confirm DB state
- Test method names use `test_` prefix + `snake_case` (e.g., `test_destroy_deletes_user`)

After writing the file, run `php artisan test --filter [ResourceName]ControllerTest` to confirm the generated tests pass.

## Step 7 — Final report
Output:
- ✅ or ❌ for each architecture rule checked
- ✅ or ❌ for each controller method's test coverage
- Whether a test file was generated and if it passed
- Overall verdict: **PASS** or **NEEDS FIXES**

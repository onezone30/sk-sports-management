# RBAC session — starter prompt (do this BEFORE the roles feature)

One session, one branch (`feat/be-rbac`). This is coupled work — do not split it across two agents.
Paste this into the Warp tab running the agent.

---

You are working ONLY on the Laravel backend of sk-sports-management, on branch `feat/be-rbac`. Do not touch `frontend/**`.

Read `backend/CLAUDE.md`, then load the **`backend-rbac`** skill (source-of-truth model + role-change rule) and **`backend-layers`** (code patterns). The RBAC schema, model relationships, and `hasPermission()` trait already exist — they're just inert. Bring them to life, in this exact order (each step depends on the one before it):

1. **Seed permissions.** Create `database/seeders/PermissionSeeder.php`: seed the `permissions` master list, then fill each role's `permission_roles` template. Register it in `DatabaseSeeder`. Both tables are currently empty, so nothing downstream works until this exists.

2. **Sync `permission_user` on role assignment.** In `UserService`, when a user is created or their `role_id` changes, replace their `permission_user` rows with the assigned role's `permission_roles` defaults. This is the documented role-change rule and it is currently NOT implemented (`create`/`update` just forward to the repo). Keep it in the Service, not an Observer.

3. **Build enforcement.** Create `app/Http/Middleware/CheckPermission.php` that returns 403 unless `$request->user()->hasPermission($permission)`; register it with the `permission` alias in `bootstrap/app.php` (the alias does not exist yet).

4. **Switch the routes.** In `routes/api.php`, replace the temporary `role:Admin` (`EnsureRole`) gates on the users and roles mutation routes with `permission:...` checks (e.g. `permission:users.delete`). Leave `EnsureRole` only where no permission is defined yet.

**FILES YOU OWN:** `backend/**` — expect to touch `database/seeders/`, `app/Services/UserService.php`, `app/Http/Middleware/`, `bootstrap/app.php`, `routes/api.php`.
**DO NOT TOUCH:** `frontend/**`, root `package.json` / lockfiles.

**WHEN DONE:**
- Run the **`backend-tester`** skill (the `/check` health check) and `php artisan test`.
- Add/adjust tests so a permission-gated route returns 403 without the permission and 200 with it.
- Verify a fresh DB wires up: `php artisan migrate:fresh --seed`.
- Commit on `feat/be-rbac`. Since this is the only session running, just merge it to `main` once tests are green — no cross-session coordination needed.

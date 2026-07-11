---
name: backend-rbac
description: How RBAC and per-user permission overrides work in sk-sports-management (Laravel backend). Load when touching permissions, roles, the HasPermissions trait, CheckPermission middleware, permission_user / permission_roles tables, or gating routes by permission. Explains the source-of-truth model and the role-change rule.
---

# RBAC & Permissions

This project uses **RBAC with per-user overrides**. A role is a default template — assigning a role pre-populates a user's permissions — but an admin can toggle any individual permission on or off per user independently.

## Source of truth

`permission_user` is the live access-control table. `permission_roles` is the template only.

```
permissions       — master list of all permission checkboxes (e.g. "can_create_team")
permission_roles  — default permission set per role (template)
permission_user   — actual per-user permissions (what the middleware checks)
```

## How it works

1. Admin assigns a role to a user → system copies that role's permissions into `permission_user`.
2. Admin can then toggle individual permissions on/off for that user → updates `permission_user` directly.
3. `hasPermission()` checks `permission_user` only — never `permission_roles`.

## Trait

`hasPermission()` lives in `app/Traits/HasPermissions.php` and is used on `User` via `use HasPermissions`.

```php
// app/Traits/HasPermissions.php
trait HasPermissions
{
    public function hasPermission(string $permission): bool
    {
        $this->loadMissing('permissions');
        return $this->permissions->contains('name', $permission);
    }
}
```

## Middleware

`CheckPermission` middleware lives in `app/Http/Middleware/CheckPermission.php` and is registered with the alias `permission` in `bootstrap/app.php`.

```php
// usage in api.php
Route::delete('/user/{id}', [UserController::class, 'destroy'])
    ->middleware('permission:users.delete');
```

## Role change rule

Whenever a user's `role_id` changes, their `permission_user` rows must be replaced with the new role's defaults. This is handled by `UserService` — **not** an Observer (business logic, not infrastructure).

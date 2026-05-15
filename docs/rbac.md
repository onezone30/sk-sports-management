# RBAC — Roles & Permissions

## Roles

Seeded at startup via `RoleSeeder`. One role per user (`users.role_id`).

| Role | Description |
|------|-------------|
| Admin | Full system access — manages seasons, users, roles |
| Manager | League-level management |
| Coach | Manages a specific team (`teams.handler_id`) |
| Player | Regular player user |
| Spectator | Read-only access |

---

## Permissions

Stored in the `permissions` table. Assigned to roles via the `permission_roles` pivot (many-to-many).

No permissions are seeded by default — they need to be defined and attached to roles manually or via a future `PermissionSeeder`.

Suggested permission naming convention: `resource.action`

```
users.view
users.create
users.edit
users.delete

seasons.view
seasons.create
seasons.edit
seasons.delete

sports.view
sports.create
...
```

---

## How It Works — Backend

Authentication is handled by **Laravel Sanctum** (token-based).

The `active` middleware (`CheckInactivity`) runs on all protected routes and logs out users after 15 minutes of inactivity. It does **not** check permissions — that layer is not yet implemented on the backend.

Flow:
1. `POST /api/login` returns a Sanctum token
2. All subsequent requests attach `Authorization: Bearer <token>`
3. `auth:sanctum` middleware validates the token
4. `active` middleware checks session freshness

---

## How It Works — Frontend

The frontend reads permissions from `AuthProvider` (`frontend/src/providers/AuthProvider.tsx`).

On login, permissions are stored in `localStorage` alongside the user and token.

**Checking a permission:**
```ts
const { hasPermission } = useAuth();

if (hasPermission('users.edit')) {
  // show edit button
}
```

**Protecting a route:**
```tsx
<RoleGuard permission="users.edit">
  <EditUserPage />
</RoleGuard>
```

`RoleGuard` wraps any route in `AppRoutes.tsx` that needs a permission check. If the user lacks the permission, they get redirected.

---

## What's Missing

- Backend permission enforcement — controllers do not currently check permissions, only authentication
- A `PermissionSeeder` to seed the default permission set and assign them to roles

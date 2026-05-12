# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SK Sports Management is a monorepo with a **React + TypeScript** frontend and a **Laravel 12 (PHP)** backend connected via REST API. Authentication uses Laravel Sanctum with tokens stored in `localStorage`.

---

## Commands

### Full-Stack Dev (recommended)
Run from `backend/` — starts Laravel server, queue, log watcher, and Vite frontend concurrently:
```bash
composer run dev
```

### Frontend (`frontend/`)
```bash
npm run dev        # Vite dev server
npm run build      # Type check + production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (`backend/`)
```bash
php artisan serve          # Laravel dev server (localhost:8000)
php artisan migrate        # Run migrations
php artisan test           # Run all tests (PHPUnit)
php artisan test --filter TestName   # Run a single test
php artisan pint           # Code style fix
```

### First-time setup (from `backend/`)
```bash
composer run setup   # install deps, copy .env, key:generate, migrate, npm install + build
```

---

## Architecture

### Frontend (`frontend/src/`)

Feature-driven structure:

- **`features/`** — Domain modules (`auth`, `dashboard`, `users`, `public`). Each has `pages/` and optionally `components/`, `hooks/`, `columns.tsx`.
- **`routes/AppRoutes.tsx`** — All route definitions. Public routes use `PublicLayout`; protected routes use `ProtectedLayout` (with sidebar). `RoleGuard` wraps permission-restricted routes.
- **`providers/AuthProvider.tsx`** — Auth context: stores `user`, `token`, and `permissions` in `localStorage`. Exposes `login`, `logout`, and `hasPermission`.
- **`services/api.ts`** — Central Axios instance. Reads `VITE_API_BASE_URL` from env. Request interceptor attaches Bearer token; response interceptor handles 401 by clearing auth and redirecting to `/login`.
- **`components/ui/`** — Shadcn/Radix UI primitives (do not edit directly, use shadcn CLI to add new ones).
- **`components/shared/`** — Shared project-level components (`DataTable`, `PageHeader`, `StatusBadge`).

### Backend (`backend/`)

Standard Laravel structure with API-only setup:

- **`routes/api.php`** — All API routes. Public: `POST /login`. Authenticated (Sanctum + `active` middleware): `/logout`, `/user`, and CRUD for `/users`, `/roles`, `/seasons`, `/sports`, `/divisions`.
- **`app/Http/Controllers/`** — REST controllers. `AuthController` handles login/logout; resource controllers handle CRUD.
- **`app/Models/`** — Eloquent models. Key relationships: `User → Role → Permission` (RBAC), `Season → Sport → Division → Team → Player`.
- **`app/Http/Middleware/CheckInactivity.php`** — Logs out users after 15 minutes of inactivity.
- **`database/`** — Migrations, seeders, and factories. SQLite for dev; in-memory SQLite for tests (see `phpunit.xml`).

### Auth Flow

1. `POST /api/login` returns a Sanctum token.
2. Frontend stores token in `localStorage` via `AuthProvider`.
3. All subsequent requests attach `Authorization: Bearer <token>` via Axios interceptor.
4. `CheckInactivity` middleware enforces session expiry server-side.

### RBAC

Permissions are stored in the DB and assigned to roles (`Role → Permission` many-to-many via `permission_role`). The frontend checks permissions via `hasPermission()` from `useAuth()`, and gates routes with `RoleGuard`.

---

## Key Config

- **Frontend env**: `frontend/.env` — set `VITE_API_BASE_URL=http://localhost:8000/api`
- **Path alias**: `@` maps to `frontend/src/` (configured in `vite.config.ts` and `tsconfig.app.json`)
- **Backend env**: `backend/.env` — SQLite DB path, Sanctum config, `APP_KEY`
- **Tests use in-memory SQLite** — configured in `backend/phpunit.xml`, no migration needed for test runs

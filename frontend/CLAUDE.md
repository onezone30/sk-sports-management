# Frontend CLAUDE.md

## Stack

- React 18 + TypeScript (strict mode)
- Vite + Tailwind CSS v4
- shadcn/ui (style: `new-york`, base color: `zinc`) — Lucide icons
- TanStack React Query (configured, not yet adopted by any page)
- TanStack React Table (via `DataTable`)
- Path alias: `@` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- Env: `frontend/.env` — set `VITE_API_BASE_URL=http://localhost:8000/api`

---

## Where detailed guidance lives

This file holds the always-true rules. Depth and code examples live in on-demand skills — pull them in when the task calls for it:

| Need | Load |
|---|---|
| Copy-paste examples for shared components, styling, API calls, permission-gated UI | skill `frontend-components` |
| Scaffold a whole new feature step-by-step | `/new-feature-frontend` |
| Full project health check | `/check` |

---

## Architecture

**Feature-Sliced Design (FSD).** Code is organized into layers, each one only allowed to import from the layers *below* it:

```
app  →  pages  →  widgets  →  features  →  entities  →  shared
(top, most composed)                              (bottom, most foundational)
```

- `shared` never imports from any other layer.
- `entities` may import `shared`.
- `features` may import `entities`, `shared`.
- `widgets` may import `features`, `entities`, `shared`.
- `pages` may import `widgets`, `features`, `entities`, `shared`.
- `app` may import everything below it.

A lower layer must never import from a higher one (e.g. `shared/ui/button.tsx` must never import from `features/`). This is the rule to check first when unsure where new code belongs.

These import rules are enforced, not just documented: `npm run lint:arch` (Steiger) fails the build on a wrong-direction import — see `frontend/steiger.config.ts` for the project-specific rule tuning.

**Slices and public APIs:** within `entities/`, `features/`, and `widgets/`, each named folder (a "slice" — e.g. `entities/user`, `features/auth`, `widgets/app-nav`) exposes exactly one `index.ts` (or `index.tsx`) as its public API. Code outside the slice imports only from that `index.ts` — never reaches into `model/` or `ui/` directly. `pages/`, `shared/`, and `app/` are not sliced this way — `shared/ui/`, `shared/components/`, etc. are imported directly since there's no cross-slice boundary to protect there.

**Hard rules:**
- Always import cross-boundary with the `@/` alias — never `../../`. Relative imports are only for imports *within* the same slice (e.g. `features/auth/ui/LoginForm.tsx` importing `../model/useAuth`).
- Never edit `shared/ui/` by hand — it's shadcn-generated. Use the CLI (see below).
- Never import `axios` directly — always go through `@/shared/api/client`.
- Never read `localStorage` directly — always go through `AuthProvider` / `useAuth()` (`@/features/auth`).
- Before adding code, decide its layer: a reusable, business-agnostic primitive (a button, `cn()`, the Axios instance) → `shared`. A real-world object your app deals with (User) → `entities`. One user action (logging in) → `features`. A large composed UI block used by more than one page (the sidebar, a set of landing-page sections) → `widgets`. A route, thin and mostly composing the above → `pages`. Composition root (providers, router, layouts) → `app`.

---

## Folder Structure

```
src/
├── main.tsx                  # Vite entry point
├── app/                       # composition root
│   ├── App.tsx
│   ├── providers/             # AppProviders — QueryClientProvider, AuthProvider, BrowserRouter
│   ├── routes/                # AppRoutes.tsx, PermissionGuard.tsx
│   └── layouts/                # PublicLayout, ProtectedLayout — one per route group
├── pages/<route-name>/        # one folder per route, index.tsx composes widgets/features/entities
│   └── index.tsx
├── widgets/<name>/             # large reusable UI blocks assembled from features/entities/shared
│   ├── ui/
│   └── index.ts                # public API
├── features/<name>/            # one user action each (e.g. auth)
│   ├── model/                  # hooks, context, business logic
│   ├── ui/                     # feature-local components (e.g. LoginForm)
│   └── index.ts                 # public API
├── entities/<name>/             # business objects (e.g. user)
│   ├── model/                   # types, small display logic
│   └── index.ts                  # public API
└── shared/                       # generic, business-agnostic code
    ├── ui/                        # shadcn primitives — DO NOT edit directly
    ├── components/                 # reusable project components (DataTable, PageHeader, StatusBadge)
    ├── api/client.ts                # single Axios instance — all API calls go here
    ├── lib/utils.ts                  # cn() and other framework-agnostic helpers
    ├── hooks/                         # generic, business-agnostic hooks (shadcn CLI target)
    └── assets/                         # images, logos
```

**Adding a new feature:** create `features/<name>/model/` and `features/<name>/ui/`, then a `features/<name>/index.ts` that exports only what other layers should use. Add a `pages/<route-name>/index.tsx` that composes it, and register the route in `app/routes/AppRoutes.tsx`. See `/new-feature-frontend` for the full scaffold.

**Error / utility pages with no domain logic** still get their own `pages/<name>/index.tsx` (e.g. `pages/unauthorized/index.tsx`) — there is no separate "errors" feature.

**Current slices:**
- `entities`: `user`
- `features`: `auth`
- `widgets`: `app-nav`, `app-sidebar`, `footer`, `landing-sections`
- `pages`: `landing`, `login`, `dashboard`, `users`, `unauthorized`

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Utilities / services | camelCase | `client.ts`, `utils.ts` |
| Slice/page folders | kebab-case (single word stays lowercase) | `widgets/app-nav/`, `features/auth/` |
| Interfaces | PascalCase | `export interface User` |

- Use `.tsx` only for files that contain JSX. Use `.ts` for hooks, types, utilities, and services.
- Export components as `export default function ComponentName()` for page/layout entry points; use named exports (`export function ComponentName()`) for anything re-exported through a slice's `index.ts` — no `React.FC`.
- Define prop types inline as `interface ComponentNameProps`.

---

## Styling Rules

- Use Tailwind utility classes. Compose with `cn()` from `@/shared/lib/utils` when class logic is conditional.
- Do not write custom CSS unless absolutely necessary.
- Custom brand colors are CSS variables in `src/index.css` (OKLCH-based): primary = blue (main actions), secondary = yellow (highlights/CTAs), destructive = red (delete/error).
- Dark mode via CSS variable overrides — use semantic color tokens, not hardcoded colors.
- Responsive: mobile-first. Use `md:` / `lg:` breakpoints. Sidebar is hidden on mobile (drawer).

---

## API Calls

All requests go through `src/shared/api/client.ts`. It attaches `Authorization: Bearer <token>` from localStorage automatically and handles 401 by clearing auth state and redirecting to `/login`.

Prefer React Query (`useQuery`/`useMutation`) for new pages over manual `useState` + `useEffect` — the client is already wired up in `app/providers/index.tsx`, just not yet used anywhere (see Implementation Status).

---

## Auth & Permissions

- Use `useAuth()` from `@/features/auth` for `user`, `token`, `isLoading`, `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`.
- Gate UI elements with `hasPermission("permission.name")`.
- Gate routes with `<PermissionGuard requiredPermissions={[...]} requireAll?>` from `@/app/routes/PermissionGuard` — it redirects to `/login` if signed out, `/unauthorized` if the permission check fails.
- `ProtectedLayout` already redirects signed-out users to `/login` for every route in that group — `PermissionGuard` is for an *additional*, per-route permission check on top of that.
- Don't invent permission-name strings to gate a route — the backend doesn't seed or enforce any yet (see backend's Implementation Status). Check with the backend before wiring a real one in.
- The `User` type lives in `entities/user`; the auth context/provider/hook live in `features/auth` (not `entities/user`) because they're the stateful "session" mechanism, not just the data shape — everything above `features` (widgets, pages, app) is allowed to import from it.

---

## Layout Pattern

- Public pages → `PublicLayout` (top nav bar)
- Protected pages → `ProtectedLayout` (sidebar + main area; also enforces sign-in)
- Every protected page should start with `<PageHeader title="..." />` followed by its content.

---

## Adding shadcn Components

Use the CLI — do not write shadcn components from scratch:

```bash
npx shadcn@latest add <component>
```

`components.json` aliases point the CLI at `src/shared/ui/`, `src/shared/components/`, `src/shared/lib/`, and `src/shared/hooks/`. Do not modify generated files unless absolutely necessary.

---

## Implementation Status

| Area | Status |
|---|---|
| Auth (login/logout, session bootstrap) | Complete |
| Route-level sign-in enforcement | Complete (`ProtectedLayout`) |
| Permission-level route gating | `PermissionGuard` exists — **not applied to any route** (backend doesn't seed/enforce permissions yet) |
| Users | Complete, still on manual `useState`/`useEffect` — candidate for React Query migration |
| Dashboard | Static mock data — no live data yet |
| `/about`, `/contact` | Placeholder routes only |

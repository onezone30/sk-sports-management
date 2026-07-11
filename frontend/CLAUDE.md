# Frontend CLAUDE.md

## Stack

- React 18 + TypeScript (strict mode)
- Vite + Tailwind CSS v4
- shadcn/ui (style: `new-york`, base color: `zinc`) — Lucide icons
- TanStack React Query (configured, not yet adopted by any page)
- TanStack React Table (via `DataTable`)
- Path alias: `@` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)

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

Feature-based structure: one folder per domain, self-contained.

**Colocation rule:**
> Used by only one feature? → it lives in that feature (`features/<name>/`). Used across features, or by app infrastructure (routing, auth)? → it lives at top level.

Example: `User` stays in the global `types/`, not `features/users/`, because `AuthProvider` (a global provider) needs it for the signed-in principal — a global provider importing from a feature would invert the dependency direction.

**Hard rules:**
- Always import cross-boundary with the `@/` alias — never `../../`. Relative imports are only for intra-feature imports (a page importing its own feature-local component).
- Never edit `components/ui/` by hand — it's shadcn-generated. Use the CLI (see below).
- Never import `axios` directly — always go through `@/services/api`.
- Never read `localStorage` directly — always go through `AuthProvider` / `useAuth()`.

---

## Folder Structure

```
src/
├── features/<domain>/       # self-contained feature modules
│   ├── pages/               # route-level components
│   ├── components/          # feature-local components
│   ├── api/                 # feature-local data hooks (React Query), once adopted
│   ├── columns.tsx          # React Table column defs (colocated here)
│   └── types.ts             # feature-local types (only what's not shared)
├── components/
│   ├── ui/                  # shadcn primitives — DO NOT edit directly
│   ├── shared/               # reusable project components (DataTable, PageHeader, StatusBadge, Footer)
│   └── navigation/           # AppNav (public), AppSidebar (protected)
├── layouts/                 # PublicLayout, ProtectedLayout — one per route group
├── services/api.ts          # single Axios instance — all API calls go here
├── providers/AuthProvider.tsx
├── hooks/                   # global custom hooks (useAuth.ts, etc.)
├── lib/utils.ts             # cn() and other framework-agnostic helpers
├── types/                   # shared TypeScript interfaces (.ts, not .tsx)
└── routes/                  # AppRoutes.tsx, PermissionGuard.tsx — routing logic only
```

**Adding a new feature:** create `features/<name>/pages/` and optionally `components/`, `api/`, `columns.tsx`. Register the route in `AppRoutes.tsx`. See `/new-feature-frontend` for the full scaffold.

**Error / utility pages with no domain logic** still live in their own feature folder (e.g. `features/errors/pages/Unauthorized.tsx`) — there is no separate top-level `pages/` folder.

**Current features:** `auth`, `dashboard`, `errors`, `landing`, `users`

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Utilities / services | camelCase | `api.ts`, `utils.ts` |
| Feature folders | camelCase | `features/users/` |
| Interfaces | PascalCase | `export interface User` |

- Use `.tsx` only for files that contain JSX. Use `.ts` for hooks, types, utilities, and services.
- Export components as `export default function ComponentName()` — no `React.FC`.
- Define prop types inline as `interface ComponentNameProps`.

---

## Styling Rules

- Use Tailwind utility classes. Compose with `cn()` from `@/lib/utils` when class logic is conditional.
- Do not write custom CSS unless absolutely necessary.
- Custom brand colors are CSS variables in `src/index.css` (OKLCH-based): primary = blue (main actions), secondary = yellow (highlights/CTAs), destructive = red (delete/error).
- Dark mode via CSS variable overrides — use semantic color tokens, not hardcoded colors.
- Responsive: mobile-first. Use `md:` / `lg:` breakpoints. Sidebar is hidden on mobile (drawer).

---

## API Calls

All requests go through `src/services/api.ts`. It attaches `Authorization: Bearer <token>` from localStorage automatically and handles 401 by clearing auth state and redirecting to `/login`.

Prefer React Query (`useQuery`/`useMutation`) for new pages over manual `useState` + `useEffect` — the client is already wired up in `App.tsx`, just not yet used anywhere (see Implementation Status).

---

## Auth & Permissions

- Use `useAuth()` from `@/hooks/useAuth` for `user`, `token`, `isLoading`, `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`.
- Gate UI elements with `hasPermission("permission.name")`.
- Gate routes with `<PermissionGuard requiredPermissions={[...]} requireAll?>` from `@/routes/PermissionGuard` — it redirects to `/login` if signed out, `/unauthorized` if the permission check fails.
- `ProtectedLayout` already redirects signed-out users to `/login` for every route in that group — `PermissionGuard` is for an *additional*, per-route permission check on top of that.
- Don't invent permission-name strings to gate a route — the backend doesn't seed or enforce any yet (see backend's Implementation Status). Check with the backend before wiring a real one in.

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

This places the component in `src/components/ui/`. Do not modify generated files unless absolutely necessary.

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

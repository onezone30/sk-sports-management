# Frontend CLAUDE.md

## Stack

- React 18 + TypeScript (strict mode)
- Vite + Tailwind CSS v4
- shadcn/ui (style: `new-york`, base color: `zinc`) — Lucide icons
- TanStack React Query (configured, not yet fully adopted)
- TanStack React Table (via `DataTable`)
- Path alias: `@` → `src/`

---

## Folder Conventions

```
src/
├── features/<domain>/       # self-contained feature modules
│   ├── pages/               # route-level components
│   ├── components/          # feature-local components
│   └── columns.tsx          # React Table column defs (colocated here)
├── components/
│   ├── ui/                  # shadcn primitives — DO NOT edit directly
│   ├── shared/              # reusable project components (DataTable, PageHeader, StatusBadge)
│   ├── layouts/             # PublicLayout, ProtectedLayout
│   └── navigation/          # AppNav (public), AppSidebar (protected)
├── services/api.ts          # single Axios instance — all API calls go here
├── providers/AuthProvider.tsx
├── hooks/                   # custom hooks (useAuth, etc.)
├── types/                   # shared TypeScript interfaces
└── routes/AppRoutes.tsx     # all route definitions
```

**Adding a new feature:** create `features/<name>/pages/` and optionally `components/` and `columns.tsx`. Register the route in `AppRoutes.tsx`.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.tsx` |
| Utilities / services | camelCase | `api.ts`, `utils.ts` |
| Feature folders | camelCase | `features/users/` |
| Interfaces | PascalCase | `export interface User` |

- Export components as `export default function ComponentName()` — no `React.FC`
- Define prop types inline as `interface ComponentNameProps`

---

## Styling Rules

- Use Tailwind utility classes. Compose with `cn()` from `@/lib/utils` when class logic is conditional.
- Do not write custom CSS unless absolutely necessary.
- Custom brand colors are defined as CSS variables in `src/index.css` (OKLCH-based):
  - Primary: blue — main actions, active states
  - Secondary: yellow — highlights, CTAs
  - Destructive: red — delete/error actions
- Dark mode is supported via CSS variable overrides — use semantic color tokens, not hardcoded colors.
- Responsive: mobile-first. Use `md:` / `lg:` breakpoints. Sidebar is hidden on mobile (drawer).

---

## API Calls

All requests go through `src/services/api.ts`. Never import axios directly.

```ts
import api from "@/services/api";
const res = await api.get("/users");
```

The instance automatically:
- Attaches `Authorization: Bearer <token>` from localStorage
- Handles 401 by clearing auth state and redirecting to `/login`

Use React Query for data fetching going forward (currently adopted partially). For new pages, prefer `useQuery` / `useMutation` over manual `useState` + `useEffect`.

---

## Shared Components

| Component | Usage |
|---|---|
| `DataTable` | Generic table wrapper. Pass `columns: ColumnDef[]` and `data`. |
| `PageHeader` | Page title + description + optional action slot (`children`). Use at top of every page. |
| `StatusBadge` | Maps status strings to badge variants. Use for any status/state display. |
| `Spinner` | Loading state indicator. |

---

## Auth & Permissions

- Use `useAuth()` from `@/hooks/useAuth` to access `user`, `token`, `hasPermission()`.
- Gate UI elements with `hasPermission("permission.name")`.
- Gate routes in `AppRoutes.tsx` using `<RoleGuard permission="..." />`.
- Never read from localStorage directly — always go through `AuthProvider`.

---

## Layout Pattern

- Public pages → `PublicLayout` (top nav bar)
- Protected pages → `ProtectedLayout` (sidebar + main area)
- Every protected page should start with `<PageHeader title="..." />` followed by its content.

---

## Adding shadcn Components

Use the CLI — do not write shadcn components from scratch:

```bash
npx shadcn@latest add <component>
```

This places the component in `src/components/ui/`. Do not modify generated files unless absolutely necessary.

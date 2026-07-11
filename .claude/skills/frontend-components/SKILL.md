---
name: frontend-components
description: Copy-paste examples for shared components, styling, API calls, and permission-gated UI in sk-sports-management (React frontend). Load when writing or editing a page or component under frontend/src — using DataTable/PageHeader/StatusBadge/Spinner, styling with cn() and OKLCH tokens, fetching data, or gating UI by permission. The always-on rules live in frontend/CLAUDE.md; this skill holds the copy-paste examples.
---

# Frontend component patterns

Concrete examples for the pieces every page reaches for. The *rules* are in `frontend/CLAUDE.md` — this is the "show me the code" companion.

## Page skeleton

Every protected page starts with `PageHeader`, then its content:

```tsx
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function Teams() {
  return (
    <div className="flex-1 space-y-6">
      <PageHeader title="Teams" description="Manage league teams">
        <Button size="lg">Add Team</Button>
      </PageHeader>
      {/* content */}
    </div>
  );
}
```

## DataTable

Generic TanStack Table wrapper. Define columns in `features/<name>/columns.tsx`, pass them with the data:

```tsx
// features/teams/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Team } from "@/types/team";

export const columns: ColumnDef<Team>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];
```

```tsx
// features/teams/pages/Teams.tsx
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "../columns";

<DataTable columns={columns} data={teams} />
```

## StatusBadge

Maps a status string to a `Badge` variant — use for any status/state display instead of hand-rolling badge colors:

```tsx
import StatusBadge from "@/components/shared/StatusBadge";

<StatusBadge status={team.status} /> // "Active" | "Pending" | "Inactive" | "Suspended" | ...
```

## Spinner

The one loading primitive — don't reach for anything else:

```tsx
import { Spinner } from "@/components/ui/spinner";

{isLoading ? (
  <div className="flex h-48 items-center justify-center rounded-md border">
    <Spinner className="size-8" />
  </div>
) : (
  <DataTable columns={columns} data={data} />
)}
```

## Styling with cn() and brand tokens

Compose conditional classes with `cn()` (clsx + tailwind-merge) instead of template-string concatenation. Use the semantic tokens from `src/index.css`, not hardcoded hex/OKLCH values:

```tsx
import { cn } from "@/lib/utils";

<Button className={cn("w-full", isActive && "bg-primary text-primary-foreground")}>
```

## API calls — React Query

New pages should fetch through a colocated hook in `features/<name>/api/`, not inline `useState`/`useEffect` in the page component:

```tsx
// features/teams/api/useTeams.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Team } from "@/types/team";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Team[] }>("/teams");
      return data.data;
    },
  });
}
```

```tsx
// features/teams/pages/Teams.tsx
const { data: teams = [], isLoading } = useTeams();
```

`features/users/pages/Users.tsx` still uses manual `useState`/`useEffect` — it's a known migration candidate (see frontend CLAUDE.md's Implementation Status), not the pattern to copy for new pages.

## Permission-gated UI

Gate a button or section with `hasPermission()` from `useAuth()` — this is independent of route-level gating:

```tsx
import { useAuth } from "@/hooks/useAuth";

const { hasPermission } = useAuth();

{hasPermission("teams.delete") && (
  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
)}
```

Route-level gating (`<PermissionGuard requiredPermissions={[...]}>`) is a separate, heavier tool — see the Auth & Permissions section of `frontend/CLAUDE.md` for when it's actually safe to wire in (the backend must seed and enforce the permission first).

## Adding a shadcn primitive

```bash
npx shadcn@latest add <component>
```

Lands in `src/components/ui/`. Never hand-edit a generated file — if it's missing a variant, add it via the CLI's config or wrap it in a `components/shared/` component instead.

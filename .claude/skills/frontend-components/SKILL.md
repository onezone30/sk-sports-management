---
name: frontend-components
description: Copy-paste examples for shared components, styling, API calls, and permission-gated UI in sk-sports-management (React frontend). Load when writing or editing a page or component under frontend/src — using DataTable/PageHeader/StatusBadge/Spinner, styling with cn() and OKLCH tokens, fetching data, or gating UI by permission. The always-on rules live in frontend/CLAUDE.md; this skill holds the copy-paste examples.
---

# Frontend component patterns

Concrete examples for the pieces every page reaches for. The *rules* — including the FSD layer/import rules — are in `frontend/CLAUDE.md`; this is the "show me the code" companion.

## Page skeleton

Every protected page starts with `PageHeader`, then its content:

```tsx
// pages/teams/index.tsx
import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

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

Generic TanStack Table wrapper. Define columns colocated with the page that uses them (or in the feature that owns the data), pass them with the data:

```tsx
// pages/teams/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Team } from "@/entities/team";

export const columns: ColumnDef<Team>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];
```

```tsx
// pages/teams/index.tsx
import { DataTable } from "@/shared/components/DataTable";
import { columns } from "./columns";

<DataTable columns={columns} data={teams} />
```

## StatusBadge

Maps a status string to a `Badge` variant — use for any status/state display instead of hand-rolling badge colors:

```tsx
import StatusBadge from "@/shared/components/StatusBadge";

<StatusBadge status={team.status} /> // "Active" | "Pending" | "Inactive" | "Suspended" | ...
```

## Spinner

The one loading primitive — don't reach for anything else:

```tsx
import { Spinner } from "@/shared/ui/spinner";

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
import { cn } from "@/shared/lib/utils";

<Button className={cn("w-full", isActive && "bg-primary text-primary-foreground")}>
```

## API calls — React Query

New pages should fetch through a colocated hook (in the owning `features/<name>/model/` if it's tied to a specific action, or right next to the page if it's page-specific), not inline `useState`/`useEffect` in the page component:

```tsx
// features/teams/model/useTeams.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/client";
import type { Team } from "@/entities/team";

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
// pages/teams/index.tsx
const { data: teams = [], isLoading } = useTeams();
```

`pages/users/index.tsx` still uses manual `useState`/`useEffect` — it's a known migration candidate (see frontend CLAUDE.md's Implementation Status), not the pattern to copy for new pages.

## Permission-gated UI

Gate a button or section with `hasPermission()` from `useAuth()` — this is independent of route-level gating:

```tsx
import { useAuth } from "@/features/auth";

const { hasPermission } = useAuth();

{hasPermission("teams.delete") && (
  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
)}
```

Route-level gating (`<PermissionGuard requiredPermissions={[...]}>`, from `@/app/routes/PermissionGuard`) is a separate, heavier tool — see the Auth & Permissions section of `frontend/CLAUDE.md` for when it's actually safe to wire in (the backend must seed and enforce the permission first).

## Adding a shadcn primitive

```bash
npx shadcn@latest add <component>
```

Lands in `src/shared/ui/` (per the aliases in `components.json`). Never hand-edit a generated file — if it's missing a variant, add it via the CLI's config or wrap it in a `shared/components/` component instead.

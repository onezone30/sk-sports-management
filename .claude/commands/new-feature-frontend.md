Scaffold a new frontend feature in sk-sports-management following the feature-based folder convention. First read `frontend/CLAUDE.md` for the rules, and load the `frontend-components` skill for copy-paste examples of the pieces referenced below.

## Steps

1. Create `features/<name>/pages/<Name>.tsx` — the route-level component. Start it with `<PageHeader title="..." />` (see `frontend-components` skill for the skeleton).
2. If the feature needs a table: add `features/<name>/columns.tsx` (a `ColumnDef<T>[]` array) and render it with `<DataTable columns={columns} data={data} />` from `@/components/shared/DataTable`.
3. If the feature needs feature-local UI pieces: add `features/<name>/components/`. Reference them with relative imports (`../components/Foo`) — that's the one place relative imports are the convention, not `@/`.
4. If the feature needs data from the API: add `features/<name>/api/use<Name>.ts` wrapping `@/services/api` with `useQuery`/`useMutation` (TanStack Query is already configured in `App.tsx`). Don't call `api` directly from the page component.
5. If the feature needs types that no other feature uses: add `features/<name>/types.ts`. If the type is shared across features or by global infrastructure (providers, guards), put it in the top-level `src/types/` instead — see the colocation rule in `frontend/CLAUDE.md`.
6. Register the route in `src/routes/AppRoutes.tsx`, inside the `PublicLayout` or `ProtectedLayout` route group depending on whether it needs a signed-in user.
7. If parts of the UI should only render for certain permissions, use `hasPermission()` from `useAuth()` inline — don't reach for `<PermissionGuard>` on the whole route unless the backend has actually seeded and enforces that permission (check first; see `frontend/CLAUDE.md`'s Auth & Permissions section).

## After scaffolding

Run `npm run build` (type-check + build) to confirm nothing is broken, then `npm run dev` and click through the new route to confirm it renders under the right layout.

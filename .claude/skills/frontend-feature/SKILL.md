Scaffold a new frontend feature in sk-sports-management following Feature-Sliced Design (FSD). First read `frontend/CLAUDE.md` for the layer rules, and load the `frontend-components` skill for copy-paste examples of the pieces referenced below.

## Steps

1. Decide the layer for each piece of new code before writing it:
   - A real-world object your app deals with (its type, basic display logic) → `entities/<name>/`.
   - The feature's one user action (state, submit handlers, the form) → `features/<name>/`.
   - A big composed UI block reused by more than one page → `widgets/<name>/`.
   - The route itself, thin, mostly composing the above → `pages/<route-name>/`.
2. If the feature needs its own state/logic: add `features/<name>/model/use<Name>.ts`.
3. If the feature needs a form or other feature-local UI: add `features/<name>/ui/<Name>.tsx`. Reference other files in the same slice with relative imports (`../model/use<Name>`) — that's the one place relative imports are the convention, not `@/`.
4. Add `features/<name>/index.ts` exporting only what other layers are actually allowed to use — nothing outside the slice should import from `features/<name>/model/...` or `features/<name>/ui/...` directly.
5. If the feature needs data from the API: wrap `@/shared/api/client` with `useQuery`/`useMutation` inside `features/<name>/model/` (TanStack Query is already configured in `app/providers/index.tsx`). Don't call the API client directly from a page component.
6. If the feature needs a table: add a `columns.tsx` (a `ColumnDef<T>[]` array) colocated with the page that renders it, and render it with `<DataTable columns={columns} data={data} />` from `@/shared/components/DataTable`.
7. If the feature needs types that represent a business object other slices may also need, put them in `entities/<name>/model/types.ts` instead of inside the feature — see the layer rules in `frontend/CLAUDE.md`.
8. Create `pages/<route-name>/index.tsx` that imports from the feature's public API (`@/features/<name>`) and composes it — pages should mostly assemble, not contain logic.
9. Register the route in `src/app/routes/AppRoutes.tsx`, inside the `PublicLayout` or `ProtectedLayout` route group depending on whether it needs a signed-in user.
10. If parts of the UI should only render for certain permissions, use `hasPermission()` from `useAuth()` (`@/features/auth`) inline — don't reach for `<PermissionGuard>` on the whole route unless the backend has actually seeded and enforces that permission (check first; see `frontend/CLAUDE.md`'s Auth & Permissions section).

## After scaffolding

Run `npm run build` (type-check + build) to confirm nothing is broken, then `npm run dev` and click through the new route to confirm it renders under the right layout.

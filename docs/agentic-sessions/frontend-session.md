# Frontend session — starter prompt

Paste this into the Warp tab whose agent runs in the **frontend worktree** (branch `feat/fe-<feature>`).
Fill in the TASK line. Everything else stays.

---

You are working ONLY on the React frontend of sk-sports-management, inside this worktree. Do not touch `backend/**`.

Start by reading `frontend/CLAUDE.md` in full (especially the FSD layer/import rules). To scaffold, run the **`frontend-feature`** skill — it drives the Feature-Sliced Design flow and pulls in **`frontend-components`** (component/styling/API/permission-gating patterns) as needed.

**TASK:** <e.g. "Build the Teams page: entities/team (type + read hook), features/teams (create/edit/delete + UI), pages/teams (compose + DataTable), and register the route in app/routes/AppRoutes.tsx.">

**FILES YOU OWN** (edit freely):
- New slices under `frontend/src/entities/`, `features/`, `pages/`, `widgets/`.
- `frontend/src/app/routes/AppRoutes.tsx` to register this feature's route.

**DO NOT TOUCH** (conflict magnets — shared or mid-change elsewhere):
- Anything under `backend/**`.
- These `frontend/src/shared/**` files that are already uncommitted on main — if you need one, flag it in the merge note instead of editing: `shared/ui/button.tsx`, `shared/api/errors.ts`, `shared/api/queryClient.ts`, `shared/hooks/useFormErrors.ts`, `shared/lib/alerts.ts`.
- `frontend/package.json` / lockfiles, `frontend/components.json`.

**SHARED CONTRACT:**
- Consume the Team API shape the backend session defines. Put the `Team` type in `entities/team/model/types.ts` from that agreed shape — don't invent your own.

**WHEN DONE:**
- Run `npm run lint:arch` (Steiger — enforces FSD import direction) and `npm run build`.
- Commit on `feat/fe-<feature>`. Do NOT merge to main.

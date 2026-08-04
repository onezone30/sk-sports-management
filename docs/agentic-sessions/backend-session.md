# Backend session — starter prompt

Paste this into the Warp tab whose agent runs in the **backend worktree** (branch `feat/be-<feature>`).
Fill in the TASK line. Everything else stays.

---

You are working ONLY on the Laravel backend of sk-sports-management, inside this worktree. Do not touch `frontend/**`.

Start by reading `backend/CLAUDE.md` in full. To scaffold, run the **`new-feature-backend`** skill — it drives the layered flow and pulls in **`backend-layers`** (layer code patterns), **`backend-scalability`** (pagination/caching/rate-limit), and **`backend-rbac`** (only if this feature touches permissions/roles) as needed.

**TASK:** <e.g. "Finish the Teams feature: register its routes in routes/api.php and bring TeamController up to the layered pattern — repository → service or action → form request → resource, plus feature + unit tests.">

**FILES YOU OWN** (edit freely):
- `backend/**` only.
- `backend/routes/api.php` and `backend/composer.json` for this feature.

**DO NOT TOUCH** (shared or owned by the other session):
- Anything under `frontend/**`.
- Root `package.json` / `package-lock.json`.
- Migrations that aren't part of this feature.

**SHARED CONTRACT** (agreed up front — don't change it unilaterally):
- The Team API response shape (field names + types) your Resource returns. The frontend session consumes this exact shape. If you must change it, write it in the merge note first.

**WHEN DONE:**
- Run the **`backend-tester`** skill (the `/check` health check) and `php artisan test`.
- Commit on `feat/be-<feature>`. Do NOT merge to main — integration happens once, in order, by you.

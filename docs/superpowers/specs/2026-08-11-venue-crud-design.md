# Venue CRUD + Images — Design

Status: Approved
Date: 2026-08-11

## Context

`Venue` currently exists only as a bare model/migration/factory (`name`, `address`) with no controller logic, no layered CRUD, and nothing on the frontend. This is the project's own reference example for scaffolding a single-domain CRUD feature (see `.claude/skills/new-feature-backend`). `User` is the fully-built reference to mirror on both backend and frontend.

Scope for this spec: **Venue only.** The Player model has known gaps (empty controller, no frontend, a `teamPlayers()` relationship bug, missing casts) but is explicitly out of scope — no player changes without separate approval.

## Data Model

### `venues` table (alter existing)

- Drop `address`.
- Add `address_line` (string, nullable)
- Add `city` (string, nullable)
- Add `state` (string, nullable)
- Add `zip` (string, nullable)
- Add `capacity` (integer, nullable)
- Add `status` (string, default `active`) — cast to the existing `Status` enum (`app/Enums/Status.php`), same as `User`/`Player`.
- Add `description` (text, nullable)

### Images — reuse `attachments` (polymorphic)

The existing `attachments` table (`attachable_id`, `attachable_type`, `name`, `type`, `extension`, `size`, `url`, `uploaded_by`) is schema-only today — no code path creates rows in it. Rather than build a parallel `venue_images` table, wire this one up:

- Add `is_primary` (boolean, default `false`) to `attachments`.
- `Venue::images(): MorphMany` → `Attachment::class` via `attachable`, filtered to `type = 'image'`.
- Cap: **8 images per venue**, enforced in `VenueService` (not the DB) via a new `VenueImageLimitExceededException` (extends `Exception`, mapped to a 422 in `bootstrap/app.php`, consistent with the project's domain-exception convention).
- Exactly one image may be `is_primary = true` per venue at a time; setting a new primary unsets the previous one.

This keeps `attachments` generic enough to reuse for other entities (e.g. player photos) later without a schema change, without scope-creeping into building that now.

## Backend

Layer: `Controller → Service → Repository → Model`, single-domain (same tier as `User`; touches `Venue` + `Attachment` but `Attachment` here is a dependent detail of `Venue`, not an independent aggregate being listed/queried elsewhere — no separate `AttachmentRepository`).

- **`VenueRepositoryInterface` / `EloquentVenueRepository`** — standard CRUD (`findAll` paginated + eager-loads `images`, `findById`, `create`, `update`, `delete`), plus `addImage()`, `removeImage()`, `setPrimaryImage()` operating on `$venue->images()`. Bound in `RepositoryServiceProvider`.
- **`VenueService`**:
  - `create(array $data, array $images = [])` — stores uploaded files to the `public` disk, creates the `Venue` row, creates `Attachment` rows for each image (first image or an explicit flag becomes primary if none specified).
  - `update(Venue $venue, array $data)` — field updates only; images are managed via the dedicated endpoints below.
  - `delete(Venue $venue)` — deletes image files off disk (no DB-level cascade on a polymorphic table) then the venue.
  - `addImage(Venue $venue, UploadedFile $file)` — throws `VenueImageLimitExceededException` if already at 8.
  - `removeImage(Venue $venue, Attachment $image)`.
  - `setPrimaryImage(Venue $venue, Attachment $image)`.
- **`StoreVenueRequest` / `UpdateVenueRequest`** — `name` required, `address_line`/`city`/`state`/`zip` nullable strings, `capacity` nullable integer `min:0`, `status` via `Rule::enum(Status::class)`, `description` nullable string, `images` nullable array (max 8 items), `images.*` → `image|mimes:jpg,jpeg,png,webp|max:5120`.
- **`StoreVenueImageRequest`** — single `image` file, same mime/size rules, used by the nested image endpoint.
- **`VenueResource`** — explicit `toArray()`: all venue fields + `images` as `VenueImageResource[]`.
- **`VenueImageResource`** — `{id, url, is_primary}`.
- **`VenueController`** (`index/store/show/update/destroy`) — `store`/`update` accept multipart when images are present.
- **`VenueImageController`** (nested) — `POST /venues/{venue}/images`, `DELETE /venues/{venue}/images/{image}`, `PATCH /venues/{venue}/images/{image}` (set primary).
- **Routes**: `index`/`show` open to any signed-in user (`auth:sanctum`, `active`); `store`/`update`/`destroy` and all image endpoints behind `role:Admin` — identical gating to `users`.
- **Storage**: `Storage::disk('public')`, requires `php artisan storage:link` (not yet run in this environment). `FILESYSTEM_DISK` env stays `local`; the `public` disk is targeted explicitly per upload call.

## Frontend (Feature-Sliced Design, mirrors `entities/user` + `features/users` + `pages/users`)

- **`entities/venue`**: `Venue`/`VenueImage` types (`model/types.ts`), `useVenues()` query hook (`api/useVenues.ts`), public API via `index.ts`.
- **`features/venues`**: `useVenueMutations.ts` (`useCreateVenue`, `useUpdateVenue`, `useDeleteVenue`, `useAddVenueImage`, `useDeleteVenueImage`, `useSetPrimaryVenueImage` — each invalidates `["venues"]` on success), `VenueFormModal.tsx`, `DeleteVenueDialog.tsx`, public API via `index.ts`.
- **`pages/venues`**: `index.tsx` (mirrors `pages/users/index.tsx` — `PageHeader` → `DataTable` → modals, discriminated-union modal state), `columns.tsx` (thumbnail column showing the primary image or a placeholder, `name`, `city`/`state`, `capacity`, `status` via `StatusBadge`, actions).
- **New shared component**: `Dropzone` (or similar) under `shared/components/` — multi-file picker with previews and remove-before-submit. Generic, not venue-specific, so it's reusable later.
- **Create/edit flow**: per your choice, image upload happens in the *same step* as the create form — `VenueFormModal` submits via `FormData` (fields + `images[]`) in one request when creating. On edit, existing images are managed inline in the same modal via the nested image endpoints (add/remove/set-primary), since the venue already exists at that point.
- **Multipart gotcha**: `shared/api/client.ts` sets a default `Content-Type: application/json` on its Axios instance. The venue create/upload calls need a per-request header override (or explicit deletion of that header) so the browser sets its own multipart boundary — this must be handled in the mutation hook, not assumed to "just work."
- **Routing**: `/venues` added to `AppRoutes.tsx` (inside `ProtectedLayout`, no `PermissionGuard` — consistent with `/users`, since backend permission enforcement on routes isn't wired up yet). Nav entry added to `AppSidebar.tsx`.

## Error Handling

- Backend: standard 422 for Form Request validation failures; `VenueImageLimitExceededException` → 422 "Maximum of 8 images per venue"; 404 via route-model binding for unknown venue/image ids.
- Frontend: `VenueFormModal` reuses the existing `useFormErrors` hook for field-level errors; the dropzone surfaces inline errors for oversized files or exceeding the 8-image cap before submission where possible, and falls back to the server error on submit.

## Testing

- Backend Feature tests (`postJson`/`RefreshDatabase`, mirroring the `User` test suite's structure): `VenueControllerTest` (CRUD happy path, validation errors, role gate on mutating routes) and image-endpoint tests (upload success, cap enforcement at 9th image, delete removes both the DB row and the disk file, set-primary unsets the previous primary).
- Frontend: no test runner currently exists in this repo for FSD features (confirmed during research) — verified via `npm run build` plus manual click-through of create/edit/delete and the image gallery, per this project's existing convention for frontend changes.

## Out of Scope

- Any change to the `Player` model, its controller, or a player frontend — explicitly deferred, flagged for a future separate spec.
- S3/cloud storage — local `public` disk only, per your choice.
- Image ordering beyond "primary first" (e.g. drag-to-reorder) — not requested.

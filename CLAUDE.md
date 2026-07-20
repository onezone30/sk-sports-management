# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SK Sports Management is a monorepo with a **React + TypeScript** frontend and a **Laravel 12 (PHP)** backend connected via REST API. Authentication uses Laravel Sanctum with tokens stored in `localStorage`.

---

## Architecture

### Frontend (`frontend/src/`)

See `frontend/CLAUDE.md` for the full folder-structure diagram, naming/import conventions, and the `frontend-components` / `frontend-feature` skills for code patterns.

### Backend (`backend/`)

See `backend/CLAUDE.md` for the full architecture, layer rules, and folder structure.

### RBAC

Permissions are stored in the DB per-user (`permission_user`, the live table) with `permission_roles` as the default template per role — see `backend-rbac` skill for the source-of-truth model. The frontend checks permissions via `hasPermission()` from `useAuth()`, and can gate routes with `PermissionGuard`. Note: the backend doesn't seed or enforce any permissions yet, so no route is actually gated by one today — sign-in enforcement (`ProtectedLayout` redirecting to `/login`) is the only active guard.

---

## Key Config

See `frontend/CLAUDE.md` and `backend/CLAUDE.md` for environment setup.

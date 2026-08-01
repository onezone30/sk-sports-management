# API Reference

Base URL: `http://localhost:8000/api`

All authenticated requests require:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /login
Public. No token required. Rate-limited to 5 attempts/minute per IP (`throttle:5,1`).

**Request**
```json
{ "email": "string", "password": "string" }
```

**Response 200**
```json
{
  "user": {
    "id": 1, "name": "...", "email": "...",
    "role": { "id": 1, "name": "Admin" },
    "status": { "value": "active", "label": "Active", "variant": "default" },
    "created_at": "2026-07-31 10:22:00"
  },
  "access_token": "<sanctum-token>",
  "token_type": "Bearer"
}
```

**Response 401** — invalid credentials (`{ "message": "Invalid login details." }`)

**Response 403** — account status is not `active` (`{ "message": "This account is not active. Contact an administrator." }`)

**Response 429** — too many attempts

---

### POST /logout
Auth required.

**Response 200**
```json
{ "message": "Successfully logged out" }
```

---

### GET /user
Auth required. Returns the currently authenticated user.

**Response 200** — User object

---

## Users

All routes require auth + `active` middleware. `store`, `update`, and `destroy`
additionally require `role:Admin` — a temporary stopgap until real permission
checks land (see backend's Implementation Status). A non-Admin gets **403**.

All routes accept both `PUT` and `PATCH` for updates (Laravel `apiResource` registers both); examples below use `PATCH`.

Request bodies take `status` as a plain string (see below). Responses (and the
`/login` response above) return it as an object — `{ "value": "active", "label": "Active",
"variant": "default" }` — so the frontend doesn't need its own value → label/badge mapping.

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | /users | List all users | any signed-in user |
| POST | /users | Create a user | Admin |
| GET | /users/{id} | Get a user | any signed-in user |
| PATCH | /users/{id} | Update a user | Admin |
| DELETE | /users/{id} | Delete a user | Admin |

**POST /users — Request body**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min:8)",
  "role_id": "integer (required)",
  "status": "string (active|inactive|archived|done, optional)"
}
```

**PATCH /users/{id} — Request body**
All fields are optional (`sometimes`).
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role_id": "integer",
  "status": "string (active|inactive|archived|done)"
}
```

---

## Roles

All routes require auth + `active` middleware. `store`, `update`, and `destroy`
additionally require `role:Admin`. `index`/`show` responses are paginated and
wrapped in `data` (same shape as `/users`).

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | /roles | List all roles (paginated) | any signed-in user |
| POST | /roles | Create a role | Admin |
| GET | /roles/{id} | Get a role | any signed-in user |
| PATCH | /roles/{id} | Update a role | Admin |
| DELETE | /roles/{id} | Delete a role | Admin |

**POST /roles — Request body**
```json
{
  "name": "string (required, unique)",
  "description": "string (nullable)",
  "status": "string (active|inactive|archived|done, optional)"
}
```

**DELETE /roles/{id} — Response 409** — role still has users assigned to it
(`{ "message": "Role with ID {id} is still assigned to one or more users and cannot be deleted." }`)

---

## Seasons

| Method | Path | Description |
|--------|------|-------------|
| GET | /seasons | List all seasons |
| POST | /seasons | Create a season |
| GET | /seasons/{id} | Get a season |
| PATCH | /seasons/{id} | Update a season |
| DELETE | /seasons/{id} | Delete a season |

**POST /seasons — Request body**
```json
{
  "chairman_id": "integer (required, must exist in users)",
  "name": "string (required)",
  "year": "integer (required, 4 digits)",
  "start_date": "date (required)",
  "end_date": "date (required, >= start_date)",
  "status": "string (required)"
}
```

---

## Sports

| Method | Path | Description |
|--------|------|-------------|
| GET | /sports | List all sports |
| POST | /sports | Create a sport |
| GET | /sports/{id} | Get a sport |
| PATCH | /sports/{id} | Update a sport |
| DELETE | /sports/{id} | Delete a sport |

**POST /sports — Request body**
```json
{
  "season_id": "integer (required, must exist in seasons)",
  "name": "string (required) — must be a valid SportsType value",
  "category": "string (required) — 'team' or 'individual'",
  "max_players_per_team": "integer (required, min:1)",
  "status": "boolean (required)"
}
```

Valid `name` values: `basketball`, `volleyball`, `mobile_legends`, `chess`, `badminton`

---

## Divisions

| Method | Path | Description |
|--------|------|-------------|
| GET | /divisions | List all divisions |
| POST | /divisions | Create a division |
| GET | /divisions/{id} | Get a division |
| PATCH | /divisions/{id} | Update a division |
| DELETE | /divisions/{id} | Delete a division |

**POST /divisions — Request body**
```json
{
  "sport_id": "integer (required)",
  "name": "string (required)",
  "min_age": "integer (required)",
  "max_age": "integer (required)"
}
```

---

## Not yet routed

These controllers exist but have no routes yet:
- `TeamController` — teams CRUD
- `PlayerController` — players CRUD

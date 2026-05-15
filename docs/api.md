# API Reference

Base URL: `http://localhost:8000/api`

All authenticated requests require:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /login
Public. No token required.

**Request**
```json
{ "email": "string", "password": "string" }
```

**Response 200**
```json
{
  "user": { "id": 1, "name": "...", "email": "...", "role_id": 1 },
  "access_token": "<sanctum-token>",
  "token_type": "Bearer"
}
```

**Response 401** — invalid credentials

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

All routes require auth + `active` middleware.

| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List all users |
| POST | /users | Create a user |
| GET | /user/{id} | Get a user |
| PATCH | /user/{id} | Update a user |
| DELETE | /user/{id} | Delete a user |

**POST /users — Request body**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min:8)",
  "role_id": "integer (required)"
}
```

**PATCH /user/{id} — Request body**
All fields are optional (`sometimes`).
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role_id": "integer"
}
```

---

## Roles

| Method | Path | Description |
|--------|------|-------------|
| GET | /roles | List all roles |
| POST | /roles | Create a role |
| GET | /role/{id} | Get a role |
| PATCH | /role/{id} | Update a role |
| DELETE | /role/{id} | Delete a role |

**POST /roles — Request body**
```json
{
  "name": "string (required, unique)",
  "description": "string (nullable)",
  "status": "string"
}
```

---

## Seasons

| Method | Path | Description |
|--------|------|-------------|
| GET | /seasons | List all seasons |
| POST | /seasons | Create a season |
| GET | /season/{id} | Get a season |
| PATCH | /season/{id} | Update a season |
| DELETE | /season/{id} | Delete a season |

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
| GET | /sport/{id} | Get a sport |
| PATCH | /sport/{id} | Update a sport |
| DELETE | /sport/{id} | Delete a sport |

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
| GET | /division/{id} | Get a division |
| PATCH | /division/{id} | Update a division |
| DELETE | /division/{id} | Delete a division |

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

# Database Schema

## Entity Hierarchy

```
Season
└── Sport (season_id)
    └── Division (sport_id)
        └── Team (division_id)
            └── TeamPlayer pivot (team_id + player_id)
                └── Player

Venue (standalone — referenced by Game)
Game (home_team_id + away_team_id + venue_id)
PlayerStats (player_id + game_id)

Role → User (role_id)
Permission ←→ Role (permission_roles pivot)
```

---

## Tables

### roles
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | string | unique |
| description | string | nullable |
| status | string | default: `active` |

Seeded values: `Admin`, `Coach`, `Manager`, `Player`, `Spectator`

---

### users
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | string | |
| role_id | FK → roles | cascades on delete |
| email | string | unique |
| password | string | bcrypt hashed |
| email_verified_at | timestamp | nullable |

---

### seasons
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| chairman_id | FK → users | the admin who owns the season |
| name | string | nullable |
| year | year | e.g. 2026 |
| start_date | date | nullable |
| end_date | date | nullable |
| status | string | default: `active` |

`chairman_id` — the admin/manager overseeing this season. Not a generic "handler" — it's specifically the chairman role.

---

### sports
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| season_id | FK → seasons | a sport exists within a season |
| name | string (SportsType enum) | see valid values below |
| category | string | `team` or `individual` |
| max_players_per_team | integer | |
| status | string | default: `active` |

Valid `name` values (SportsType enum):

| Value | Category |
|-------|----------|
| `basketball` | team |
| `volleyball` | team |
| `mobile_legends` | team |
| `chess` | individual |
| `badminton` | individual |

Each sport type also defines its stat keys — see `SportsType::stats()` in `app/Enums/SportsType.php`.

---

### divisions
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| sport_id | FK → sports | |
| name | string | e.g. `Junior`, `Senior` |
| min_age | integer | |
| max_age | integer | |
| gender_requirement | string | nullable |
| status | string | default: `active` |

---

### teams
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| handler_id | FK → users | the coach/manager responsible for this team |
| division_id | FK → divisions | |
| name | string | nullable |
| slug | string | unique |
| street | string | nullable — team's home address |
| description | string | nullable |

`handler_id` — not the same as `chairman_id` on seasons. A handler is the coach or manager directly managing a team.

---

### players
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| first_name | string | |
| last_name | string | |
| date_of_birth | date | used to validate age against division min/max_age |
| status | string | default: `active` |

Players are not tied to a team directly — the `team_players` pivot handles that.

---

### team_players (pivot)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| player_id | FK → players | |
| team_id | FK → teams | |
| jersey_number | string | nullable |
| position | string | nullable |
| is_captain | boolean | default: false |
| status | string | default: `active` |

Unique constraint on `(player_id, team_id)` — a player can appear in multiple teams, but only once per team.

---

### venues
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | string | |
| address | string | nullable |

---

### games
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| home_team_id | FK → teams | |
| away_team_id | FK → teams | |
| venue_id | FK → venues | nullable |
| player_of_the_game_id | FK → players | nullable — set after game ends |
| home_score | integer | default: 0 |
| away_score | integer | default: 0 |
| status | string | default: `inactive` |
| scheduled_at | datetime | |

---

### player_stats
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| player_id | FK → players | |
| game_id | FK → games | |
| stats | json | shape depends on sport — see SportsType::stats() |
| games_played | integer | default: 0 |

---

### permissions
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | string | unique |
| description | string | nullable |

### permission_roles (pivot)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| permission_id | FK → permissions | |
| role_id | FK → roles | |

---

## Status Values (ActiveStatus enum)

| Value | Meaning |
|-------|---------|
| `active` | Currently running / in use |
| `inactive` | Not started or paused |
| `archived` | Historical, no longer active |
| `done` | Completed |

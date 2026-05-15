# Business Logic

Non-obvious rules that aren't clear from reading the code alone.

---

## Why Sport belongs to Season (not Season to Sport)

A season is not "the basketball season" globally — it's a specific competition event that includes one or more sports. The same sport (e.g. basketball) can appear in multiple seasons independently.

**Wrong mental model:** Sport is a template; Season attaches to it.
**Correct mental model:** Season is the event; Sport is what gets played at that event.

Cascade: deleting a Season deletes its Sports, which deletes their Divisions, which deletes their Teams.

---

## chairman_id vs handler_id

Two different FK columns pointing to `users`, with different purposes:

- `seasons.chairman_id` — the admin/official who owns and oversees the entire season
- `teams.handler_id` — the coach or manager directly responsible for a specific team

Don't mix them up. A Chairman sets up the competition. A Handler runs a team within it.

---

## Game Status Values

Games use `ActiveStatus` but only two values are meaningful:

| Status | Meaning |
|--------|---------|
| `inactive` | Scheduled, not yet played — the default |
| `active` | Currently in progress |
| `done` | Finished — scores are final |
| `archived` | Cancelled or removed from standings |

`player_of_the_game_id` should only be set when status is `done`.

---

## Player age vs Division age

A player's `date_of_birth` determines which division they're eligible for based on `divisions.min_age` and `divisions.max_age`. This validation is not enforced in the current controllers — it's a business rule that needs to be added when registering a player to a team.

---

## TeamPlayer pivot — what each field means

- `jersey_number` — displayed on the player's uniform; not unique across the whole league, only meaningful per team
- `position` — their role in the team (e.g. point guard, setter)
- `is_captain` — only one captain per team is expected, but not enforced by a DB constraint
- `status` — whether the player is currently active on that team roster

---

## player_stats.stats (JSON)

The shape of `stats` depends on the sport being played. Each `SportsType` enum case defines its expected stat keys via `SportsType::stats()`.

| Sport | Stat keys |
|-------|-----------|
| basketball | points, rebounds, assists, steals, blocks |
| volleyball | kills, assists, aces, blocks, digs |
| mobile_legends | kills, deaths, assists, hero |
| chess | wins, losses, draws, rating |
| badminton | matches_won, matches_lost, sets_won, sets_lost |

There is no schema-level validation on this JSON — it's the application's responsibility to write the correct shape.

---

## CheckInactivity Middleware

Located at `app/Http/Middleware/CheckInactivity.php`.

Logs out the user if their last activity was more than **15 minutes** ago. This is enforced server-side on every request to authenticated routes. The frontend does not need to manage session timers.

---

## Seeded Dev Accounts

| Email | Password | Role |
|-------|----------|------|
| admin | admin | Admin |
| coach1@sports.com | password | Coach |
| coach2@sports.com | password | Coach |

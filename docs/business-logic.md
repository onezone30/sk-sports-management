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

Games use `Status` but only two values are meaningful:

| Status | Meaning |
|--------|---------|
| `inactive` | Scheduled, not yet played — the default |
| `active` | Currently in progress |
| `done` | Finished — scores are final |
| `archived` | Cancelled or removed from standings |

`player_of_the_game_id` should only be set when status is `done`.

---

## Player age vs Division age

A player's `date_of_birth` determines which division they're eligible for based on `divisions.min_age` and `divisions.max_age`. This validation is not enforced in the current controllers — it's a business rule that needs to be added when registering a player to a team. `Player::age` is a computed accessor (never a stored column) for exactly this purpose.

---

## Why height/weight live on team_players, not players

A player's height and weight aren't permanent facts about them — they change as someone grows or trains — and they're sport-specific (meaningless for chess or Mobile Legends). `players` is deliberately sport-agnostic (see `docs/overview.md`'s guiding principles), so these columns live on the `team_players` pivot instead, recorded per team-roster registration. That makes them naturally time-scoped: a player's height at 15 doesn't overwrite their height at 19.

---

## Duplicate player prevention

`players` has a unique constraint on `(first_name, last_name, date_of_birth)`, enforced both in the DB and in `StorePlayerRequest`/`UpdatePlayerRequest` via a `withValidator` check (not a plain `Rule::unique()` — see the comment in those classes for why: the `date_of_birth` column is stored with a full datetime format, so a raw string comparison misses matches that `whereDate()` catches correctly). The same person being registered twice would silently split their stats across two player records — this constraint is a deliberate guard against that, not an obscure edge case.

---

## Deleting a player with recorded history

Both `team_players` and `player_stats` reference `players` and previously cascade-deleted with it — meaning deleting a player would silently wipe a season's worth of roster history and stats. `PlayerService::delete()` now checks for either before deleting and throws `PlayerInUseException` (mapped to a 409 in `bootstrap/app.php`), mirroring `RoleInUseException`'s pattern for roles still assigned to users.

---

## Players have no login

Unlike `docs/overview.md`'s long-term vision (players eventually seeing their own team/schedule/stats), `players` is intentionally **not** linked to `users` — no `user_id` column, no player accounts. This was an explicit scope decision, not an oversight: player self-service login is a separate feature to design later, not a side effect of building Players CRUD.

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

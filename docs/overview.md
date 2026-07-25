# Project Overview

Non-technical. This doc is about *why* this project exists and *what* it's meant to become — not how it's built. For the technical side, see `docs/api.md`, `docs/schema.md`, `docs/rbac.md`, and `docs/business-logic.md`.

---

## Elevator Pitch

The **Sports Management System** is a platform for running a multi-sport league — from setting up a season to tracking who won. One place to manage seasons, teams, players, games, and stats, instead of spreadsheets, group chats, and paper.

---

## The Problem

League organizers today mostly run things manually:

- Team rosters live in spreadsheets that go out of date the moment someone gets injured or transfers.
- Standings are calculated by hand after every game night.
- Player stats, if tracked at all, are scattered across notebooks or someone's phone.
- There's no single place a coach, a player, or a fan can check to see "what's actually going on right now."

The result: organizers spend more time on admin busywork than on running a good league, and everyone else is stuck asking around for information that should just be visible.

---

## What It Is (The Solution)

A single system that covers a season end to end:

1. Set up a **season** and decide which **sports** are being played.
2. Organize each sport into **divisions** (e.g. by age group or skill level).
3. Register **teams** and their **players** into those divisions.
4. Schedule and score **games**.
5. Track **stats** and let **standings** update automatically as results come in.

Nobody re-computes a standings table by hand. Nobody texts the coach to ask who's on the roster. It's all in one place, and it's always current.

---

## Who It's For

- **League admins / chairmen** — set up and oversee the whole competition: seasons, sports, divisions. They own the structure everyone else operates inside of.
- **Coaches / team handlers** — manage their own team: roster, players, jersey numbers, who's captain, who's active. They run their corner of the league, not the whole thing.
- **Players** — see their team, their schedule, and their own stats. They shouldn't need to ask anyone for this.
- **Spectators / public** — follow standings, scores, and results without needing an account or asking around.

Each group sees only what's relevant to them, but everyone is looking at the same underlying data.

---

## Goals & Definition of Success

Success here means three things are true at once, not just one:

- **Real-world:** A real league could run a full season on this, start to finish, without falling back to a spreadsheet.
- **Craft:** The codebase itself is clean and maintainable enough to hand to another developer or show off — proof of solid engineering, not just a working demo.
- **Personal:** It gets finished, every part of it is understood (not copy-pasted blind), and it leaves the builder a better developer than before starting.

If any one of these is missing, the project isn't done — a working-but-messy app doesn't count, and neither does clean code that never ships a real feature.

---

## Guiding Principles

- **Flexible & configurable.** Nothing should be hardcoded to one specific league's quirks. A new league operator should be able to adopt this without needing custom code written for them.
- **Multi-sport by design.** Basketball, volleyball, chess, badminton, and mobile legends today — team sports and individual sports both. Adding another sport should be a configuration change, not a rebuild.
- **Clean and maintainable, on purpose.** This doubles as a portfolio piece, so shortcuts that hurt long-term clarity aren't worth taking even when they'd be faster.
- **One source of truth.** Whatever the admin, the coach, the player, and the public are looking at, it's the same real data — not four different copies drifting out of sync.

---

## Scope

**In scope:**
- Season setup and management
- Sport, division, and team configuration
- Player registration and rosters
- Game scheduling and scoring
- Stat tracking per sport
- Automatic standings
- Role-based access (admins, coaches, players, public each see what they should)

**Not now (deliberately out of scope):**
- Payments, registration fees, or billing
- Live video streaming of games
- Native mobile apps
- Ticketing or event check-in

These aren't rejected forever — they're just not what this project is trying to prove right now. Keeping them out keeps the scope honest and finishable.

---

## Core Concepts (Glossary)

Plain-language definitions of the vocabulary used across the app and its docs:

| Term | Meaning |
|---|---|
| **Season** | A specific competition event (e.g. "2026 Summer League"). Not a sport itself — a season *includes* one or more sports. |
| **Sport** | A game being played within a season (basketball, volleyball, chess, badminton, mobile legends). The same sport can appear independently in different seasons. |
| **Division** | A grouping within a sport, typically by age or skill level, with its own eligibility rules. |
| **Team** | A group of players competing together within a division. |
| **Player** | An individual athlete, registered to a team roster. |
| **Roster** | The current list of players on a team, including things like jersey number and captain status. |
| **Game** | A single scheduled match between teams (or individuals, for solo sports), with a status (scheduled, in progress, finished, or cancelled) and eventually a result. |
| **Chairman** | The admin/official who owns and oversees an entire season. Sets up the competition. |
| **Handler** | The coach or manager responsible for one specific team. Runs a team within the competition the Chairman set up. |
| **Stats** | Performance numbers for a game, shaped differently per sport (e.g. points/rebounds/assists for basketball, kills/deaths/assists for mobile legends). |
| **Standings** | The current ranking of teams or players within a division, calculated automatically from game results. |

---

## The Vision (Where It's Going)

The long-term ambition isn't "an app for one league" — it's a system polished and flexible enough that a different league operator could pick it up and run their own competition on it with minimal setup. Multi-sport support, configurable divisions, and role-based access all exist in service of that: the more the system adapts to how a league already works (rather than forcing the league to adapt to it), the more realistic it is to eventually pitch this to real organizers running real leagues — potentially more than one league at a time down the road.

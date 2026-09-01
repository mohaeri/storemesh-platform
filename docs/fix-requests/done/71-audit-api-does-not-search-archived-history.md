# Fix Request 71 — Completion Report

Status: COMPLETE

## Part 1 results — archived audit repository query

- Added a read-only PostgreSQL query for `event_history_archive` rows whose `event_kind` is `AUDIT`.
- The archived `to_jsonb` row payload is normalized back to the same camel-case Event envelope returned for live audit events, including sequence and schema version.
- Existing archival retention and move behavior was not changed.

## Part 2 results — additive audit API behavior

- `GET /api/audit` without query parameters remains live-only and keeps its existing response shape.
- `GET /api/audit?includeArchived=true` merges live and archived events, deduplicates by event ID, and orders them chronologically with sequence as the tie-breaker.
- Non-PostgreSQL repositories safely return the existing live collection because no archive reader is present.

## Part 3 results — contracts and web delivery

- OpenAPI now documents the optional boolean `includeArchived` query parameter, defaulting to false, and the common Event envelope.
- The web audit console requests `includeArchived=true`, so archived accountability history is visible through the existing screen.

## Part 4 results — real PostgreSQL verification

- The targeted test created and persisted an audit event, backdated its audit/outbox rows, and forced the existing archive operation to move both rows.
- A repository reload confirmed the event was absent from the live table.
- The default HTTP query excluded the archived event while retaining a live login event; the opt-in query returned both and verified identical event field topology.

## Final verification

Backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations 001–066 applied.

- Targeted backend PostgreSQL/HTTP: **1 passed, 0 failed, 0 skipped**.
- Targeted web: **1 passed, 0 failed, 0 skipped**.
- Targeted contracts: **1 passed, 0 failed, 0 skipped**.
- Backend full: **499 passed, 0 failed, 0 skipped**.
- Web full: **85 passed, 0 failed, 0 skipped**.
- Contracts full: **60 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **155 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `60850038d6bf0d90d7f1f79a1fd715138ca33661` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `5b3009ec0a24c6389bd10d909c8e8e6d9f39f165` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `6a42bc865b131d97acf327f7a30dcc41f788fd65` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform baseline before this report: `88a99d5ba23b869656f1c0c37c169b677d82ce81`; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees are clean after commit and push, with local HEAD matching their tracked remote branch.
- Platform retains only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

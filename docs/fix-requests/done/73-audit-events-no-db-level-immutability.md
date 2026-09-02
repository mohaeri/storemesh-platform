# Fix Request 73 — Completion Report

Status: COMPLETE

## Part 1 results — database-enforced append-only history

- Added migration `068_audit_history_immutability.sql` with a shared row-level trigger function for `audit_events` and `event_history_archive`.
- UPDATE is always rejected with PostgreSQL error code `55000`.
- DELETE is rejected unless the current transaction has `app.archiving=on`.
- Migration 068 was applied successfully after migrations 001–067 on the real PostgreSQL database.

## Part 2 results — transaction-local archival guard

- `archiveHistory()` now issues `SET LOCAL app.archiving = 'on'` immediately after `BEGIN`, using the same checked-out client and transaction as the existing archive move.
- The existing DELETE/RETURNING-to-archive mechanism was otherwise unchanged.
- COMMIT and ROLLBACK automatically clear the guard; the regression test confirms a later unguarded DELETE is rejected.

## Part 3 results — protected archive and outbox exclusion

- `event_history_archive` rejects unguarded UPDATE and DELETE while continuing to accept the existing INSERT-based archive flow.
- `outbox_events` received no trigger or immutability change. Its legitimate status, attempt-count, delivery-time updates and retention deletes remain supported exactly as required.
- No route, request, or response shape changed; contracts and web required no code changes.

## Part 4 results — real PostgreSQL verification

- A normal repository audit INSERT succeeded.
- Direct unguarded UPDATE and DELETE attempts against `audit_events` failed and the stored row remained unchanged.
- The normal archive move succeeded, after which direct unguarded UPDATE and DELETE attempts against the archived audit row failed and its payload remained unchanged.
- A guarded bare DELETE succeeded inside its transaction; a fresh unguarded DELETE after COMMIT failed, proving the setting did not leak.
- PostgreSQL test teardown paths that intentionally remove test history now use the same transaction-local guard.

## Final verification

Backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations 001–068 applied.

- Targeted backend PostgreSQL and archive regressions: **8 passed, 0 failed, 0 skipped**.
- Backend full: **501 passed, 0 failed, 0 skipped**.
- Web full: **85 passed, 0 failed, 0 skipped**.
- Contracts full: **60 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **155 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `7a06f54a77345b4b9a8eac796299a68ea7357f3d` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web (verified unchanged): `5b3009ec0a24c6389bd10d909c8e8e6d9f39f165` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts (verified unchanged): `6a42bc865b131d97acf327f7a30dcc41f788fd65` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform baseline before this updated report: `531866466b8002d650847602a6e59a0fa7be67e6`; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts tracked working trees are clean after commit and push, with local HEAD matching their tracked remote branch.
- Platform retains only pre-existing untracked coordination/review files outside this tracked report; none were included in the commit.
- The original open request remains present with the locally coordinated transaction-guard decision and was not committed, edited by Codex, or removed.

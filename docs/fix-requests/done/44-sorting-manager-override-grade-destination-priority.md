# Fix Request 44 — Completion report

## Part A — Grade override

- Added manager-only `batch:override` authorization and `POST /api/batches/{id}/override-grade`.
- A non-empty reason and a meaningful production state are required.
- The immutable audit entry snapshots the old/new grade and reason.

## Part B — Destination override

- Added manager-only `POST /api/batches/{id}/override-destination` for SORTED/WASHED batches.
- The old active downstream task is cancelled with history and exactly one task is generated for the replacement destination.
- Added `CANCELLED` to the durable task status constraint.

## Part C — Sorting priority

- Added manager-only `POST /api/batches/{id}/priority` with NORMAL/HIGH/URGENT and mandatory reason.
- Batch priority is persisted and propagated to its assigned physical container, so FR43 recommendation ordering consumes it.

## Verification

Real PostgreSQL 16 was used with `DATABASE_URL` set; migration 057 was applied.

- backend: 407 tests / 407 pass / 0 fail / 0 skipped
- web: 65 tests / 65 pass / 0 fail / 0 skipped
- contracts: 35 tests / 35 pass / 0 fail / 0 skipped
- route parity: 128 method + route templates verified

## Commits and PRs

- site-server: `afd80cd` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `b002cfb` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `1a4af54` — https://github.com/mohaeri/storemesh-contracts/pull/8

All three implementation repositories were clean after commit and push.

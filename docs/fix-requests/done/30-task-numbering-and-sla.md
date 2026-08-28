# Fix Request 30 — Completion report

Status: complete and pushed.

## Part A — Human-readable task numbers

- Added the shared `nextTaskCode()` generator using the site-prefixed `T-{site}-{sequence}` format.
- Enforced code assignment for every task construction path, including manual, automatic, delivery, shipment, and QC/rework tasks.
- Added PostgreSQL migration `046_task_numbering_sla.sql`, including backfill and a per-site unique index.
- Regression coverage proves manual and automatic codes are sequential and collision-free.

## Part B — SLA and overdue tracking

- Added optional persisted `dueAt` and `expectedDurationMinutes` fields to manual and automatic tasks.
- Chose a derived `overdue` read field because overdue status depends on current time and task status; deriving it prevents stale stored flags and avoids requiring a background sweep.
- `overdue` is true only for an `OPEN` task whose due date is in the past. Completed tasks and tasks without a due date are not flagged.
- PostgreSQL reload coverage confirms task code and SLA fields survive persistence.
- Web task creation captures both SLA fields; cards display code, due date, expected duration, and a visible overdue treatment.
- OpenAPI documents all additive request/response fields.

## Verification

Real PostgreSQL 17 was running and `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25` was set.

- Backend full suite: `356 tests / 356 pass / 0 fail / 0 skipped`.
- FR30 focused suite: `3 tests / 3 pass / 0 fail / 0 skipped`, including a real PostgreSQL save/reload.
- Web: `55 tests / 55 pass / 0 fail / 0 skipped`.
- Contracts: `21 tests / 21 pass / 0 fail / 0 skipped`; route parity verified `117 method + route templates`.
- Terminal regression baseline: `17 tests / 17 pass / 0 fail / 0 skipped` (no terminal changes).

## Commits and PRs

- site-server: `71208f013fd11bd6a01c0f91975980dbe728c630` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `41274fc43ee8c0df69f968d71e9a1c173033b837` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `23fa15bcad566c86f9fd1448fcf25f63bac8422a` — https://github.com/mohaeri/storemesh-contracts/pull/8

All three implementation branches were pushed to `origin/feat/addendum-01-fix-request-07`. Their working trees are clean. The terminal repository was unchanged and clean.

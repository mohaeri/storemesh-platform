# Fix Request 62 — Completion Report

Status: COMPLETE

## Part 1 results

- Added `agingDays(batch)`, calculated as whole days since the latest movement into the batch's current zone, with `createdAt` as the fallback.
- A move into a new zone resets the computed dwell age; total lifetime is not used.
- Focused backend verification: **3 passed, 0 failed, 0 skipped**.

## Part 2 results

- Added the dedicated `STORAGE` configuration scope and validated positive-number `agingWarningDaysByZone` maps.
- Inventory reads lazily raise one `STORAGE_AGING_WARNING` per qualifying batch and do not warn within tolerance or for unconfigured zones.
- Sites without an active threshold retain prior behavior.

## Part 3 results

- Inventory responses now expose `agingDays` and `agingWarning`.
- The web inventory table displays storage age, sorts oldest dwell time first, marks qualifying rows «در حال پیرشدن», and exposes `STORAGE` in configuration scope selection.
- OpenAPI documents the inventory fields, warning behavior, and STORAGE configuration field.

## Final verification

Real PostgreSQL 17 was initialized locally, migrations 001 through 066 were applied, and backend tests ran with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh`.

- Backend full: **486 passed, 0 failed, 0 skipped**.
- Web full: **82 passed, 0 failed, 0 skipped**.
- Contracts full: **57 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **153 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `e09dc9f102d755c8f6002488e05e05be9aca0515` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `ff1d27633c16f19659bf745600d49d3d116acd57` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `ac1133ff771e2a86f70f789a062332f14b077275` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform: this completion report is committed on the same branch; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees were clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- The platform repository retained only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

# Fix Request 41 — Completion Report

Status: completed, committed, and pushed.

## Part A — Harvest-period provenance

- Child-producing `MERGE` now stores a deduplicated `harvestPeriods` array assembled from every parent's complete provenance.
- The existing scalar `harvestPeriod` remains populated for backward compatibility.
- Migration `052_harvest_periods_and_cycle_input.sql` adds and backfills durable PostgreSQL storage.
- Tests cover different and identical parent periods and real PostgreSQL reload.

## Part B — Batch-based FREEZE_DRY and DRY cycle input

- `FREEZE_DRY` and `DRY` can start from validated `batchIds` plus positive `inputWeightKg`, without scanning each tray/container.
- Batch status, operational zone, usability, uniqueness, available weight, and active-cycle exclusivity are enforced server-side.
- Existing scanned-carrier flows remain supported.
- `FREEZE` still requires a physical tray scan and its single-batch tray rule is unchanged.
- Cycle input weight and batch identities persist through PostgreSQL reload.
- The web production form and OpenAPI contract were updated in the same round.

## Verification

- Backend focused tests against real PostgreSQL: **8 tests / 8 pass / 0 fail / 0 skipped**.
- Backend full suite against real PostgreSQL (`DATABASE_URL` set): **395 tests / 395 pass / 0 fail / 0 skipped**.
- Web: **62 tests / 62 pass / 0 fail / 0 skipped**.
- Contracts: **31 tests / 31 pass / 0 fail / 0 skipped**.
- Route parity: **123 method + route templates verified**.

## Commits and pull requests

- `storemesh-site-server`: `a9b853d` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-web`: `a184635` — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: `fe4257c` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation repository working trees were clean after commit and push. The terminal was not affected.

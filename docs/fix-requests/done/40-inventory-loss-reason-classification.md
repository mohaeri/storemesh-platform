# Fix Request 40 — Completion Report

Status: completed, committed, and pushed.

## Part A — Sorting loss classification

- Non-zero sorting loss now requires one fixed reason: `WASTE`, `DAMAGE`, `MOISTURE_LOSS`, `RESIDUAL_MATERIAL`, or `MEASUREMENT_VARIANCE`.
- Missing and invalid reasons are rejected with `SORT_LOSS_REASON_REQUIRED` and `SORT_LOSS_REASON_INVALID`.
- Zero-loss sorting remains valid without a reason.
- The selected reason is persisted with the batch and survives PostgreSQL reload.

## Part B — Sorting loss report and UI

- Added authenticated `GET /api/reports/sorting-loss`, gated by `inventory:read`.
- The report aggregates total loss and event count by site, product, and loss reason.
- The web sorting form captures and submits the fixed loss reason and displays the aggregate report.
- OpenAPI and contract coverage were updated in the same round.

## Verification

- Backend, full suite against real PostgreSQL (`DATABASE_URL` set): **391 tests / 391 pass / 0 fail / 0 skipped**.
- Backend focused classification/reload tests against real PostgreSQL: **27 tests / 27 pass / 0 fail / 0 skipped**.
- Web: **61 tests / 61 pass / 0 fail / 0 skipped**.
- Contracts: **29 tests / 29 pass / 0 fail / 0 skipped**.
- Route parity: **123 method + route templates verified**.

## Commits and pull requests

- `storemesh-site-server`: `ec3d731` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-web`: `f2c8229` — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: `5d1dbc0` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation repository working trees were clean after commit and push. The terminal was not affected.

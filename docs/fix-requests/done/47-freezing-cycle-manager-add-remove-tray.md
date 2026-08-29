# Fix Request 47 — Completion report

## Part A — Add tray

- Added manager-only, scanner-backed add-tray mutation for READY FREEZE cycles.
- The same physical tray gates used at cycle creation are enforced, including type, zone, status, single Batch and active-cycle exclusion.
- Cycle containers, unique Batches and input weight are updated and `CYCLE_TRAY_ADDED` is audited.

## Part B — Remove tray

- Added manager-only removal with a mandatory reason for READY cycles.
- Removing the final tray is rejected; a removed tray is detached from the cycle and released as AVAILABLE without disturbing remaining trays.
- Repository persistence now deletes removed cycle-container links, preventing them from reappearing after reload.
- `CYCLE_TRAY_REMOVED` is audited.

## UI and contracts

- READY FREEZE rows expose manager-only hardware-scanner controls for add/remove.
- OpenAPI includes both routes and audit semantics.

## Verification

Real PostgreSQL 16 with `DATABASE_URL` set:

- backend: 419 tests / 419 pass / 0 fail / 0 skipped
- web: 68 tests / 68 pass / 0 fail / 0 skipped
- contracts: 38 tests / 38 pass / 0 fail / 0 skipped
- route parity: 135 method + route templates verified

## Commits and PRs

- site-server: `c8e85ea` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `857cfb6` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `dc9c2e1` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation working trees were clean after commit and push.

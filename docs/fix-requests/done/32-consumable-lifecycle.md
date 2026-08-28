# Fix Request 32 — Completion report

Status: complete and pushed.

## Part A — Consumable master record lifecycle

- Added `updateConsumable` for validated name, unit, and non-negative reorder-threshold changes; threshold edits immediately re-evaluate current stock.
- Added activation and deactivation domain actions and permission-gated HTTP routes.
- Deactivation is rejected with `CONSUMABLE_HAS_OPEN_EXCEPTION` while a reorder/shortage exception is OPEN or ASSIGNED unless `force:true` is explicit. Forced deactivation leaves the supply exception open.
- Activation re-evaluates stock and raises/reopens reorder work when appropriate.
- Existing active-only consumption enforcement was regression-tested: an inactive item returns `CONSUMABLE_NOT_CONFIGURED`.
- Web consumables management now supports edit, activate, and deactivate controls; receipt selection excludes inactive records.
- OpenAPI and route parity include all three additive lifecycle routes.

## Verification

PostgreSQL 17 was running with `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25`.

- Backend focused lifecycle suite: `4 tests / 4 pass / 0 fail / 0 skipped`, including real PostgreSQL reload.
- Backend full suite: `364 tests / 364 pass / 0 fail / 0 skipped`.
- Web: `57 tests / 57 pass / 0 fail / 0 skipped`.
- Contracts: `23 tests / 23 pass / 0 fail / 0 skipped`; route parity verified `120 method + route templates`.
- Terminal regression baseline: `17 tests / 17 pass / 0 fail / 0 skipped` (no terminal changes).

## Commits and PRs

- site-server: `764a0a553384e79d2b19ae9d245e29184e93ec94` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `42812ff98079f614ce50f13bbf40cb9243d33c6d` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `affe6dde6e0134704926eeb5ccfd3221ac530b00` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected branches were pushed to `origin/feat/addendum-01-fix-request-07`. Site-server, web, contracts, and unchanged terminal working trees are clean.

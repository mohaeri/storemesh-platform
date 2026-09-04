# Fix Request 92 — Completion Report

Status: completed and pushed

## Part results

1. Backend enforcement: `createFreshNetLot` now requires a non-empty `allowedNetWeightsKg` array from the active `FRESH_EXPORT` configuration. Client `allowedWeightsKg` and the hardcoded default list are ignored. Missing configuration fails with `FRESH_EXPORT_NET_WEIGHTS_NOT_CONFIGURED` (409) before container claim or source inventory mutation.
2. Regression coverage: the shared test fixture now installs explicit Fresh Export configuration, legacy fallback-dependent tests were updated, and the new real-PostgreSQL test verifies unconfigured rejection without side effects, configured allow/deny behavior, and persistence.
3. Contract: `/api/fresh-net-lots` documents `FRESH_EXPORT_NET_WEIGHTS_NOT_CONFIGURED`, with route-scoped contract coverage. Request and success-response shapes did not change, so the web repository required no change.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, migrations through 071 applied; full `node --test`: **524 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **70 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR92 test run required.
- `git diff --check`: passed for both affected repositories.

## Commits and pull requests

- Backend: `21e2f0315a6f9337da2a790b8d3cf8a2759bb2f6` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `22455dd04dcd0ffe5774637d002a74437c55fa17` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR92 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: completion-report commit follows on the same pushed branch; no platform PR exists for this branch.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR92 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR92 implementation change after the report commit; unrelated pre-existing specification, coordination, scratch, and later-request files remain untouched.
- The open request file was not edited or removed.

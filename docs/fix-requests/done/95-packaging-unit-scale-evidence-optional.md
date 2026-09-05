# Fix Request 95 — Completion Report

Status: completed and pushed

## Part results

1. UNIT package creation now always requires a `measurementId`, including when the legacy `requireScaleEvidence` configuration value is false. Missing evidence fails closed with `PACKAGE_MEASUREMENT_REQUIRED`.
2. The server consumes the referenced, single-use `PACKAGE_UNIT` Measurement and uses its `weightKg` as the authoritative `measuredWeightKg`, stored item weight, and inventory decrement. A client-supplied item weight can no longer substitute for scale evidence or alter inventory.
3. Shared historical test fixtures were updated once to provide Measurement evidence, and the older FR91 tolerance coverage was updated to exercise a real registered scale. No FR92 production behavior was changed; its related suite coverage is included in the full green backend run.
4. Real PostgreSQL coverage proves rejection without a Measurement, acceptance with a valid Measurement, immunity to a spoofed client weight, correct inventory decrement, consumption provenance, and persistence after reload.
5. The package request contract now documents mandatory per-UNIT `measurementId`, authoritative Measurement weight, and `PACKAGE_MEASUREMENT_REQUIRED`. The route itself and response shape did not change, so no web implementation change was required.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` explicitly set and migrations through 073 applied; full `node --test --test-reporter=junit`: **527 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **72 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR95 test run required because neither route nor response shape nor UI behavior changed.
- `git diff --check`: passed for both affected repositories before commit.

## Commits and pull requests

- Backend: `aaa39a3c605660e228e905c89ae8ceda46f49da2` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `e9a9ddccf82239b5913bd0c3feaeb4278ef0c56a` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR95 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: this completion report is committed and pushed on the same upstream-synchronized branch; no platform PR exists for it.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR95 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR95 change after the report commit; unrelated pre-existing specification, coordination, and scratch files remain untouched.
- The open request file was not edited or removed.

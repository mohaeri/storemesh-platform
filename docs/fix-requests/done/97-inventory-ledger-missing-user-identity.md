# Fix Request 97 — Completion Report

Status: completed and pushed

## Part results

1. Every new inventory-ledger row now snapshots a trusted `userId` at append time. The value comes from the operational session's server-resolved `operatorId`, then the authenticated audit context, and otherwise the explicit `SYSTEM` identity; request-body identity values are ignored.
2. Every row now includes a self-describing `unit`: the configured consumable unit for CONSUMABLE, `NET` for FRESH_NET_LOT counts, and `KG` for weight-based entities.
3. The existing `reason` values were confirmed to be stable operation/action codes rather than free-form operator prose. They are now also persisted as explicit `movementType`, preserving backward-compatible `reason` while making the category unambiguous.
4. Migration 075 adds and backfills the three non-null columns while safely recreating the append-only trigger inside the migration transaction. Normal UPDATE and DELETE operations remain rejected by the database.
5. Real PostgreSQL coverage proves spoofed client identity is ignored, the session operator is stored, all new fields survive reload, and UPDATE/DELETE tampering remains blocked.
6. The ledger-read contract was updated for `userId`, `unit`, and `movementType`. No route or request shape and no web workflow changed, so no web implementation change was required.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` explicitly set and migrations through 075 applied; full `node --test --test-reporter=junit`: **530 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **73 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR97 test run required.
- `git diff --check`: passed for both affected repositories before commit.

## Commits and pull requests

- Backend: `fa9918ac0de70734baea3da1a8261f1c4754e187` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `54d9f2d975cc1a2712e6de2adb0ae776469f68cc` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR97 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: this completion report is committed and pushed on the same upstream-synchronized branch; no platform PR exists for it.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR97 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR97 change after the report commit; unrelated pre-existing specification, coordination, and scratch files remain untouched.
- The open request file was not edited or removed.

## Re-verification addendum — after FR108

Re-verified on backend HEAD `f1c013924d18eca10b43d18e09ade43d3bac8f3f` after deterministic audit/outbox reload ordering landed. Two complete runs used separate fresh, fully migrated PostgreSQL 17 databases with explicit `DATABASE_URL`; each run finished **534 passed, 0 failed, 0 skipped**. The FR97 real-PostgreSQL inventory-ledger identity test passed in both runs.

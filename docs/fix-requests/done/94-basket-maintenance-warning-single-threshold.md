# Fix Request 94 — Completion Report

Status: completed and pushed

## Decision implemented

**Option 3** was implemented exactly: one BASKET-wide maintenance threshold, with no basket subtype/profile and no CRATE substitution.

## Part results

1. Added schema-validated `BASKET_MAINTENANCE.useThreshold` configuration through the existing versioned configuration surface.
2. Every completed receiving delivery increments `receivingUseCount` only for containers whose type is exactly `BASKET`. Other container types remain unchanged.
3. On reaching the threshold, exactly one `BASKET_MAINTENANCE_DUE` operational exception is raised with `WARNING` severity and `supervisorOnly: true`. The basket is not locked or blocked and remains usable.
4. Migration 073 durably stores basket use count, warning-deduplication state, and the supervisor-only warning flag. PostgreSQL restart coverage proves count durability, non-BASKET exclusion, one-time warning, and continued use.
5. Contracts were updated because the new configuration scope and `supervisorOnly` response field are externally visible. No new endpoint and no web implementation change were required.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, migrations through 073 applied; full `node --test`: **526 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **71 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR94 test run required.
- `git diff --check`: passed for both affected repositories.

## Commits and pull requests

- Backend: `29072da74bec39bdb70567751e130e19f07269bb` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `885def5c43a2705fc7ea218e63597b1eb66a7dd3` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR94 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: this completion report is committed and pushed on the same upstream-synchronized branch; no platform PR exists for it.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR94 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR94 change after the report commit; unrelated pre-existing specification, coordination, and scratch files remain untouched.
- The open request file was not edited or removed.

## Re-verification addendum — after FR108

Re-verified on backend HEAD `f1c013924d18eca10b43d18e09ade43d3bac8f3f` after deterministic audit/outbox reload ordering landed. Two complete runs used separate fresh, fully migrated PostgreSQL 17 databases with explicit `DATABASE_URL`; each run finished **534 passed, 0 failed, 0 skipped**. The FR94 real-PostgreSQL basket-maintenance test passed in both runs.

# Fix Request 93 — Completion Report

Status: completed and pushed

## Part results

1. Domain audit resolution now returns both `entityId` and the corresponding business-object `entityType`, using the established StoreMesh vocabulary and preserving the prior field-resolution order. Direct audit calls infer the type from the current business object when possible.
2. PostgreSQL migration `072_audit_entity_type.sql` adds nullable `audit_events.entity_type` and its object-history index. Live audit persistence, reload, archived-event normalization, and outbox payloads now carry `entityType`; legacy rows remain nullable.
3. Real-PostgreSQL coverage verifies persisted audit and outbox types for Container, Package, and Customer actions.
4. Site API, cloud OpenAPI, and the shared Site Event schema now publish the additive `entityType` field. No web implementation change was required because existing audit responses are rendered generically.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh`, migration 072 applied; full `node --test`: **525 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **70 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR93 test run required.
- `git diff --check`: passed in both affected repositories.

## Commits and pull requests

- Backend: `8c46c5a0493ede67374f10cfbfe67f318244fd19` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `763ba74306766c1a9c90efd094fc594659bf5955` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR93 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: completion-report commit follows on the synchronized branch; no platform PR exists for this branch.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR93 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR93-scoped change after committing this report; unrelated pre-existing files remain untouched.
- The source file `docs/fix-requests/open/93-audit-events-missing-entity-type.md` was not edited or removed.

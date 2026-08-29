# Fix Request 48 — Completion report

## Part A — Manager decision on a FAILED cycle

- Added manager-only `RESUME`, `RESTART`, and `SCRAP` decisions from `FAILED`, each requiring a non-empty reason.
- `RESUME` reacquires the cycle's physical containers and returns to the type-specific running state.
- `RESTART` preserves the failed attempt in `stateHistory`, clears attempt timing, returns to `READY`, and supports the normal start-to-finish lifecycle.
- `SCRAP` produces terminal `SCRAPPED`, records affected batches as zero-weight `WASTED` inventory in `WASTE`, and releases/empties their physical carriers.
- Every decision is retained in `failureDecisions` and emits an explicit `CYCLE_FAILURE_DECISION` audit event.
- Migration `053_cycle_failure_decisions.sql` persists the decision history; the PostgreSQL reload regression passed.
- Web exposes the three controls only with `cycle:override` and requires a manager reason.
- OpenAPI documents the new status, decisions, audit event, permission, and error behavior. Route parity remains complete.

## Verification

All backend tests ran with `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25` against real PostgreSQL after applying migration 053.

- Backend: `# tests 423`, `# pass 423`, `# fail 0`, `# skipped 0`
- Web: `# tests 69`, `# pass 69`, `# fail 0`, `# skipped 0`
- Contracts: `# tests 39`, `# pass 39`, `# fail 0`, `# skipped 0`
- Route parity: `135 method + route templates`
- Terminal: unaffected; no changes required.

## Commits and PRs

- site-server: `f399740a6f2caf10c1f7a6f9c6dc39afb40d79e4` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `595ff6f9caccd0b52b1953ad04e7519aded768e0` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `59bc2385f8c3ed35914bb4328d5fdd174ac25075` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: untouched; existing branch remains pushed.

All affected repository working trees are clean after commit and push.

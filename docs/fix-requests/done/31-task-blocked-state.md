# Fix Request 31 — Completion report

Status: complete and pushed.

## Part A — BLOCKED task state tied to open exceptions

- Added `BLOCKED`, `blockedByExceptionId`, and persisted prior `unblockedStatus` (`OPEN` or `IN_PROGRESS`).
- Opening a HIGH or CRITICAL exception now blocks matching OPEN/IN_PROGRESS tasks and records the transition in task history. INFO/WARNING exceptions do not block work; PAUSED/FAILED/COMPLETED tasks remain untouched.
- Resolving or dismissing the linked exception restores each task to its own prior state and clears the linkage.
- Claim and all task lifecycle actions reject blocked tasks with `TASK_BLOCKED`.
- `taskView` retains the existing OPEN-only overdue calculation and adds blocking exception type/severity for display.
- Eligible task reads include blocked unassigned work and blocked work assigned to the current operator so it remains visible while non-actionable.
- Migration `047_task_blocked_state.sql` updates the status constraint, columns, validation, and exception foreign key.
- Web cards use a distinct blocked treatment, show exception type/severity, and expose no task action while blocked.
- OpenAPI documents the additive response state and exception linkage.

## Verification

PostgreSQL 17 was running with `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25`; migration 047 was applied.

- Backend focused suite: `4 tests / 4 pass / 0 fail / 0 skipped`, including block/unblock state restoration and real PostgreSQL reload.
- Backend full suite: `360 tests / 360 pass / 0 fail / 0 skipped`.
- Web: `56 tests / 56 pass / 0 fail / 0 skipped`.
- Contracts: `22 tests / 22 pass / 0 fail / 0 skipped`; route parity verified `117 method + route templates`.
- Terminal regression baseline: `17 tests / 17 pass / 0 fail / 0 skipped` (no terminal changes).

## Commits and PRs

- site-server: `978058057cbab3d184db290d1e1d7223c8422507` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `335d5241d27c5ccfb92f9cb7b97bac0b04ca519b` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `ed44a6672108f7966e909da69fdf9307b839ddfa` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation branches were pushed to `origin/feat/addendum-01-fix-request-07`; site-server, web, contracts, and unchanged terminal working trees are clean.

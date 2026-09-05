# Fix Request 116 — Completion report

Status: completed and pushed on 2026-09-05.

## Results

- Added the `TASK_PRIORITIES` configuration scope with validated priorities for manual defaults, automatic work, shipment picks, high/urgent shipment work, and QC corrective work.
- `autoTask` and every other task-creation path in `domain.js` now apply the active configuration. Existing numeric values remain compatibility defaults only before the scope is configured; once a version exists without an active version, task creation fails closed with `TASK_PRIORITIES_NOT_CONFIGURED`.
- Changing the active priority configuration changes the priority stored on subsequently created tasks.
- Removed request-supplied `weightVarianceLimit` from Receiving threshold selection. Receiving now uses the active `RECEIVING.weightVarianceLimit`, or the server-owned compatibility default when no Receiving configuration is active.
- No route, request, or response shape changed, so no `storemesh-contracts` update was required.

## Verification

- `storemesh-site-server`, focused real-PostgreSQL FR116 test: **1 passed, 0 failed, 0 skipped**.
- `storemesh-site-server`, complete suite on real PostgreSQL with `DATABASE_URL=postgresql://postgres@127.0.0.1:55441/storemesh_fr114_test`: **536 passed, 0 failed, 0 skipped**.
- The PostgreSQL test proves two successive active task-priority versions produce different stored task priorities and that a client-supplied Receiving variance cannot widen the configured limit; both results survive repository reload.

## Commits and pull requests

- `storemesh-site-server`: `02fee2c24dfaf1a641ff1a5d59d9ebf0e89c44eb` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Completion report: committed and pushed in `storemesh-platform` on its current branch; that branch has no open pull request.

## Working tree

- `storemesh-site-server`: clean and synchronized with its remote after push.
- `storemesh-platform`: the FR116 report is the only FR116 change; pre-existing unrelated local coordination/specification changes remain untouched, so the overall platform working tree is not clean.
- The source file in `open/` was not edited or removed.

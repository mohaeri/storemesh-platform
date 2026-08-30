# Fix Request 58 — Completion Report

Status: COMPLETE

## Part A results

- Internal-shipment `CANCEL` now rejects an empty reason with `INTERNAL_SHIPMENT_CANCEL_REASON_REQUIRED`.
- Cancellation requires an active operational session and stores the trimmed `cancellationReason`, `cancelledBy`, `cancelledSessionId`, `cancelledDeviceId`, and `cancelledAt`.
- Reserved packages continue to be released by clearing their `shipmentId` exactly once.
- The existing shipment table had only `cancelled_at`; migration `065_shipment_cancellation_evidence.sql` adds the genuinely missing generic cancellation evidence columns for both shipment kinds.
- PostgreSQL persistence and hydration now retain all cancellation evidence across reload.
- The web transfer console prompts for a non-empty cancellation reason and sends it with the active `sessionId`.
- OpenAPI and contract regression coverage document the breaking cancellation request requirement and response evidence.

## Verification

Real PostgreSQL 17 was used at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migration 065 applied.

- Backend focused: **3 passed, 0 failed, 0 skipped**.
- Backend full: **471 passed, 0 failed, 0 skipped**.
- Web full: **78 passed, 0 failed, 0 skipped**.
- Contracts full: **52 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **152 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `542998a01a20ff06a1b62b41c17f42ff313bb0a0` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `40f68416013d3a4d32a3c38e50108ab9b1e501c3` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `274b03050f546a0cb13b33361e03009d0d3b0c90` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform: this completion report is committed on the same branch; no pull request exists for this branch.

## Working-tree confirmation

- All three affected product repository working trees were clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- The platform repository retained only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

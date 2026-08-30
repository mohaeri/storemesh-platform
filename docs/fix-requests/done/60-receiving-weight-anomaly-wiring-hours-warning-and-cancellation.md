# Fix Request 60 — Completion Report

Status: COMPLETE

## Part A results

- The web receiving form now exposes optional Persian expected weight and sends `expectedWeightKg` only when filled.
- The `RECEIVING` configuration schema accepts optional `operatingHoursStart` and `operatingHoursEnd` values in strict 24-hour `HH:MM` format.
- Receiving evaluates the local time of `receivedAt` only when both hours are configured and raises advisory `RECEIVING_OUTSIDE_HOURS` with `WARNING` severity outside the window; sites without hours retain existing behavior.
- Expected-weight variance remains governed by the active `weightVarianceLimit` and now has an end-to-end UI input path.
- Part A focused verification: backend **3 passed, 0 failed, 0 skipped**; web expected-weight/UI verification **50 passed, 0 failed, 0 skipped**.

## Part B results

- Added `cancelBatch(id,input,key)` and `POST /api/batches/{batchId}/cancel-receiving` for fresh, untouched `RECEIVED` batches still in `RECEIVING` and alone in their carrier.
- Missing reasons return `RECEIVING_CANCEL_REASON_REQUIRED`; downstream activity, shared carriers, or otherwise ineligible batches return `RECEIVING_CANCEL_NOT_ELIGIBLE`.
- Successful cancellation records `cancelledBy`, `cancelledSessionId`, `cancelledDeviceId`, `cancellationReason`, and `cancelledAt`, restores the carrier's pre-receiving status/session state, cancels its open cold-storage task, and removes the delivery-basket link.
- Migration `066_receiving_batch_cancellation.sql` and repository hydration/save logic preserve the evidence and carrier release across a real PostgreSQL reload.
- OpenAPI publishes the optional expected-weight request field, receiving-hours configuration, warning semantics, cancellation route, response evidence, and errors; the web console exposes reasoned cancellation for eligible batches.
- Part B focused verification with real PostgreSQL: backend **4 passed, 0 failed, 0 skipped**; web **2 passed, 0 failed, 0 skipped**; contracts **2 passed, 0 failed, 0 skipped**.

## Final verification

Real PostgreSQL 17 was used at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migration 066 applied.

- Backend full: **480 passed, 0 failed, 0 skipped**.
- Web full: **80 passed, 0 failed, 0 skipped**.
- Contracts full after the complete request/response/configuration contract update: **55 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **153 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `404402c287c75249e03c980db52dfba0f8eeb97c` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `cd001857909f95158a6b16ea7aa0423352897b63` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `b3da41287ec8a1bcafcc1c93b201521d9ef81b21` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform: this completion report is committed on the same branch; no pull request exists for this branch.

## Working-tree confirmation

- All three affected product repository working trees were clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- The platform repository retained only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

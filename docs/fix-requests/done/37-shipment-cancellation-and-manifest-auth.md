# Fix Request 37 — Completion report

## Results by Part

- Part A: shipment manifest HTTP access now requires `shipping:write`; anonymous and unauthorized callers receive 401/403.
- Part B: every customer-shipment cancellation requires a non-empty reason. Cancelling `PICKING`/`READY` additionally requires `override:approve`; a shipping operator can still cancel `DRAFT` with a reason.
- Part C: cancellation atomically releases packages/boxes and completes every active `SHIPMENT_SHIP` task with `AUTO_SHIPMENT_CANCEL` history, making later claim impossible.
- Part D: repeated package or Fresh Shipping Box IDs are rejected at the public domain boundary with `SHIPMENT_DUPLICATE_ITEM`.
- OpenAPI documents manifest authorization, cancellation controls, and both new error codes. No web UI shape changed.

## Verification

- Focused backend tests, including HTTP and PostgreSQL reload: **3 / 3 pass / 0 fail / 0 skipped**.
- Full backend, real PostgreSQL (`DATABASE_URL` set): **380 / 380 pass / 0 fail / 0 skipped**.
- Contracts: **27 / 27 pass / 0 fail / 0 skipped**; route parity **122 method + route templates**.
- Web and terminal unchanged.

## Commits and PRs

- site-server: `5392465` — https://github.com/mohaeri/storemesh-site-server/pull/21
- contracts: `9edf179` — https://github.com/mohaeri/storemesh-contracts/pull/8
- web/terminal: unchanged.

All affected implementation repository working trees are clean after push.

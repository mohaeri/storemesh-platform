# Fix Request 51 — Completion report

Completed and pushed on `feat/addendum-01-fix-request-07`.

## Part A — Assign a replacement item to an existing shipment

- Added `POST /api/shipments/{shipmentId}/items` for packages and fresh shipping boxes in `DRAFT`, `PICKING`, or `READY` shipments.
- Reused shipment-item eligibility checks, enforced sales-order quantity limits, assigned the replacement, and created the normal `SHIPMENT_SHIP` Pick task.
- Recorded `SHIPMENT_ITEM_ADDED` with the damaged item identifier in durable audit state for replacement traceability.
- Rejected additions from `LOADED` onward.

## Part B — Manager approval for DAMAGE

- Shipment-assigned package and fresh-box damage now additionally requires `override:approve`.
- Unassigned-item damage remains operator-accessible.
- Damaging an assigned fresh shipping box now removes it and its scans from the active shipment, matching package behavior.
- Shipped the manager replacement workflow in the web UI and documented the endpoint, audit event, and conditional authorization in the contracts.

## Verification

Real PostgreSQL: `postgresql://postgres@127.0.0.1:55439/storemesh_fr50` (`DATABASE_URL` set).

- Backend focused: `node --test test/shipment-damage-replacement.test.js` — tests 6, pass 6, fail 0, cancelled 0, skipped 0, todo 0.
- Backend full: `node --test` — tests 443, pass 443, fail 0, cancelled 0, skipped 0, todo 0.
- Web full: `npm test` — tests 72, pass 72, fail 0, skipped 0.
- Contracts full: `npm test` — tests 42, pass 42, fail 0, skipped 0; route parity 140 method/route templates.
- Terminal: unaffected; no terminal changes or tests required.

## Commits and PRs

- Backend: `aac67eb64a82000da6487051724d52f7ac6bd7af` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `e9530846df9e873f924001ae0e7c3fa9db67be35` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `4161c8c51c13a39db8322f7af59e235359da3535` — https://github.com/mohaeri/storemesh-contracts/pull/8

All three affected product-repository working trees were clean after commit and push.

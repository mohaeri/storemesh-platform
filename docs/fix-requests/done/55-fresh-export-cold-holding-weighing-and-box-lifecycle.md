# Fix Request 55 — Completion report

Completed and pushed on `feat/addendum-01-fix-request-07`.

## Part A — Cold holding and official box weight

- Successful Fresh Shipping Box printing now transitions to `LABEL_PRINTED`; only an attributable cold-holding move transitions it to `READY_TO_SHIP`.
- Added `moveToColdHolding` and `POST /api/fresh-shipping-boxes/:id/cold-holding`, recording location, operator, session, device, time, and movement history.
- Added optional official `FRESH_SHIPPING_BOX` scale evidence with durable `measuredWeightKg` and `weightMeasurementId`, plus the `requireBoxScaleEvidence` configuration gate.
- Added `LABEL_PRINTED` to active split, cancel, and damage lifecycle handling.
- Part A focused verification before continuing: tests 1, pass 1, fail 0, cancelled 0, skipped 0, todo 0.

## Part B — Draft correction, box capacity, and label enrichment

- Added `draftShippingBox`, `updateShippingBoxDraft`, and `confirmShippingBox`; the existing `createShippingBox` remains a backward-compatible atomic wrapper.
- Drafts reserve net quantities without consuming supplies or queueing print work, allow allocation add/remove correction, and restore allocations on cancellation.
- Added optional `maxNetsPerBox` and `maxWeightKgPerBox` limits with `FRESH_SHIPPING_BOX_FULL`.
- Fresh-box labels gain `shipmentCode` and destination `customerCode` on initial or replacement shipment assignment.
- Part B focused verification before continuing: tests 5, pass 5, fail 0, cancelled 0, skipped 0, todo 0 (the file contains the retained Part A case and four Part B cases).

## Part C — Web UI, contracts, and full HTTP/PostgreSQL chain

- The web Fresh Export form now supports repeatable multi-lot allocation rows, live net/weight totals, configured capacity guidance, draft/confirm submission, optional official scale capture, and cold-holding actions for `LABEL_PRINTED` boxes.
- Published the full `DRAFT → LABEL_PENDING → LABEL_PRINTED → READY_TO_SHIP → SHIPPED/CANCELLED/DAMAGED` lifecycle, new endpoints, read fields, configuration fields, and label enrichment in `storemesh-contracts`.
- Added a real-HTTP, real-PostgreSQL test covering Sorting, Fresh Export destination assignment, single- and multi-source net lots, duplicate aggregation and capacity failures, draft add/remove, scale measurement, confirm, print fail/retry/success, cold holding, shipment creation, shipping, and PostgreSQL reload.
- Part C HTTP/PostgreSQL focused verification: tests 1, pass 1, fail 0, cancelled 0, skipped 0, todo 0.

## Verification

Real PostgreSQL 17: `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations through `062_fresh_shipping_box_weight.sql` applied.

- Backend full: `node --test` — tests 465, pass 465, fail 0, cancelled 0, skipped 0, todo 0.
- Web full: `node --test` — tests 76, pass 76, fail 0, cancelled 0, skipped 0, todo 0.
- Contracts full: `node --test` — tests 49, pass 49, fail 0, cancelled 0, skipped 0, todo 0.
- Route parity: 152 method + route templates verified.

## Commits and PRs

- Backend: `bdbf73b64b701d4211fc9dba085443d23d281e03` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `6b9fe4721fe34798c0d4349c4531548d90946cac` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `cdd93c4f601b6a00f0dcfcef2902cf6b790c1e05` — https://github.com/mohaeri/storemesh-contracts/pull/8

All three affected product-repository working trees were clean after commit and push, and each branch tracked `origin/feat/addendum-01-fix-request-07` at the listed commit.

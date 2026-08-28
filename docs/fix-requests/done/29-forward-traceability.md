# Fix Request 29 — Completion Report

Status: completed, committed, and pushed on 2026-08-28.

## Part A — Single-site forward trace engine

- Added `traceForward(batchId)` with recursive descendant-Batch discovery and cycle guards.
- Resolves every matching UNIT package upward to its outermost package and then to Shipment, Sales Order, and Customer.
- Resolves legacy and multi-source Fresh Net Lots to Fresh Shipping Boxes and shipments.
- Internal transfers terminate local traversal explicitly with `crossesTransferBoundary:true`, `destinationSite`, and `shipmentCode`; no destination behavior is fabricated.
- Broken package parents, missing shipments/orders/customers, and hierarchy cycles become `integrityIssues` instead of crashes.
- Added `GET /api/trace/{batchId}/forward`, protected by `inventory:read`, with durable `TRACE_SEARCHED` audit metadata `searchType:BATCH_FORWARD` persisted before response.
- Six focused scenarios passed, including a real PostgreSQL persist/reload of Batch → UNIT → CARTON → Shipment → Customer.

## Part B — Recall-oriented web view

- Added Forward Trace next to backward genealogy using the same Batch-code search.
- Renders Batch → descendants → outer Package/Fresh Box → Shipment → Customer.
- Displays customer code/name as the recall contact target.
- Renders an explicit Persian transfer-boundary warning explaining that continuation belongs to the destination site's database.
- Empty downstream inventory returns a useful no-packaging/no-shipment state.

## Final verification

```text
backend (real PostgreSQL): 353 tests / 353 pass / 0 fail / 0 skipped
web:                       54 tests / 54 pass / 0 fail / 0 skipped
contracts:                 20 tests / 20 pass / 0 fail / 0 skipped
terminal regression:       17 tests / 17 pass / 0 fail / 0 skipped
route parity:              117 method + route templates verified
```

## Commits and pull requests

- site-server: `5affc41` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `3a23722` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `bb57173` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: not changed; full regression suite passed.

All affected implementation repositories and the terminal regression repository are clean after commit and push.

# Fix Request 28 — Completion Report

Status: completed, committed, and pushed on 2026-08-27.

## Part A — Fresh Shipping Box cancellation and damage

- Added reason-required `CANCEL` and `DAMAGE` transitions and HTTP routes.
- Chosen shipment rule: a box linked to any non-cancelled shipment is blocked; the shipment must be cancelled/unlinked first.
- Cancel restores every net-lot allocation and reverses EPS/Gel consumption using immutable `REVERSAL` consumable transactions.
- Damage restores net allocations but does not return destroyed consumables, and raises a HIGH `FRESH_SHIPPING_BOX_DAMAGED` exception.
- Shipped/terminal boxes reject both transitions. Terminal reason/time persist through PostgreSQL reload.
- Focused Part A coverage passed with zero failures/skips.

## Part B — Multi-source Fresh Net Lots

- `sources:[{batchId,count}]` is supported while legacy `batchId`/`count` remains compatible.
- Duplicate source rows are aggregated before validation and consumption.
- Every source must be usable, SORTED, assigned to FRESH_EXPORT, and share product/grade/size.
- Each source batch loses only its own contributed weight.
- `sourceContributions:[{batchId,count,weightKg}]` is stored durably; original batches and their harvest periods remain directly resolvable.
- Physical design: one scanned current work BASKET/CRATE remains mandatory. For multiple sources, source batches may reside in different physical containers (following MERGE precedent); the scanned container establishes the active packing context rather than falsely claiming to contain every source.
- Web UI supplies repeatable source batch/count rows and provides reasoned Cancel/Damage actions.

## Final verification

```text
backend (real PostgreSQL): 347 tests / 347 pass / 0 fail / 0 skipped
web:                       53 tests / 53 pass / 0 fail / 0 skipped
contracts:                 19 tests / 19 pass / 0 fail / 0 skipped
terminal regression:       17 tests / 17 pass / 0 fail / 0 skipped
route parity:              116 method + route templates verified
```

## Commits and pull requests

- site-server: `c99977e` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `65554e2` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `35e84bb` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: not changed; full regression suite passed.

All affected implementation repositories and the terminal regression repository are clean after commit and push.

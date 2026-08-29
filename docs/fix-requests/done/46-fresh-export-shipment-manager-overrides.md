# Fix Request 46 — Completion report

## Part A — Shipment priority

- Customer shipments default to `NORMAL`; managers can set `NORMAL`, `HIGH`, or `URGENT` only with a reason.
- `SHIPMENT_PRIORITY_SET` snapshots the change and active `SHIPMENT_SHIP` tasks are reprioritized immediately.

## Part B — Shipping-box split

- A manager can move a validated subset of allocations from an unassigned active Fresh Shipping Box into a new box.
- Counts and weights remain conserved, the source must retain content, and the new box consumes its own EPS/gel packs and receives a print job.
- `FRESH_SHIPPING_BOX_SPLIT` links source and new box in the audit snapshot.

## Part C — Shipment merge

- Same-sales-order pre-loaded shipments can be merged with a required reason.
- Package and Fresh Box ownership moves to the target, stale scans are cleared for safe rescanning, and the empty source is closed as `CANCELLED` with merge metadata.
- `SHIPMENT_MERGED` is recorded.

## Verification

Real PostgreSQL 16 with `DATABASE_URL` set and migration 059 applied:

- backend: 415 tests / 415 pass / 0 fail / 0 skipped
- web: 67 tests / 67 pass / 0 fail / 0 skipped
- contracts: 37 tests / 37 pass / 0 fail / 0 skipped
- route parity: 133 method + route templates verified

## Commits and PRs

- site-server: `f8f2c4f` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `4c55a18` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `552e3d0` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation working trees were clean after commit and push.

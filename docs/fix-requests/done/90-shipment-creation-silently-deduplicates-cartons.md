# Fix Request 90 — Completion report

Status: completed, tested, committed, and pushed.

## Part 1 — Backend

- The public `createShipment` boundary now validates `packageIds` and `shippingBoxIds` independently before calling the existing shipment implementation or performing any order/item lookup.
- Duplicate carton IDs return `SHIPMENT_CARTON_DUPLICATE` (409).
- Duplicate Fresh Shipping Box IDs return `SHIPMENT_BOX_DUPLICATE` (409).
- Unique inputs continue through the existing order, eligibility, quantity-limit, assignment, label-enrichment, and picking-task behavior unchanged.
- Added a real PostgreSQL test proving both duplicate errors occur before missing-item lookup or mutation, then proving a unique carton request persists with exactly one ID.
- Targeted PostgreSQL/shipment regression run: **6 passed, 0 failed, 0 skipped**.
- Full backend `node --test` with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **522 passed, 0 failed, 0 skipped**.

## Part 2 — Web verification

- No web multiline-selection change was required.
- The customer shipment form still uses native `<select multiple>` controls for both `packageIds` and `shippingBoxIds`.
- Submission still derives both arrays from each control's `selectedOptions`, so one option cannot be selected twice through the web console.
- Focused web UI contract run: **50 passed, 0 failed, 0 skipped**.

## Contracts

- `POST /api/shipments` now documents unique carton/box IDs and both new 409 errors.
- Removed the obsolete generic `SHIPMENT_DUPLICATE_ITEM` documentation because the public backend boundary now emits the two specific errors.
- Full contracts `node --test`: **68 passed, 0 failed, 0 skipped**.
- Site OpenAPI/server parity: **156 passed, 0 failed, 0 skipped**.
- Cloud OpenAPI/server parity: **4 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `22dcc483d0780857c12079932cfcf12e1d07f0ec` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `9916cb48a7f206ec51ba2e4624ddb62b2f1cfd7a` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web (verified unchanged): `109847c6f40cecd66af9557fb2a24e4e3172175d` — https://github.com/mohaeri/storemesh-web/pull/9
- Platform report: `pending`

## Working-tree and synchronization verification

- Backend working tree is clean and HEAD matches `origin/feat/addendum-01-fix-request-07`.
- Web working tree is clean and HEAD matches `origin/feat/addendum-01-fix-request-07`; no web files changed for FR90.
- Contracts tracked working tree is clean and HEAD matches `origin/feat/addendum-01-fix-request-07`; the pre-existing unrelated untracked `package-lock.json` was excluded.
- Platform retains pre-existing unrelated modified/untracked review and coordination files; only this exact done report is committed. The original `open/90-shipment-creation-silently-deduplicates-cartons.md` remains untouched for Claude's independent verification and cleanup.

# Fix Request 64 — Completion Report

Status: COMPLETE

## Part A results

- Added inventory-read-gated `GET /api/consumables/{id}/receipts` and `GET /api/consumables/{id}/transactions` endpoints.
- Both histories are strictly scoped to the requested consumable and sorted newest-first.
- The web Consumables page now adds a per-item «گردش و رسیدها» drill-down dialog with receipt and transaction tables.
- Real PostgreSQL reload verification confirms receipt and consumption ledger persistence and item isolation.

## Part B results

- Atomic Fresh Shipping Box creation rejects fractional or negative gel-pack counts with `FRESH_SHIPPING_BOX_GEL_PACK_COUNT_INVALID`; integer counts retain existing behavior.
- Supplied receipt dates must parse and must not be later than server `clock()`; invalid/future dates return `CONSUMABLE_RECEIPT_DATE_INVALID`.
- Omitted receipt dates still default exactly to `clock()`, and valid past/present dates remain accepted.
- OpenAPI publishes both ledger routes, response fields, validation semantics, and both new error codes.

## Final verification

Backend tests used real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations 001–066 applied.

- Backend full: **489 passed, 0 failed, 0 skipped**.
- Web full: **84 passed, 0 failed, 0 skipped**.
- Contracts full: **59 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **155 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `ac752c8224345df607b34ab8358e35a32588ebaf` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `6ad0672b0b712e7dd76efb90057aafc852b9a475` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `a227ab61a79dd25ec4c3fab0a3f00b37a5b3bb24` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform: this completion report is committed on the same branch; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees were clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- The platform repository retained only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

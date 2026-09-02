# Fix Request 75 — Completion Report

Status: COMPLETE

## Part 1 — append-only database ledger

- Added migration `069_inventory_ledger.sql` with the requested entity, quantity, reason, actor, site, and occurrence fields plus a per-site sequence for deterministic ordering.
- Reused FR73's `enforce_append_only_history()` trigger for database-enforced UPDATE/DELETE protection.
- Applied migrations 001–069 from an empty real PostgreSQL 17 database successfully.

## Part 2 — atomic mutation coverage

- Quantity-bearing Batches, Packages, FreshNetLots, FreshShippingBoxes, and Consumables are snapshotted around every idempotent domain `run()` operation.
- Every changed entity receives one ledger row inside the same repository save transaction as its live balance update.
- Covered receiving, WASH and SLICE identity preservation, MERGE, Sorting, packaging, fresh-net creation/allocation, internal-transfer receipt, consumable receipt/consumption/reversal, cycle final weights/scrap, delivery aggregation, and inventory adjustment paths.
- Existing `weightKg`, `remainingCount`, package/box contents, and consumable `quantity` remain the balance of record.

## Part 3 — read API, contract, and web UI

- Added `GET /api/inventory/{entityType}/{entityId}/ledger` with `inventory:read` authorization and sequence-ordered entity-scoped results.
- Updated `storemesh-contracts` in the same round and verified 156 OpenAPI/server method-route templates.
- Added an inventory-table history action and Persian ledger dialog to `storemesh-web`.

## Part 4 — verification

All backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh` with `DATABASE_URL` set.

- FR75 targeted backend: **4 passed, 0 failed, 0 skipped**.
- Backend full: **506 passed, 0 failed, 0 skipped**.
- Web full: **86 passed, 0 failed, 0 skipped**.
- Contracts full: **61 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **156 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `c29a926` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `d054b59` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `f0ee520` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform report: committed on `feat/addendum-01-fix-request-07`; this branch has no pull request.

## Working-tree confirmation

- Backend, web, and contracts tracked working trees are clean and their local HEADs match the pushed remote branch.
- Platform has no tracked changes outside this report. Its remaining untracked files are the pre-existing local coordination/review channels intentionally excluded from Git.
- The original `open/75-inventory-append-only-ledger.md` remains unmodified and was not removed.

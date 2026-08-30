# Fix Request 56 — Completion report

Completed and pushed on `feat/addendum-01-fix-request-07`.

## Part A — Durable received-transfer batch links

- Added migration `063_internal_transfer_batch_ids.sql` with a non-null `uuid[]` `batch_ids` column on `internal_transfers`.
- The migration backfills existing received transfers from batches whose `source_transfer` matches the transfer `shipment_code`.
- PostgreSQL persistence now writes `batchIds` when a transfer is received and restores the stored array during reload instead of returning an empty array.
- Added a real-PostgreSQL regression test that receives a signed transfer, reloads the repository, and verifies the transfer's `batchIds` exactly match the created transferred batches.
- Updated `storemesh-contracts` so the received internal-transfer read shape explicitly includes durable `batchIds`.

## Verification

Real PostgreSQL 17: `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migration 063 applied.

- Backend focused: `node --test test/fix-request-56.test.js` — tests 1, pass 1, fail 0, cancelled 0, skipped 0, todo 0.
- Backend full: `node --test` — tests 466, pass 466, fail 0, cancelled 0, skipped 0, todo 0.
- Contracts full: `node --test` — tests 50, pass 50, fail 0, cancelled 0, skipped 0, todo 0.
- Route parity: 152 method + route templates verified.

## Commits and PRs

- Backend: `ce1e74ff523ef29808807f4d8445e17a7f7846be` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `2d2158da938783ec1ddbcca2b9d75c8512ad1ed8` — https://github.com/mohaeri/storemesh-contracts/pull/8

Both affected product-repository working trees were clean after commit and push, and each branch tracked `origin/feat/addendum-01-fix-request-07` at the listed commit.

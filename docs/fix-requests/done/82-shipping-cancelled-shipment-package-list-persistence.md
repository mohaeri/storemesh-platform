# Fix Request 82 — Completion report

Status: COMPLETED

## Results

- Added migration `071_shipment_expected_items.sql` with durable `expected_package_ids` and `expected_shipping_box_ids` snapshots on shipments, including backfill from currently assigned items.
- Shipment persistence writes the current assignment snapshot for every legitimate active-state reassignment and preserves the historical list when cancellation occurs.
- Cancelled customer shipments reload their original carton/Fresh Shipping Box lists independently of the released items' live `shipment_id` values.
- Cancelled internal-transfer shipments use the identical persistence and reload behavior.
- Active shipments continue to derive `packageIds` and `shippingBoxIds` from live item foreign keys, so their behavior remains unchanged.
- Merged source shipments retain their historical item list while the active target remains authoritative for the newly combined live assignment.
- Snapshot columns remain repository-internal; the route/request/response shape did not change, so no contracts or web changes were needed.

## Verification

- Focused PostgreSQL reload and merge regression tests with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **6 passed, 0 failed, 0 skipped**.
- Full backend `node --test`, same real PostgreSQL database: **514 passed, 0 failed, 0 skipped**.
- Migration 071 was applied successfully to the real PostgreSQL test database.
- Backend working tree was clean and the branch was **0 behind / 0 ahead** after push.
- Platform contains pre-existing unrelated local coordination/review files and the tracked `docs/anbarsys-spec.md` modification; none were included in this request's commits.

## Commits and pull requests

- `storemesh-site-server`: `f49409e6df727e2058bf2aa513ca2901d0ccae7e` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-platform` completion report: `PLATFORM_REPORT_COMMIT_PENDING`
- `storemesh-web`: unaffected — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: unaffected — https://github.com/mohaeri/storemesh-contracts/pull/8


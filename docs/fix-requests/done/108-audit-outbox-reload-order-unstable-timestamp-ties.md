# Fix Request 108 — Completion Report

Status: completed and pushed

## Part 1 — Stable event reload order

- Changed `audit_events` reload ordering to `occurred_at, sequence, id`.
- Changed `outbox_events` reload ordering to `occurred_at, (payload->>'sequence')::bigint, id`; outbox sequence is persisted in the event payload rather than a physical table column.
- Changed archived Audit Event ordering to timestamp, payload sequence, and event ID.
- Added a repository regression assertion for both live event queries.

## Part 2 — Related ordering audit

- Audited the remaining PostgreSQL reload/list queries.
- Added stable identity tie-breakers to timestamp-ordered exceptions, deliveries, sales orders, Fresh Net Lots, Fresh Shipping Boxes, and harvest periods.
- Added parent/resource identity tie-breakers to sequence/code-ordered reference, cycle-container, carton-scan, checklist-item, delivery-basket, shipment-scan, and tray-allocation reloads.
- No date/time-zone behavior changed.

## Test results

Every PostgreSQL acceptance run used a separately created, migrated PostgreSQL 17 database and an explicit `DATABASE_URL`.

- `test/event-sequence.test.js`, run 1: 3 passed, 0 failed, 0 skipped.
- `test/event-sequence.test.js`, run 2: 3 passed, 0 failed, 0 skipped.
- `test/event-sequence.test.js`, run 3: 3 passed, 0 failed, 0 skipped.
- `test/event-sequence.test.js`, run 4: 3 passed, 0 failed, 0 skipped.
- `test/event-sequence.test.js`, run 5: 3 passed, 0 failed, 0 skipped.
- Full backend suite, fresh database run 1: 534 passed, 0 failed, 0 skipped.
- Full backend suite, fresh database run 2: 534 passed, 0 failed, 0 skipped.

## Commits and pull requests

- Backend: `f1c013924d18eca10b43d18e09ade43d3bac8f3f` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Platform report: `9963e9f2e19dfd5cdf974a3d55b37903f670c4bc` (report creation), followed by the metadata-finalization commit containing this SHA. No platform pull request exists for this branch.

## Working-tree verification

- Backend working tree is clean and synchronized with `origin/feat/addendum-01-fix-request-07`.
- Platform has no uncommitted FR108 implementation change other than this report before its report commit; pre-existing unrelated platform changes remain untouched.
- The source file in `docs/fix-requests/open/` was not edited or removed.

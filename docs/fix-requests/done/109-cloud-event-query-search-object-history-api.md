# Fix Request 109 — Completion report

Status: completed and pushed on 2026-09-05.

## Results

- Added report-key-authenticated `GET /api/events` with direct repository filters for site, type, category, entity identity and occurred-at range.
- Added deterministic `(occurredAt, id)` keyset pagination with an opaque cursor and bounded limit.
- Added report-key-authenticated `GET /api/events/{id}`.
- Added report-key-authenticated `GET /api/object-history/{entityType}/{entityId}` with stable cross-site ordering.
- Persisted `entityType` in Cloud PostgreSQL, added query indexes, and serialized concurrent schema initialization with a PostgreSQL advisory lock.
- Published the three new read operations, authentication, filters, pagination and response schemas in the Cloud OpenAPI contract.
- Export remains out of scope as required.

## Verification

- `storemesh-cloud`, complete suite against a fresh real PostgreSQL database with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh_fr109_test`: **11 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`, complete suite: **75 passed, 0 failed, 0 skipped**.
- The integration coverage verifies multi-site filtering, direct repository queries, single-event lookup, deterministic same-timestamp Object History, and cursor continuity after concurrent ingest.

## Commits and pull requests

- `storemesh-cloud`: `837ad175534311dcf3a41ead5a41fb9141f2f70b` — https://github.com/mohaeri/storemesh-cloud/pull/1
- `storemesh-contracts`: `83c9b054b218c648e95373ea939ede0591bb44d7` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Completion report: committed and pushed in `storemesh-platform` on its current branch.

## Working tree

- `storemesh-cloud`: clean after commit and push.
- `storemesh-contracts`: request changes are clean after commit and push; the previously existing untracked `package-lock.json` remains untouched and is unrelated to FR109.
- The source file in `open/` was not edited or removed.

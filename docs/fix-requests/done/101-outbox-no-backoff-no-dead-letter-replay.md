# Fix Request 101 — Completion Report

Status: completed and pushed

## Part 1 — Retry scheduling

- Added per-event `nextAttemptAt` scheduling with bounded exponential backoff and jitter.
- Network and non-success HTTP failures now share durable attempt accounting.
- PostgreSQL conflict updates persist retry metadata in the outbox payload.
- Verified with a fake clock against a real PostgreSQL repository that a not-yet-due event is not retried.

## Part 2 — Dead-letter recovery

- Added `StoreMesh.requeueOutbox` with `DEAD_LETTER` validation, attempt reset, retry metadata cleanup, persistence, and audit recording.
- Added `POST /api/outbox/{eventId}/requeue` and documented it in the site OpenAPI contract.
- Added the web audit/outbox operator view and a manual requeue action.
- Verified against real PostgreSQL that a failed event reaches `DEAD_LETTER`, can be requeued, delivers successfully, and remains delivered after reload.

## Part 3 — Site-key rotation

- Cloud site credentials now support `current` and `previous` keys with a required ISO-8601 `previousExpiresAt` grace-window expiry.
- Production configuration supports `<SITE>_PREVIOUS_SITE_KEY` and `<SITE>_PREVIOUS_SITE_KEY_EXPIRES_AT` and rejects incomplete or invalid rotation configuration.
- Authentication accepts only the explicit key IDs `current` and `previous`; the previous key is rejected after expiry.
- Documented the rotation procedure in the Cloud README and made the site publisher send `X-Site-Key-Id`.

## Final test results

All final suites used `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh` where PostgreSQL-backed tests exist.

- `storemesh-site-server`: 534 passed, 0 failed, 0 skipped.
- `storemesh-cloud`: 10 passed, 0 failed, 0 skipped.
- `storemesh-contracts`: 75 passed, 0 failed, 0 skipped.
- `storemesh-web`: 98 passed, 0 failed, 0 skipped.

## Commits and pull requests

- Backend: `ec93cd6606beec201fd6fdb32b606b4e4278c6df` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Cloud: `4ab798c06c1fd814e406a3d24c328951410ff9ea` — https://github.com/mohaeri/storemesh-cloud/pull/1
- Contracts: `d7a96019b8deb67a7859a9990fb824c055ce2c79` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: `80f47143bba96ce10b8809dbf93e58cfecadcb51` — https://github.com/mohaeri/storemesh-web/pull/9
- Platform report: recorded by the platform commits that add and finalize this file.

## Working-tree verification

- Backend, Cloud, and Web are clean and synchronized with their upstream branches.
- Contracts has no uncommitted FR101 change and is synchronized with upstream; the pre-existing unrelated untracked `package-lock.json` remains intentionally untouched.
- Platform has no uncommitted FR101 implementation change other than this report before its report commit. Pre-existing unrelated specification, coordination, open-request, and scratch changes remain intentionally untouched.
- The source file in `docs/fix-requests/open/` was not edited or removed.

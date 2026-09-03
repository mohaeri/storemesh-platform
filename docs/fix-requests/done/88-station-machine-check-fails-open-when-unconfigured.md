# Fix Request 88 — Completion report

Status: completed, tested, committed, and pushed.

## Policy decision

Option A (fail closed) was selected, matching the request's recommendation. A site with no active `STATION_MACHINES` configuration cannot create a freeze/dry cycle. `createCycle` returns HTTP 409 with `STATION_MACHINES_NOT_CONFIGURED`; an arbitrary machine ID is never accepted implicitly.

## Results

### Backend

- Added the fail-closed guard before station/type machine membership validation.
- Preserved `MACHINE_ID_REQUIRED` for a blank identifier and `MACHINE_NOT_CONFIGURED` for identifiers excluded by an active configuration.
- Added a real PostgreSQL regression test that persists the prepared site, attempts cycle creation with zero active `STATION_MACHINES` versions, verifies `STATION_MACHINES_NOT_CONFIGURED`, flushes/reloads, and confirms no cycle was persisted.
- Updated existing cycle fixtures to activate explicit station-machine configuration; no test-only fallback was added to production behavior.
- Targeted PostgreSQL/configuration run: **3 passed, 0 failed, 0 skipped**.
- Full `node --test` with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **520 passed, 0 failed, 0 skipped**.

### Contracts

- Documented active `STATION_MACHINES` as mandatory for `POST /api/cycles` and added the 409 `STATION_MACHINES_NOT_CONFIGURED` error.
- Added contract coverage for the fail-closed behavior.
- Full `node --test`: **67 passed, 0 failed, 0 skipped**.
- Site OpenAPI/server parity: **156 passed, 0 failed, 0 skipped**.
- Cloud OpenAPI/server parity: **4 passed, 0 failed, 0 skipped**.

### Web

- No route, request, or success-response shape changed. No web implementation change was required.

## Commits and pull requests

- Backend: `392938660dc01db5f5e074d3083d91f53bba0fd7` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `8b83a8adf988458203f1899bef4e1dc0e79b1961` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web (verified unchanged): `4be92a1287631470609961b4167f4a7be422ca1a` — https://github.com/mohaeri/storemesh-web/pull/9
- Platform report: `4c7ad2dc899b305936e896a7a1272614d7f72f71`

## Working-tree and synchronization verification

- Backend tracked working tree is clean and the branch matches `origin/feat/addendum-01-fix-request-07`.
- Contracts tracked working tree is clean and the branch matches `origin/feat/addendum-01-fix-request-07`; the pre-existing unrelated untracked `package-lock.json` was excluded.
- Web working tree is clean and matches `origin/feat/addendum-01-fix-request-07`.
- Platform retains pre-existing unrelated modified/untracked review and coordination files; only this exact report is staged/committed. The original `open/88-station-machine-check-fails-open-when-unconfigured.md` remains untouched for Claude's independent verification and subsequent cleanup.

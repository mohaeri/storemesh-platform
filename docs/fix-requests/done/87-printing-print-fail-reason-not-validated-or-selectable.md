# Fix Request 87 — Completion report

Status: COMPLETED

## Results

- Extracted the eight existing print/reprint reason codes into one backend constant and reused it for both operations.
- `failPrint` now rejects empty or unknown codes with `PRINT_FAIL_REASON_INVALID`, normalizes accepted codes, and records the structured code in attempts, jobs, and failure events.
- Changed the fail HTTP body from free-form `reason` to enumerated `reasonCode`.
- Added a reason selector beside every pending print job in the web UI; the fail request now sends the operator's selected code instead of a hardcoded Persian string.
- Updated the OpenAPI request schema and error response and added contract coverage for the shared enum.

## Verification

- Focused backend PostgreSQL test with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **1 passed, 0 failed, 0 skipped**; it rejected empty/invalid values and persisted all eight allowed codes.
- Full backend `node --test`, same real PostgreSQL database: **519 passed, 0 failed, 0 skipped**.
- Focused web reason-selection test: **1 passed, 0 failed, 0 skipped**.
- Full web `node --test` with `DATABASE_URL` set: **95 passed, 0 failed, 0 skipped**.
- Full contracts `node --test`: **66 passed, 0 failed, 0 skipped**; site parity verified **156** route templates and cloud parity verified **4**.
- Backend and web working trees were clean and synced after push. Contracts tracked files were clean and synced; unrelated untracked `package-lock.json` remained excluded.
- Platform contains pre-existing unrelated coordination/review files and `docs/anbarsys-spec.md`; none were included.

## Commits and pull requests

- `storemesh-site-server`: `c1783448cbcce686b75056be24c6572c39bcebfd` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-web`: `4be92a1287631470609961b4167f4a7be422ca1a` — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: `cce2727d87867a7789406efb1b913e2a8f40d37a` — https://github.com/mohaeri/storemesh-contracts/pull/8
- `storemesh-platform` completion report: `04d340cc4da441039e3994f3913dbead14ac1e95`

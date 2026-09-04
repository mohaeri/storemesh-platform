# Fix Request 91 — Completion Report

Status: completed and pushed

## Part results

1. Backend enforcement: UNIT package creation now reads target weight and tolerance only from the active `PACKAGING` configuration. Client-supplied `targetWeightKg` and `tolerancePercent`, plus the hardcoded `2` fallback, are no longer used. Missing or unusable configuration returns `PACKAGING_TOLERANCE_NOT_CONFIGURED` with HTTP 409. Non-UNIT behavior is unchanged.
2. Backend fixtures and PostgreSQL coverage: shared packaging-configuration fixtures were added and all previously fallback-dependent tests were updated. The FR91 PostgreSQL regression covers missing configuration despite a permissive client value, configured in-tolerance acceptance, configured out-of-tolerance rejection, and persistence of the active configuration before package persistence.
3. Contract: `/api/packages` documents `PACKAGING_TOLERANCE_NOT_CONFIGURED` alongside the existing tolerance error, with contract coverage. The route, request, and success-response shapes did not change, so no web implementation change was required.

## Verification

- `storemesh-site-server`: `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh`, real PostgreSQL 17, migrations through 071 applied; full `node --test`: **523 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **69 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged by this request; no test run required.
- Diff whitespace validation: `git diff --check` passed for the affected changes.

## Commits and pull requests

- Backend: `c736f1487677a8d5ca513f40ac1e248647e530db` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `a5a8a5e2827c6c5c0b4c73be6fba68eaefdeb516` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR91 commit; existing PR https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged at `109847c6f40cecd66af9557fb2a24e4e3172175d`.
- Platform completion-report commit: recorded in the follow-up metadata commit for this report.

## Working-tree confirmation

- `storemesh-site-server`: clean after commit and push.
- `storemesh-web`: clean and unchanged.
- `storemesh-contracts`: FR91 tracked changes are clean after commit and push; the pre-existing unrelated untracked `package-lock.json` remains intentionally untouched.
- `storemesh-platform`: this report is the only FR91-scoped change; pre-existing unrelated specification, coordination, and later open-request changes remain intentionally untouched.
- The source file `docs/fix-requests/open/91-packaging-unit-tolerance-client-fallback.md` was not edited or removed.

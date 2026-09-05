# Fix Request 99 — Completion Report

Status: completed and pushed

## Part results

1. Backend event model and persistence: every newly recorded audit/outbox event now contains one of the ten specification categories. Migration 076 adds, backfills, constrains, indexes, reloads, and archives the non-null `category` column without weakening append-only history.
2. Failure audit semantics: the generic `REQUEST_FAILED` server path is replaced with `REQUEST_VALIDATION_FAILED`, `RESOURCE_NOT_FOUND`, `SYSTEM_FAILURE`, `RATE_LIMITED`, or the existing `PERMISSION_DENIED`, based on the already-known HTTP/error class. Unknown routes now pass through the same auditable not-found path.
3. Contract and cloud delivery: the site event JSON Schema plus site/cloud OpenAPI require the category enum. Cloud ingest rejects absent/unknown categories and PostgreSQL persists and reloads the field.
4. Regression coverage: representative category mappings, non-null event coverage, real-PostgreSQL flush/reload, guarded archive/restore, legacy request-id/proxy audit expectations, cloud ingest, cloud PostgreSQL restart, and contracts were verified.

## Verification

- `storemesh-site-server`: real PostgreSQL 17, `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh`, migrations through 076 applied; full `node --test`: **532 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **73 passed, 0 failed, 0 skipped**.
- `storemesh-cloud`: real PostgreSQL 17 with the same configured `DATABASE_URL`; full `node --test`: **10 passed, 0 failed, 0 skipped**.
- `git diff --check`: passed in all affected repositories.

## Commits and pull requests

- Backend: `251f0f15f4b1c856e05e57dd6c69643250ae2374` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `f57b465d40ee912667691eb9800df0d9c89cd0c1` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Cloud: `faf814c9a036a163550f174a28c920f9af79ca52` — https://github.com/mohaeri/storemesh-cloud/pull/1
- Platform completion-report commit: recorded in the metadata update immediately following the report commit; no platform PR exists for this branch.

## Working-tree confirmation

- Backend and cloud working trees are clean and synchronized with upstream after commit and push.
- Contracts has no remaining FR99 change and is synchronized with upstream; the pre-existing unrelated untracked `package-lock.json` remains intentionally untouched.
- Platform has no remaining FR99 implementation change after the report commit; pre-existing unrelated specification, coordination, scratch, and later open-request files remain intentionally untouched.
- The source file `docs/fix-requests/open/99-audit-events-no-category-generic-failures.md` was not edited or removed.

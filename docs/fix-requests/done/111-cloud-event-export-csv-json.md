# Fix Request 111 — Completion report

Status: completed and pushed on 2026-09-05.

## Results

- Added report-key-authenticated `GET /api/events/export` with `csv` and `ndjson` formats.
- Reused the FR109 repository query and its site, type, category, entity identity and occurred-at filters.
- Streamed bounded 100-row keyset pages instead of accumulating the unbounded export in memory.
- Preserved deterministic `(occurredAt, id)` ordering across pages.
- CSV uses a fixed 22-column order and escapes quotes, commas and embedded line breaks; object/array values are JSON-encoded within cells.
- NDJSON emits the same event shape as `GET /api/events`, one valid JSON object per line.
- Published both response media types and all filters in the Cloud OpenAPI contract.
- No signed chain-of-custody report was added, as required.

## Verification

- `storemesh-cloud`, complete suite against fresh real PostgreSQL with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh_fr111_test`: **12 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`, complete suite: **75 passed, 0 failed, 0 skipped**.
- The PostgreSQL integration test exported 102 matching rows across multiple query pages, round-tripped CSV special characters, parsed every NDJSON line, compared export filters with the list query, and verified unauthenticated access returns 401.

## Commits and pull requests

- `storemesh-cloud`: `40221aba02bb545639bdd71d1c817cc1c252810a` — https://github.com/mohaeri/storemesh-cloud/pull/1
- `storemesh-contracts`: `33105002f110200c7c1edc8e8d08e6b24c52eb74` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Completion report: committed and pushed in `storemesh-platform` on its current branch.

## Working tree

- `storemesh-cloud`: clean after commit and push.
- `storemesh-contracts`: FR111 changes are clean after commit and push; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- The source file in `open/` was not edited or removed.

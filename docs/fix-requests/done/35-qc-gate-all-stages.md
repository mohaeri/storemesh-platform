# Fix Request 35 — Completion report

## Part A — Generalized configured QC gate

- Replaced the Sorting-only condition in `assertBatchUsable` with `batchQcStage(batch)`.
- Any active checklist matching the batch product and current stage now requires the latest relevant result to be `APPROVED` against an active checklist for that same product/stage.
- Stages without an active matching checklist remain ungated.
- Existing Sorting behavior remains covered and unchanged.
- Added Washing→Slicing coverage, no-checklist coverage, and real PostgreSQL reload coverage.
- Updated older tests whose assertions intentionally assumed the former Sorting-only behavior.

## Contract review

No route, request, response, or schema shape changed. `BATCH_QC_APPROVAL_REQUIRED` remains an operational domain error and the existing QC endpoint contract is already stage-general, so no contract source change was necessary.

## Verification

- Focused backend tests, real PostgreSQL: **10 / 10 pass / 0 fail / 0 skipped**.
- Full backend suite, real PostgreSQL (`DATABASE_URL` set): **375 / 375 pass / 0 fail / 0 skipped**.
- Contracts regression: **25 / 25 pass / 0 fail / 0 skipped**; route parity **122 method + route templates**.
- Web and terminal were not changed.

## Commit and PR

- site-server: `8730892` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web/contracts/terminal: unchanged.

The affected implementation repository working tree is clean after push.

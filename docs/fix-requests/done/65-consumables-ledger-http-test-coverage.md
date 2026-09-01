# Fix Request 65 — Completion Report

Status: COMPLETE

## Part 1 results — permission gate

- Added a real HTTP-server test for both consumable ledger endpoints.
- A logged-in user without `inventory:read` receives `403` from both receipts and transactions routes.

## Part 2 results — scoping and ordering

- Seeded two consumables through the domain layer while connected to real PostgreSQL 17.
- Verified over HTTP that each response contains only the requested consumable's records.
- Verified receipts and transactions are returned newest-first.

## Part 3 results — nonexistent consumable

- Confirmed the current handlers and published OpenAPI contract intentionally return `200` with `{ "items": [] }` for an unknown consumable id.
- Added HTTP assertions for this behavior on both endpoints; no route, request, or response shape changed.

## Part 4 results — rendered web drill-down

- Extracted the consumable-ledger dialog into a testable UI module used by the real application.
- Replaced the source-string test with a fake-fetch interaction test that opens the dialog and verifies receipt and transaction response rows are rendered.

## Final verification

Backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations 001–066 applied.

- Backend full: **490 passed, 0 failed, 0 skipped**.
- Web full: **84 passed, 0 failed, 0 skipped**.
- Contracts full: **59 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **155 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `6db11857e597862d0e0bb2aa91825f50eb14d7b5` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `893637a60e52b8f2ea91e563e3cffe361121c7ed` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: unchanged at `a227ab61a79dd25ec4c3fab0a3f00b37a5b3bb24` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform completion-report commit: `57d18a21f954088ae2923d2248dda392af688945`; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees are clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- Platform retains only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

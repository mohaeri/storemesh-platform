# Fix Request 69 — Completion Report

Status: COMPLETE

## Part 1 results — centralized idempotency-key validation

- Added a 128-character maximum at `StoreMesh.run`, the common choke point for all idempotent mutations.
- Oversized keys now fail with `400 IDEMPOTENCY_KEY_INVALID`; keys are never truncated or silently replaced.
- Validation occurs before request execution, hashing, map insertion, persistence, or PostgreSQL primary-key indexing.
- A code comment records that the database column remains `TEXT` while the application deliberately protects the primary-key index with this cap.
- Current web clients generate UUID keys (36 characters), comfortably below the cap.

## Part 2 results — real HTTP regression coverage

- Added a real HTTP mutation test with a 10,000-character `Idempotency-Key`.
- Verified the request returns 400, creates no container, and inserts nothing into either in-memory idempotency map.
- Verified a normal key still creates one entity and an identical retry returns the original entity without duplication.

## Part 3 results — contracts and web impact

- No route, request-body, or response-body shape changed, so no `storemesh-contracts` update was required.
- The web already sends UUID idempotency keys; no UI change was required.

## Final verification

Backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` set and migrations 001–066 applied.

- Targeted backend HTTP test: **1 passed, 0 failed, 0 skipped**.
- Backend full: **497 passed, 0 failed, 0 skipped**.
- Web full: **84 passed, 0 failed, 0 skipped**.
- Contracts full: **59 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **155 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `1a7b1bc405ada21a7959a3cfe6e711fb5d2265b4` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: unchanged at `893637a60e52b8f2ea91e563e3cffe361121c7ed` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: unchanged at `a227ab61a79dd25ec4c3fab0a3f00b37a5b3bb24` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform baseline before this report: `acbdf7ba2c6f8f290b279e7974272fa3a1e326d0`; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees are clean after commit and push, with local HEAD matching their tracked remote branch.
- Platform retains only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

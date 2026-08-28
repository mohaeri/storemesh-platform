# Fix Request 38 — Completion report

## Results by Part

- Part A: all eight configuration scopes now have explicit field schemas. Unknown fields and invalid types/shapes are rejected with `CONFIGURATION_SCHEMA_INVALID` and structured `scope`/`field` details.
- Part B: `GET /api/configurations` now returns immutable `proposedValues`, `currentActiveValues`, `currentActiveVersionId`, and `currentActiveSequence` comparison data. The web approval table renders those server-provided values side by side.
- Part C: `SYSTEM_TIMEOUTS` governs `sessionIdleTimeoutMs` and `deviceOfflineAfterMs` at runtime. Constructor values sourced from the existing environment/defaults remain the fallback until an active version exists, and activated changes take effect without restart.
- OpenAPI and route-parity assertions document the new scope, comparison response, and validation error.

## Verification

- Focused backend tests, including a real PostgreSQL reload: **4 / 4 pass / 0 fail / 0 skipped**.
- Full backend, real PostgreSQL (`DATABASE_URL` set): **384 / 384 pass / 0 fail / 0 skipped**.
- Web: **60 / 60 pass / 0 fail / 0 skipped**.
- Contracts: **28 / 28 pass / 0 fail / 0 skipped**; route parity **122 method + route templates**.
- Terminal unchanged.

## Commits and PRs

- site-server: `0abe9b8` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `ac8383c` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `63cacb2` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: unchanged.

All affected implementation repository working trees are clean after push.

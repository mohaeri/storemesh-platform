# Fix Request 43 — Completion Report

Status: completed, committed, and pushed.

## Part A — Container priority

- Containers default to `NORMAL` and support manager-governed `NORMAL`, `HIGH`, and `URGENT` priority with a mandatory reason.
- `CONTAINER_PRIORITY_SET` is audited and priority takes precedence in eligible task recommendation.
- Priority and its reason/timestamp persist in PostgreSQL.

## Part B — Damaged basket transfer

- Added a storage-authorized endpoint that transfers every batch into an empty, available, same-type target container.
- Source becomes `DAMAGED`; target becomes active; batch identity/genealogy remains unchanged.
- Durable movement rows retain both source and target container IDs.
- A durable `CONTAINER_DAMAGED` exception and audit event are raised.
- Web controls and OpenAPI contracts shipped in the same round.

## Verification

- Backend focused real-PostgreSQL tests: **4/4 pass, 0 fail, 0 skipped**.
- Backend full real-PostgreSQL suite: **403/403 pass, 0 fail, 0 skipped**.
- Web: **64/64 pass, 0 fail, 0 skipped**.
- Contracts: **34/34 pass, 0 fail, 0 skipped**.
- Route parity: **125 method + route templates verified**.

## Commits and PRs

- site-server `ed2b359` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web `6c95c9e` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts `0fa95cd` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation worktrees are clean. Terminal was not affected.

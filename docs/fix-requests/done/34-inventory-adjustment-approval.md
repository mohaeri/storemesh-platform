# Fix Request 34 — Completion report

## Part A — Inventory Adjustment request/approval workflow

- Added durable `DRAFT` → `APPROVED`/`REJECTED` adjustment workflow with requester and reviewer attribution.
- Below-tolerance requests can use the combined path only when the authenticated requester also has approval permission.
- At/above tolerance requires a different approver; self-approval returns `SELF_APPROVAL_FORBIDDEN`.
- Request and approval both enforce non-negative inventory; rejection requires and persists a reason without changing weight.
- Added migration `049_inventory_adjustment_approval.sql`, PostgreSQL persistence/reload mapping, permission-scoped HTTP routes, web request form and approval queue, OpenAPI coverage, and parity coverage.

## Verification

- Backend, real PostgreSQL (`DATABASE_URL` set): **372 tests / 372 pass / 0 fail / 0 skipped**.
- Focused workflow including PostgreSQL reload: **5 / 5 pass / 0 fail / 0 skipped**.
- Web: **59 / 59 pass / 0 fail / 0 skipped**.
- Contracts: **25 / 25 pass / 0 fail / 0 skipped**; route parity **122 method + route templates**.
- Terminal regression: **17 / 17 pass / 0 fail / 0 skipped**.

## Commits and PRs

- site-server: `2103048` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `2a8ca0b` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `4a8b678` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: unchanged.

All affected implementation repository working trees are clean after push. The platform repository retains pre-existing untracked review/open coordination documents; only this completion report was added and committed.

# Fix Request 78 — Completion Report

Status: COMPLETE

## Transactional auth/audit path

- `PostgresAuthStore` role mutations and user credential persistence now accept a caller-supplied PostgreSQL client while preserving the pool-backed default for existing callers.
- `PostgresRepository.writeAuditEvent` writes the audit and matching outbox rows through that same caller-supplied client.
- `applyAuditedAuthMutation` now owns one `BEGIN`/`COMMIT` transaction across the auth mutation and audit/outbox insert, and issues `ROLLBACK` on any failure.
- All four server call sites use the transactional path: role assignment, role revocation, badge regeneration, and PIN reset.
- Database compensating mutations were removed. On rollback, the in-memory auth and event views are restored from the pre-call snapshot/durable store so uncommitted state is not observable.

## Reconciliation decision

- Removed the periodic reconciliation timer, `AUTH_AUDIT_RECONCILIATION_INTERVAL_MS` wiring, close-handler cleanup, and server-exposed sweep from `server.js`.
- Retained the standalone `reconcileAuthAudit` function only as an explicit diagnostic utility and for existing integrity tests; it no longer runs periodically or participates in correctness.

## Verification

All tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh` with `DATABASE_URL` set.

- FR39 compatibility plus FR78 transaction tests: **5 passed, 0 failed, 0 skipped**.
- PostgreSQL role HTTP regression: **1 passed, 0 failed, 0 skipped**.
- Backend full: **512 passed, 0 failed, 0 skipped**.
- The forced audit-insert failure left both `user_roles` and `audit_events` unchanged on a fresh database read.
- Two concurrent role assignments to the same user both committed with matching durable audit records.

## Commits and pull requests

- Backend: `55d7455b008fe474f3520a225eb59fbd27a59ce5` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web and contracts: not affected; no commits required.
- Platform report: `e49ba3b50ad409327dec2dae7f95d68a3c0a3bc5`; this branch has no pull request.

## Working-tree confirmation

- Backend tracked working tree is clean and its local HEAD matches the pushed remote branch.
- Web and contracts were not modified by FR78 and remain clean at their pushed HEADs.
- Platform retains the pre-existing unrelated tracked edit to `docs/anbarsys-spec.md` plus the pre-existing untracked local coordination/review files; neither is included in this report commit.
- The original `open/78-auth-audit-single-transaction.md` remains unmodified and was not removed.

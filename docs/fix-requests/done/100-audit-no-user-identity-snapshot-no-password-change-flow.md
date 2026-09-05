# Fix Request 100 — Completion Report

Status: completed and pushed

## Part results

1. Audit identity snapshot: audit/outbox events now capture `actorUsername` from the authenticated actor at write time. Migration 077 persists it, PostgreSQL reload and archive normalization preserve it, and Cloud persists the wire field.
2. Password management: authenticated users can change their own password only after verifying the current password; permission-gated administrators can reset a manageable user's password. Both mutations use the existing transactional audit boundary and emit `PASSWORD_CHANGED` or `PASSWORD_RESET`.
3. Logout semantics: the existing self-session revoke route is explicitly documented as the supported logout operation. The web client already revokes that session before clearing local credentials.
4. Contracts and UI: OpenAPI publishes both password routes, validation/errors, logout meaning, and the username snapshot. Web adds self-service password change and permission-filtered administrative reset controls.

## Verification

- `storemesh-site-server`: PostgreSQL 17 with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh`, migrations through 077; full suite: **533 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full suite: **74 passed, 0 failed, 0 skipped**.
- `storemesh-cloud`: PostgreSQL 17 with configured `DATABASE_URL`; full suite: **10 passed, 0 failed, 0 skipped**.
- `storemesh-web`: full suite with configured `DATABASE_URL`: **97 passed, 0 failed, 0 skipped**.
- `git diff --check`: passed in every affected repository.

## Commits and pull requests

- Backend: `af6c5822b12787c7489f08b60c1d8bc9bfbfb688` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `e93436807383a973080b09b03458378ea4d78179` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Cloud: `85a97c674894a0428d7b03295576a6f807f902a4` — https://github.com/mohaeri/storemesh-cloud/pull/1
- Web: `1b71f122e440658b0241ca2e6e4ada2ca83e0baa` — https://github.com/mohaeri/storemesh-web/pull/9
- Platform report commit: `984468588e2bbdd72fd2ae5cbfad9cad61bbc571`; this SHA is recorded by the immediately following metadata commit.

## Working-tree confirmation

- Backend, Cloud, and Web are clean and synchronized with upstream.
- Contracts is synchronized with upstream and has no FR100 changes left; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no FR100 implementation changes beyond this report; unrelated pre-existing specification, coordination, scratch, and later open-request files remain untouched.
- The source file `docs/fix-requests/open/100-audit-no-user-identity-snapshot-no-password-change-flow.md` was not edited or removed.

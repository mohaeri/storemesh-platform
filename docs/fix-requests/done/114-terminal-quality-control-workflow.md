# Fix Request 114 — Completion report

Status: completed and pushed on 2026-09-05.

## Results

- Added a Terminal-only quality-control screen; no PDA code was changed.
- A hardware scanner is the sole source of the inspected identity. A scanned Batch resolves directly; a scanned Container must resolve to exactly one Batch or the workflow fails closed. There is no typed or dropdown Batch ID path.
- Active checklists are loaded for the scanned Batch product and render explicit Pass, Fail, and N/A controls for every item.
- Inspection submits the server-compatible stage, checklist, responses, result, session, notes, and explicit attestation.
- Signing roles can only come from roles in the authenticated token; forged roles are rejected client-side and the existing server `assertQcAttestation` check remains authoritative.
- Quarantine is available as an inspection result. Release uses the existing `/api/quality-checks/release` endpoint with reason, optional destination, active session, and the same role-bound attestation as the web panel.
- Existing route, request, and response shapes were reused unchanged, so no `storemesh-contracts` update was required.

## Verification

- `storemesh-terminal`, complete suite: **28 passed, 0 failed, 0 skipped**.
- `storemesh-site-server`, complete suite after all migrations on a fresh real PostgreSQL cluster/database with `DATABASE_URL=postgresql://postgres@127.0.0.1:55441/storemesh_fr114_test`: **535 passed, 0 failed, 0 skipped**.
- Terminal tests verify that physical Batch and Container scans exclusively determine `batchId`, manual input cannot qualify, all response values and attestation are retained, and a role outside authenticated claims cannot be submitted for release.
- Backend real-PostgreSQL coverage verifies attestation roles are derived from JWT claims, forged manager roles fail, QC state persists, quarantine/release remains gated, and inspection outcomes continue blocking or releasing downstream work correctly.

## Commits and pull requests

- `storemesh-terminal`: `895bfae8e1d76e934c518a59d3841b4c97cbc53b` — https://github.com/mohaeri/storemesh-terminal/pull/6
- `storemesh-site-server`: verification only; no code change — https://github.com/mohaeri/storemesh-site-server/pull/21
- Completion report: committed and pushed in `storemesh-platform` on its current branch.

## Working tree

- `storemesh-terminal` and `storemesh-site-server`: clean and synchronized with their remotes after push.
- `storemesh-platform`: the FR114 report is the only FR114 change; pre-existing unrelated local coordination/specification changes remain untouched, so the overall platform working tree is not clean.
- The source file in `open/` was not edited or removed.

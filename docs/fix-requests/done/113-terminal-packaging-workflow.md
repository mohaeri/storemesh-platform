# Fix Request 113 — Completion report

Status: completed and pushed on 2026-09-05.

## Results

- Added a Terminal-only Packaging screen; no PDA code was changed.
- UNIT creation resolves a hardware-scanned Batch, reads a stable value directly from the connected scale controller, records a `PACKAGE_UNIT` Measurement, and sends only its `measurementId` to the existing package flow. There is no free-text weight fallback.
- Batch preparation uses the same `PACKAGING_CHECKPOINT` Measurement and `/api/packaging/weigh` flow as the web implementation.
- Cartons are created empty and populated only through the existing `/api/packages/{cartonId}/scans` endpoint with a hardware-verified UNIT code.
- Failed package-label jobs can be retried only after scanning the exact existing label identity and providing a reason, through the existing `/api/print-jobs/{jobId}/retry` flow.
- Existing route, request, and response shapes were reused unchanged, so no `storemesh-contracts` update was required.

## Verification

- `storemesh-terminal`, complete suite: **24 passed, 0 failed, 0 skipped**.
- `storemesh-site-server`, complete suite after all migrations on fresh real PostgreSQL database `storemesh_fr113_test`, with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh_fr113_test`: **535 passed, 0 failed, 0 skipped**.
- Terminal tests verify stable physical-scale Measurement provenance, absence of a manual-weight fallback, hardware-only Carton scans, exact-label verification for failed-print retry, and UI exposure of the full workflow.
- The backend suite verifies mandatory per-UNIT scale evidence, scan-first Carton identity enforcement, and failed-print verified retry behavior against the real database.

## Commits and pull requests

- `storemesh-terminal`: `f00d1af693c7fa7d0f5720ef80a73780605e1556` — https://github.com/mohaeri/storemesh-terminal/pull/6
- `storemesh-site-server`: verification only; no code change — https://github.com/mohaeri/storemesh-site-server/pull/21
- Completion report: committed and pushed in `storemesh-platform` on its current branch.

## Working tree

- `storemesh-terminal` and `storemesh-site-server`: clean and synchronized with their remotes after push.
- `storemesh-platform`: the FR113 report is the only FR113 change; pre-existing unrelated local coordination/specification changes remain untouched, so the overall platform working tree is not clean.
- The source file in `open/` was not edited or removed.

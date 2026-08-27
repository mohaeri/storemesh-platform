# Fix Request 26 — Completion Report

Status: completed, committed, and pushed on 2026-08-27.

## Part A — Per-site mandatory UNIT scale evidence

- Added boolean validation for `PACKAGING.requireScaleEvidence`.
- When the active Packaging configuration sets the flag to `true`, UNIT creation requires a valid, separately captured scale `measurementId`; missing evidence returns `PACKAGE_MEASUREMENT_REQUIRED` (409).
- Sites with no active Packaging configuration or `requireScaleEvidence:false` retain the prior optional-measurement behavior.
- The web form reads the active site configuration, requires an active scale and captured measurement when configured, and prevents unmeasured submission.
- Focused Part A tests: 3 passed, 0 failed, 0 skipped.
- Full backend checkpoint after Part A, with real `DATABASE_URL`: 340 passed, 0 failed, 0 skipped.
- Web checkpoint after Part A: 51 passed, 0 failed, 0 skipped.

## Part B — Scan-first CARTON assembly

- Chosen design: the old pre-allocation path was removed outright. Supplying `childPackageIds` when creating a CARTON now returns `CARTON_PREALLOCATION_FORBIDDEN`.
- CARTONs start as empty drafts. A physical UNIT scan validates readiness, nesting, usable inventory, and active mixed-product/grade policy before atomically adding the child and parent link.
- Sealing requires at least one active physical scan and retains the duplicate-scan guard; there is no second preallocated list to reconcile.
- The web UI creates an empty carton draft and exposes physical scans as the only content-building path.
- OpenAPI documents both per-site scale evidence and scan-first carton semantics.
- Existing PostgreSQL packaging tests were converted from hand-built/preallocated state to the actual domain order. The real flow creates an empty carton, scans its UNIT, persists, reloads, and verifies child link, parent link, scan provenance, label data, cancellation, and reuse.

## Final verification

All backend tests used PostgreSQL 16 through a real `DATABASE_URL`:

```text
backend:   342 tests / 342 pass / 0 fail / 0 skipped
web:        52 tests / 52 pass / 0 fail / 0 skipped
contracts:  18 tests / 18 pass / 0 fail / 0 skipped
terminal:   17 tests / 17 pass / 0 fail / 0 skipped
route parity: 115 method + route templates verified
```

## Commits and pull requests

- site-server: `4b5e92a` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `a4b13b6` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `f79a611` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: not changed; its full suite was run as a regression check.

The affected implementation repositories (`storemesh-site-server`, `storemesh-web`, `storemesh-contracts`) and the checked terminal repository are clean after commit and push.

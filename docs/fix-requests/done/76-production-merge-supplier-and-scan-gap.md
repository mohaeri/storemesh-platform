# Fix Request 76 — Completion Report

Status: COMPLETE

## Part A — supplier contribution snapshot

- Added migration `070_merge_supplier_provenance.sql` with durable `suppliers`, `supplier_ids`, and `supplier_contributions` fields plus a scalar-supplier backfill.
- Multi-parent children now receive deduplicated weighted supplier contributions, including inherited proportions when an already-merged batch is merged again.
- Mixed-supplier output keeps scalar `supplier` and `supplierId` null; same-supplier output retains both scalar fields.
- Supplier provenance survives a real PostgreSQL reload.

## Part B — physical MERGE confirmation

- Multi-parent MERGE now requires `containerId` and rejects omission with `MERGE_PHYSICAL_CONFIRMATION_REQUIRED`.
- The referenced object must be an empty, unlocked, available BASKET or CRATE in SORTING and cannot be actively owned by another session.
- Successful MERGE places the child in that physical container and records the child and container reference in the resulting `BATCH_TRANSFORMED` audit payload.
- Updated every existing multi-parent MERGE regression fixture to provide a valid physical container.

## Contracts and web UI

- Published the physical confirmation, supplier arrays, weighted contribution array, scalar mixed-supplier behavior, and error response in `storemesh-contracts`.
- Added a required hardware-scanner field to the web MERGE form; the verified container identity is sent as `containerId`.
- OpenAPI/server parity remains **156 method + route templates**.

## Verification

All backend tests used real PostgreSQL 17 at `postgresql://postgres:postgres@127.0.0.1:55439/storemesh` with `DATABASE_URL` set.

- FR76 targeted backend: **4 passed, 0 failed, 0 skipped**.
- Affected legacy MERGE regressions: **18 passed, 0 failed, 0 skipped**.
- Backend full: **510 passed, 0 failed, 0 skipped**.
- Web full: **87 passed, 0 failed, 0 skipped**.
- Contracts full: **62 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **156 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `ab97ca09967a46f29c95a581f06de0ebae9efd38` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `dd1fe8e66d1756e3705bd62e228050156cc5b338` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `5fd4bcbfa5467152600c414b6ab8f83ef6d90548` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform report: `640d6df7cb52fb78a5ccdde3d642ecbedfb2d64f`; this branch has no pull request.

## Working-tree confirmation

- Backend, web, and contracts tracked working trees are clean and their local HEADs match the pushed remote branch.
- Platform retains the pre-existing unrelated tracked edit to `docs/anbarsys-spec.md` plus the pre-existing untracked local coordination/review files; neither was included in this report commit.
- The original `open/76-production-merge-supplier-and-scan-gap.md` remains unmodified and was not removed.

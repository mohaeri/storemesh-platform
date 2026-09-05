# Fix Request 117 — Completion report

Status: completed and pushed on 2026-09-06.

## Results

- Added the runtime `NUMBERING` configuration scope for task, batch, and package prefixes, separator, and sequence width.
- Unconfigured sites deliberately retain the existing `T-{site}-{6 digits}`, `B-{site}-{6 digits}`, and `P-{site}-{6 digits}` formats and are never blocked; this is the requested cosmetic-only exception to the usual fail-closed rule.
- Activating a numbering version immediately changes codes assigned to newly created tasks, batches, and packages.
- Existing issued codes remain unchanged when a numbering version is activated or replaced.
- Same-operation references, generated task titles, labels, and pending print jobs are kept consistent when a newly created batch or package receives its configured code.
- The existing generic configuration API already exposes configuration values without a scope-specific response shape, so no `storemesh-contracts` change was required.

## Verification

- `storemesh-site-server`, focused numbering/task tests on real PostgreSQL: **4 passed, 0 failed, 0 skipped**.
- `storemesh-site-server`, complete suite on real PostgreSQL with `DATABASE_URL=postgresql://postgres@127.0.0.1:55441/storemesh_fr114_test`: **537 passed, 0 failed, 0 skipped**.
- The PostgreSQL test verifies legacy defaults, configured task/batch/package formats, non-retroactivity, and repository-reload persistence.

## Commits and pull requests

- `storemesh-site-server`: `294bd7248a331619e8368097d0059e422d080b1f` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Completion report: committed and pushed in `storemesh-platform` on its current branch; that branch has no open pull request.

## Working tree

- `storemesh-site-server`: clean and synchronized with its remote after push.
- `storemesh-platform`: the FR117 report is the only FR117 change; pre-existing unrelated local coordination/specification changes remain untouched, so the overall platform working tree is not clean.
- The source file in `open/` was not edited or removed.

# Fix Request 61 — Completion Report

Status: COMPLETE

## Part A results

- Public container movement now requires a physical scan of the container itself; a missing scan returns `CONTAINER_SCAN_REQUIRED` and a mismatched scan returns `CONTAINER_SCAN_MISMATCH`.
- The HTTP move request forwards `scannedContainerId` as scan evidence, while internal legacy domain calls remain backward compatible.
- The web inventory movement form always uses the physical container scanner instead of a known-container selector and submits the verified container identity.
- Focused verification with real PostgreSQL: backend **3 passed, 0 failed, 0 skipped**; web movement/UI plus regression verification **50 passed, 0 failed, 0 skipped**.

## Part B results

- Added the `WAREHOUSE_MOVEMENT` configuration scope with boolean `requireDestinationScan`; absent configuration preserves the default-off behavior.
- When enabled, movement requires the scanned destination-zone code to exactly match the selected target zone and otherwise returns `MOVEMENT_DESTINATION_SCAN_REQUIRED`.
- The web form displays and enforces destination scanning only when the active configuration enables it.
- Real PostgreSQL reload verification confirms that the configuration and a compliant scanned movement persist correctly.
- OpenAPI publishes the two scan request fields, the new configuration scope and field, and the movement scan errors.

## Final verification

Real PostgreSQL 17 was used at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` explicitly set.

- Backend full: **483 passed, 0 failed, 0 skipped**.
- Web full: **81 passed, 0 failed, 0 skipped**.
- Contracts full: **56 passed, 0 failed, 0 skipped**.
- OpenAPI/server route parity: **153 passed, 0 failed, 0 skipped**.

## Commits and pull requests

- Backend: `df90fa95fe3e2140b08783780ef0e1074d57a0ec` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `e827491dfabee7b926d3c724284cefd451381084` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `458d18f3ebe6473008868bb1363cbe45bf752ccf` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Platform: this completion report is committed on the same branch; no pull request exists for this branch.

## Working-tree confirmation

- Backend, web, and contracts working trees were clean after commit and push, with local HEAD matching `origin/feat/addendum-01-fix-request-07`.
- The platform repository retained only pre-existing untracked review/fix-request source files outside this exact done report; none were edited, removed, or included.
- The original open request remains present and unchanged.

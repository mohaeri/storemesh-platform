# Fix Request 50 — Completion report

## Part A — Location on every inventory object

- Added generic routine movement for `CONTAINER`, every `PACKAGE` level (`UNIT`, `CARTON`, `EPS`, `PALLET`), and `FRESH_SHIPPING_BOX`.
- Routine movement rejects terminal, locked, and another active-session-owned inventory.
- Location, operator, session, device, timestamp, and append-only movement history are persisted; audit records use `WAREHOUSE_LOCATION_CHANGED`.

## Part B — Location Correction adjustment

- Added `LOCATION_CORRECTION` to the existing inventory-adjustment request/approve/reject workflow.
- A reason and a second distinct approver are mandatory; self-approval is rejected.
- Correction changes the recorded location only and retains correction history and approval provenance.

## Part C — Emergency Relocation

- Added manager-only `/api/inventory-items/{itemType}/{itemId}/emergency-relocate` for containers, packages, and Fresh Shipping Boxes.
- A non-empty reason is mandatory; the operation intentionally bypasses lock and active-session ownership checks.
- Overrides are distinguishable through the dedicated `EMERGENCY_RELOCATION` audit event.
- Web UI and OpenAPI/contracts for routine moves, correction requests/approval, and emergency relocation shipped in the same round.

## Verification

Backend used an isolated real PostgreSQL 17 server at `127.0.0.1:55439`, with `DATABASE_URL=postgresql://postgres@127.0.0.1:55439/storemesh_fr50`; all migrations through the current set, including `056_inventory_object_locations.sql`, were applied.

- Part-specific backend: `# tests 8`, `# pass 8`, `# fail 0`, `# skipped 0`
- Full backend: `# tests 437`, `# pass 437`, `# fail 0`, `# skipped 0`
- Web: `# tests 71`, `# pass 71`, `# fail 0`, `# skipped 0`
- Contracts: `# tests 41`, `# pass 41`, `# fail 0`, `# skipped 0`
- Route parity: `139 method + route templates`
- Terminal: unaffected; no changes required.

## Commits and PRs

- site-server: `309dbbe6273a35af0e669b31cb89b240a145bd0d` (implementation commit `f02e2df`, exhaustive target/persistence test follow-up `309dbbe`) — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `92927ff0fa34dc0d877519709b602deb6ffe7d55` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `8444527de755cc418f430927416f28b8f73c4991` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: untouched; existing branch remains pushed.

All affected product repository working trees are clean after commit and push.

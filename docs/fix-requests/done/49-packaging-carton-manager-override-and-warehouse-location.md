# Fix Request 49 — Completion report

## Part A — Finished Goods warehouse transfer

- Packages now persist nullable `warehouseLocation` plus operator, session, device, time, and append-only warehouse movement history.
- Completed labeled CARTONs can be transferred to Finished Goods through `/api/packages/{packageId}/finished-goods`.
- Routine initial transfer is operator-accessible and emits `FINISHED_GOODS_TRANSFERRED`.

## Part B — Manager carton reopen

- Added manager-only, reason-required `REOPEN` from `READY_FOR_LABEL`, `PRINTING`, `LABEL_PENDING`, or `LABEL_PRINTED` back to `PACKING`.
- Existing active carton scans and children remain attached.
- Every issued label and print attempt is voided; resealing creates a new revision identity rather than reviving the stale physical label.
- Added scanner-backed UNIT removal from reopened cartons, after which operators can add another UNIT and reseal normally.
- Reopen emits the dedicated `CARTON_REOPENED` audit event.

## Part C — Manager-gated cancellation and relocation

- `CANCEL` remains operator-accessible for `DRAFT`/`PACKING`, but requires `override:approve` after sealing.
- Relocating an already-warehoused carton requires `override:approve` and a reason; its `FINISHED_GOODS_TRANSFERRED` event/history distinguishes relocation from initial transfer.
- Web UI ships Finished Goods location, manager reopen/cancel/relocation, current warehouse display, and hardware-scanned UNIT removal in this round.
- OpenAPI and route parity cover all new routes, fields, permissions, errors, and audit event types.

## Verification

Backend ran against real PostgreSQL with `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25`, migrations through 055, and zero skips.

- Backend: `# tests 429`, `# pass 429`, `# fail 0`, `# skipped 0`
- Web: `# tests 70`, `# pass 70`, `# fail 0`, `# skipped 0`
- Contracts: `# tests 40`, `# pass 40`, `# fail 0`, `# skipped 0`
- Route parity: `137 method + route templates`
- Terminal: unaffected; no changes required.

## Commits and PRs

- site-server: `15cca3b9f611394a730d349409b4543277006b17` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `5cc59b88cbea635cd4bb05a9b6f440fcf525e6a5` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `b6196942b5181138229f4405528f1e9e40383a73` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: untouched; existing branch remains pushed.

All affected repository working trees are clean after commit and push.

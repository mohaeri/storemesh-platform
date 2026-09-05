# Fix Request 96 — Completion Report

Status: completed and pushed

## Part results

1. Origin-side `DISPATCHED -> DELIVERED` is now fail-closed: `DELIVER` requires the signed `deliveryAcknowledgment` produced by a successful destination receive. A plain manual action is rejected with `TRANSFER_RECEIPT_REQUIRED`.
2. Destination receive now returns and durably stores a signed receipt containing `sourceSite`, `destinationSite`, `shipmentCode`, `manifestNonce`, the exact sorted `packageCodes`, receiver identity, receive time, and receipt ID. Origin verifies the signature and every correlation field before recording delivery.
3. Migration 074 persists both the destination acknowledgment and the origin delivery evidence (`deliveryReceiptId`, `deliveredAt`, `deliveredBy`, and acknowledgment payload).
4. The no-receipt reconciliation story is defined: the shipment remains `DISPATCHED`; after the configurable positive `SYSTEM_TIMEOUTS.internalTransferReceiptTimeoutMs` (72-hour default), the periodic server sweep raises exactly one open, operator-visible `INTERNAL_TRANSFER_RECEIPT_OVERDUE` HIGH exception. Repeated sweeps are deduplicated.
5. Real two-site PostgreSQL tests prove rejection of manual delivery, successful destination receipt followed by correlated origin delivery, persistence at both sites, and durable timeout signaling when no receipt arrives.
6. OpenAPI/contracts were updated for the changed receive response, DELIVER precondition/errors, correlation fields, and timeout reconciliation. No web implementation change was required because the current web application does not expose this internal-transfer transition workflow.

## Verification

- `storemesh-site-server`: real PostgreSQL 17 at `postgresql://postgres@127.0.0.1:55439/storemesh`, with `DATABASE_URL` explicitly set and migrations through 074 applied; full `node --test --test-reporter=junit`: **529 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`: full `node --test`: **73 passed, 0 failed, 0 skipped**.
- `storemesh-web`: unchanged; no FR96 test run required because it has no internal-transfer delivery UI.
- `git diff --check`: passed for both affected repositories before commit.

## Commits and pull requests

- Backend: `0d32bbc33790540ce85ff39427994adb3013b013` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts: `414c9e42fc1b0341efe778ad2ae905c9a55e9b5a` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Web: no FR96 commit; https://github.com/mohaeri/storemesh-web/pull/9 remains unchanged.
- Platform: this completion report is committed and pushed on the same upstream-synchronized branch; no platform PR exists for it.

## Working-tree confirmation

- Backend and web working trees are clean after push.
- Contracts has no remaining FR96 change; the pre-existing unrelated untracked `package-lock.json` remains untouched.
- Platform has no remaining FR96 change after the report commit; unrelated pre-existing specification, coordination, and scratch files remain untouched.
- The open request file was not edited or removed.

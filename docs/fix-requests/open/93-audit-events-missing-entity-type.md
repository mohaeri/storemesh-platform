# Fix Request 93 — Audit events record entityId but never entityType, breaking Object History for ambiguous UUIDs

## Problem

Source: `events-audit-review-2026-08-24.txt`, finding "H2 — entityType در Audit وجود ندارد": *"ساختار سند Business Object Type و ID را الزام می‌کند. Audit فقط entityId دارد و نوع شیء معمولاً باید از event type یا payload حدس زده شود. این برای UUIDهایی که در چند جدول محتمل‌اند و Object History نامناسب است."* ("The spec requires both Business Object Type and ID. Audit only has entityId — the object's type has to be guessed from the event type or payload, which is unworkable for UUIDs that could plausibly belong to several tables, and breaks Object History.") Re-verified against current `storemesh-site-server` at HEAD (`22dcc483d0780857c12079932cfcf12e1d07f0ec`): still open, unchanged from the review.

`eventEntityId(request, result)` (`src/domain.js`, line 145) resolves which UUID an audit event is about by checking a fixed list of fields (`entityId`, `batchId`, `containerId`, `deliveryId`, `shipmentId`, `packageId`, `cycleId`, `taskId`, `labelId`, `consumableId`, `salesOrderId`, `customerId`, `measurementId`, `id`) and falling back to result-object candidates — but it returns only the ID string, discarding which branch/field matched. `record()` (`src/domain.js`, line 149-153) then builds the audit event with `entityId` but no `entityType`:

```
const event = { id, site: this.site, sequence:++this.state.eventSequence, type, entityId:entityId??null, sessionId:session?.id??sessionId, deviceId, userId:context.userId??session?.operatorId??null, requestId, ipAddress:context.ipAddress??null, result, payload:eventPayload, beforeState, afterState, actorRoles:[...(context.roles??[])], actorStation:context.station??session?.station??null, occurredAt: this.clock(), schemaVersion:2 };
```

Confirmed no `audit_events` migration ever adds an `entity_type` column (checked `migrations/001_core.sql` through `068_audit_history_immutability.sql` — every `ALTER TABLE audit_events` is listed and none touches entity type). This is not a gap in vocabulary: the exact same type strings already exist and are used consistently elsewhere for the identical purpose — `raiseExceptionRecord({entityType:'CONTAINER',...})`, `inventoryQuantitySnapshot()`'s `add('BATCH',...)/add('PACKAGE',...)/add('CONSUMABLE',...)`, and the `inventory_ledger` table/contract (FR75) already carry `entityType` end-to-end. Audit is the one place this was never wired through, so today an `entityId` that happens to collide across `batches`/`containers`/`shipments`/etc. (all separate UUID spaces) cannot be resolved to a specific object's history without guessing from `type`/payload shape.

## Requirements

- Extend `eventEntityId` (or add a sibling resolver using the same field/branch order) to also return the matching `entityType` string, reusing the same type vocabulary already used by `raiseExceptionRecord`/`inventoryQuantitySnapshot`/the inventory ledger (`BATCH`, `CONTAINER`, `PACKAGE`, `SHIPMENT`, `CYCLE`, `TASK`, `LABEL`, `CONSUMABLE`, `SALES_ORDER`, `CUSTOMER`, `MEASUREMENT`, `DELIVERY`, etc., as applicable per field).
- Add `entityType` to the object built in `record()` and persist it via a new migration (`ALTER TABLE audit_events ADD COLUMN entity_type text`) — additive only, no backfill requirement beyond leaving existing rows' `entity_type` null.
- Include `entityType` in `GET /api/audit` responses and in whatever Cloud outbox / event-repository column list currently mirrors `entityId`.
- No date/time logic is involved in this fix; no timezone-specific test setup is required.

## Acceptance criteria

- A new backend test (real PostgreSQL, `DATABASE_URL` set, migration applied) asserting a representative spread of actions (e.g. `BATCH_SORTED` or similar batch action, a `PACKAGE_*` action, a `CONTAINER_*` action) produce audit events carrying the correct `entityType`, verified through a real PostgreSQL persist/reload — not just in-memory state.
- Full `storemesh-site-server` `node --test` run, real output with pass/fail/skip counts, at or above the current 522-passing baseline.
- Document the additive `entityType` field on the audit/event schema in `storemesh-contracts`, consistent with how `entityType` is already documented on `/api/inventory/{entityType}/{entityId}/ledger` and `/api/exceptions`.

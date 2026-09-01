# Fix Request 73 — Blocker Report

Status: BLOCKED

## Blocking contradiction

The requested database behavior cannot be implemented exactly as written without an unresolved design decision:

- Requirement 1 mandates a `BEFORE UPDATE OR DELETE` trigger on `audit_events` that raises an exception for DELETE.
- The existing `archiveHistory()` implementation legitimately moves audit rows with `DELETE FROM audit_events ... RETURNING *` inside a data-modifying CTE.
- Requirement 4 and the required regression test simultaneously require that existing archive-move flow to continue succeeding normally.

PostgreSQL fires the row-level `BEFORE DELETE` trigger for the DELETE inside that archive CTE. A blanket exception-raising trigger therefore necessarily blocks the mandated archive operation.

## Decision required

One exception mechanism must be explicitly authorized before implementation, for example:

1. Allow `archiveHistory()` to set a transaction-local guard that the trigger validates before permitting DELETE; or
2. Move archival into a controlled `SECURITY DEFINER` database function and permit DELETE only through that function; or
3. Revise the requirement so `audit_events` rejects UPDATE but permits DELETE used by archival.

These choices have materially different security and operational consequences. No option was selected by assumption.

## Scope and repository state

- No backend, contracts, or web code was changed for Fix Request 73.
- `outbox_events` was not changed, as explicitly required.
- No tests were claimed or run for an unimplemented solution.
- The original open request remains present and unchanged.
- Backend, web, contracts, and platform tracked working trees were clean before this blocker report was added.

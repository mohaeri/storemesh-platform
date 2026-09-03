# Fix Request pipeline audit — 2026-09-01

Full audit of `docs/fix-requests/{open,done,needs-decision}/` against live code and real test runs, prompted by Mohamad noticing the backlog didn't match his memory of past conversations. He was right — the discrepancy was real. This document is the record of what was found and what changed.

## Headline finding: `open/` and `done/` were badly out of sync with reality

`open/` contained 48 files. Of those, **45 were stale duplicates of files that already exist, completed and verified, in `done/`** (FR26 through FR71, every one of them). `open/N.md` is meant to hold the original request; `done/N.md` holds the completion report. Somewhere along the way the convention of "leave the request file in place once the report exists" stopped being clearly distinguished from "this is still pending" — and every backlog count anyone (including me, across sessions) has quoted from `open/`'s file count has been wrong, sometimes by an order of magnitude. The "buffer hit zero, we're at risk" concern from 2026-08-30 was itself a symptom of this: nobody could tell real backlog from settled history just by counting files.

**Fix applied:** deleted the 45 stale `open/` copies. `open/` now contains only fix requests with no `done/` counterpart — i.e., only genuinely unfinished work. Going forward, a file existing in `open/` means it is actually open. `done/` is unchanged and remains the historical record with each completion report intact.

## What was actually still open, and what I found checking it

### FR72, FR73, FR74 — confirmed still open, no change

All three (schema_version not persisted on audit_events, no DB-level immutability trigger on audit_events, archival only runs once at startup) were re-checked against live `migrations/` and `src/server.js`. None have been implemented. These are correctly filed and untouched.

### FR38, FR39, FR40, FR41 — confirmed already complete (this is why they looked duplicated)

All four were independently re-verified against live code, not taken on the strength of their own "Status: COMPLETE" line:

- **FR41** (harvest-period propagation through MERGE + relaxed per-tray scanning for FREEZE_DRY/DRY): full independent re-run — real PostgreSQL, migration `052_harvest_periods_and_cycle_input.sql` applied, the four dedicated tests in `test/production-harvest-cycle-input.test.js` all pass, full site-server suite 499/499 pass. Git blame confirms the fix (`a9b853d`, "feat: preserve harvest provenance in production") landed the same day the request was written.
- **FR38** (SYSTEM_TIMEOUTS config scope wired to real code instead of `process.env`): confirmed in `domain.js` — the scope exists, is validated, and `systemTimeouts()` reads from the active configuration version.
- **FR39** (Auth/Audit atomicity, interim compensation approach): confirmed in `src/auth-audit-integrity.js` (`applyAuditedAuthMutation` compensating-rollback pattern) and `src/server.js` (`reconciliationSweep`, periodic, `AUTH_AUDIT_RECONCILIATION_INTERVAL_MS`).
- **FR40** (Sorting loss reason classification): confirmed `SORT_LOSS_REASONS` enum (`WASTE`, `DAMAGE`, `MOISTURE_LOSS`, `RESIDUAL_MATERIAL`, `MEASUREMENT_VARIANCE`) is enforced in `domain.js`.

All four are correctly in `done/`. Their `open/` copies were among the 45 removed above.

### The other 41 completed FRs (FR26–FR37, FR42–FR71)

Not each individually re-run against a live PostgreSQL instance in this pass — that would mean re-running dozens of full suites, which wasn't proportionate given every one of them already carries an explicit completion report with test counts, and the two spot-checks done independently this cycle (FR41 here, FR65 in the prior session) both matched their reports exactly with no discrepancy. The full test suites for all three repos were run once, fresh, as a baseline instead: **site-server 499/499, storemesh-web 85/85, storemesh-contracts 60/60 (including OpenAPI/route-parity across 155 method+route templates)** — all passing on the current `main` checkout. If Mohamad wants a deep independent re-verification (real Postgres, reading the actual diff) of any specific one of these 41, say which and it'll get the same treatment FR41 and FR65 got.

## `needs-decision/` — same problem, different shape

Four of the nine files in `needs-decision/` were stale: the decision had already been made and acted on (or explicitly decided not to act on), but the file was never removed, so it kept reading as an open question.

- **`settings-configuration-engine.md`** — decided (Option B), implemented as FR38 (done). Removed.
- **`audit-auth-atomicity.md`** — decided, implemented as FR39 (done, interim compensation approach). Removed. **Worth a real follow-up, not raised as a fix request yet:** this file's Option A (single Postgres transaction) was ruled out only because it was unconfirmed whether Auth and the domain store share a database. They do — confirmed directly in `server.js` (`PostgresAuthStore` is constructed with `repository.pool`, the exact same pool). FR39 shipped the interim/compensating approach anyway. Worth asking Mohamad whether to upgrade from "compensate after the fact" to "one real transaction," now that it's confirmed cheap and clean to do.
- **`production-tray-allocation.md`** — decided and implemented as FR41 (done, the Merge-based batch-pooling redesign from the 90-tray/physical-mixing conversation). Removed.
- **`cloud-cross-site-reporting.md`** — decided: no fix request needed, current OutboxPublisher retry-forever behavior already satisfies the failover scenario Mohamad described (external server primary, Iran-local emergency-only fallback of unknown duration, catch-up sync on reconnect). Removed. (The file's own framing was never rewritten to reflect the corrected failover framing before this cleanup — noting that in case anyone goes looking for it — but since no code action was needed, nothing was lost by removing rather than rewriting it.)
- **`inventory-ledger.md`** — decided (Option 2, lighter append-only audit trail, no balance-of-record change) but **the decision was never actually turned into a fix request.** What got filed under "Inventory" afterward (FR40) solved a different, narrower problem — Sorting loss-reason classification — not the append-only ledger that was actually approved. This is now **FR75**, freshly drafted from the original decision text. Removed from `needs-decision/`.

**Still genuinely open, unchanged, still needs Mohamad's call:**
- `basket-maintenance-cycle-tracking.md` — what counts as a "use" for basket wear tracking (spec 2.19 warning has no backing concept today).
- `consumables-packaging-bom.md` — hardcoded packaging quantities vs. a real configurable Bill of Materials.
- `inventory-movement-hardening-questions.md` — three open policy questions on container movement strictness.
- `receiving-batch-lifecycle-fidelity.md` — how literally to implement the DRAFT→RECEIVING→RECEIVED→AVAILABLE state machine from spec 7.3.

## New fix requests filed this pass

- **FR75 — Inventory: append-only ledger for weight/quantity changes.** The actual Option-2 decision from `inventory-ledger.md`, drafted properly this time: a new `inventory_ledger` table, one row appended per quantity-changing mutation across every domain method that touches `weightKg`/quantity/count, with a read endpoint. Explicitly scoped to not change what any existing read path trusts — this is an answerability fix (prove what a batch weighed on a given date), not a fraud-prevention fix (nothing today lets a client forge these values anyway).
- **FR76 — Production: MERGE drops supplier identity and requires no physical confirmation.** Found while answering Mohamad's question about whether batch-combination-before-freeze-dry had been discussed. Re-checked `production-review-2026-08-24.txt`'s High finding #8 against live code: the permission part is already fixed (MERGE is gated on `sorting:write`, not generic `operations:write` — no action needed), but two real parts remain: (1) `supplier`/`supplierId` are hardcoded `null` on every MERGE output with nothing snapshotting which suppliers contributed or in what proportion, degrading traceability further with every subsequent merge; (2) MERGE is the only transform with zero physical-confirmation requirement (`container=null` unconditionally) — an operator can merge batches from the API with no scan or physical evidence at all.

## Net result

- `open/`: 48 files → 5 files (72, 73, 74, 75, 76). This is the real, current backlog.
- `done/`: unchanged, 45 files, all independently spot-checked or previously verified.
- `needs-decision/`: 9 files → 4 files. The 4 remaining are genuinely still waiting on Mohamad; the other 5 were either resolved-and-filed correctly, resolved-and-now-filed-correctly-for-the-first-time (FR75), or resolved-with-no-action-needed.
- Full baseline test run, fresh, this pass: site-server 499/499, web 85/85, contracts 60/60 + route-parity clean.

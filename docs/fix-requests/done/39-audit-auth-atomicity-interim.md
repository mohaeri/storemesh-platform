# Fix Request 39 — Completion report

## Results by Part

- Part C: role grant/revoke and badge/PIN regeneration now use a shared audited-mutation boundary. The Auth write is flushed first; audit recording and Domain persistence are then flushed before success is returned. Any audit/persistence failure triggers a best-effort inverse Auth mutation, logs a compensation failure if that inverse operation also fails, and always propagates the original error.
- Badge and PIN rollback restores the previous credential hash rather than merely clearing a previously-issued credential. Role rollback revokes a failed grant or restores a failed revoke.
- Part D: a periodic, non-mutating reconciliation batch compares current Auth roles/badge/PIN state with durable Domain audit history. It reports missing grants, state disagreements, and credential fingerprint mismatches as structured warning records. The interval is configurable through `AUTH_AUDIT_RECONCILIATION_INTERVAL_MS`; the routine is also exposed on the server for an explicit batch run.
- No public route or response shape changed, so contracts and web UI were unchanged.

## Verification

- Focused backend tests, including all four compensation paths, mismatch detection, and a real PostgreSQL reload: **4 / 4 pass / 0 fail / 0 skipped**.
- Full backend, real PostgreSQL (`DATABASE_URL` set): **388 / 388 pass / 0 fail / 0 skipped**.
- Web, contracts, and terminal unchanged.

## Commits and PRs

- site-server: `3a95777` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web/contracts/terminal: unchanged.

All affected implementation repository working trees are clean after push.

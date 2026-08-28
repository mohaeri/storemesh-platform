# Fix Request 33 — Completion report

Status: complete and pushed.

## Part A — Monotonic sequence on every Event

- Added a per-site `eventSequence` counter initialized from the maximum persisted Audit/Outbox sequence.
- Every `record()` call now assigns a strictly increasing sequence to the shared Audit/Outbox envelope, including success and failure events.
- Migration `048_event_sequence.sql` adds and backfills `audit_events.sequence` in deterministic `(occurred_at,id)` order and creates the `(site_id,sequence)` index.
- Site PostgreSQL save/load preserves sequence; restart resumes above the persisted maximum.
- Outbox Publisher now sorts by `(site,sequence)`, independent of timestamp collisions.
- Cloud PostgreSQL adds `sequence`, persists it, reloads it after restart, indexes `(site,sequence)`, and returns events in deterministic site/sequence order.
- Audit and Outbox API envelopes expose sequence without removing `occurredAt`.
- Web Audit displays and sorts by sequence. The contracts repo documents sequence as an additive int64 Event field.

## Verification

PostgreSQL 17 was running with `DATABASE_URL=postgresql://postgres@127.0.0.1:5432/storemesh_fr25`; migration 048 was applied.

- Backend focused sequence suite: `3 tests / 3 pass / 0 fail / 0 skipped`, including identical timestamps, publisher order, and PostgreSQL restart/resume.
- Backend full suite: `367 tests / 367 pass / 0 fail / 0 skipped`.
- Cloud: `10 tests / 10 pass / 0 fail / 0 skipped`, including real PostgreSQL repository restart.
- Web: `58 tests / 58 pass / 0 fail / 0 skipped`.
- Contracts: `24 tests / 24 pass / 0 fail / 0 skipped`; route parity verified `120 method + route templates`.
- Terminal regression baseline: `17 tests / 17 pass / 0 fail / 0 skipped` (no terminal changes).

## Commits and PRs

- site-server: `7bff250840f10c0e51994ee470b6c9f46ea9d4c1` — https://github.com/mohaeri/storemesh-site-server/pull/21
- cloud: `dcdeae0282018ba4313cd4731cebd960662b2dd0` — https://github.com/mohaeri/storemesh-cloud/pull/1
- web: `90882e077545b10046895e01016b5e46848cf2a6` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `576895db16802bfb929f81cfda4f99227d914b8e` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected branches were pushed. Site-server, cloud, web, contracts, and unchanged terminal working trees are clean.

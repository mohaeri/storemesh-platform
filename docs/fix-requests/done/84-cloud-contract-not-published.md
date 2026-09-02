# Fix Request 84 — Completion report

Status: COMPLETED

## Results

- Added a separate `openapi/storemesh-cloud.yaml` because the existing `storemesh.yaml` convention is explicitly the StoreMesh Site API contract.
- Published the cloud aggregator's `GET /health`, `GET /ready`, `GET /api/summary`, and `POST /api/events` operations without changing cloud behavior.
- Documented `X-Cloud-Report-Key`, required `X-Site-Code` and `X-Site-Key`, and optional `X-Site-Key-Id` with its `current` default.
- Documented the per-site `CONNECTED`, `STALE`, and `PENDING` states and the complete event-ingest result, including accepted, duplicate, rejected, total, and checkpoint fields.
- Extended route extraction for the cloud server's real `req.url` route style and added a test that reads the actual `storemesh-cloud/src/server.js` source rather than a copied route list.
- No `storemesh-cloud`, `storemesh-site-server`, or `storemesh-web` behavior changed.

## Verification

- Full `storemesh-contracts` `node --test`: **64 passed, 0 failed, 0 skipped**.
- Site route parity: **156 method/route templates verified**.
- Cloud route parity against the real cloud server source: **4 method/route templates verified**.
- `storemesh-contracts` working tree was clean and the branch was **0 behind / 0 ahead** after push.
- Platform contains pre-existing unrelated local coordination/review files and the tracked `docs/anbarsys-spec.md` modification; none were included in this request's commits.

## Commits and pull requests

- `storemesh-contracts`: `7e5e491a876e2e9166056764dff2c4ebd8348b01` — https://github.com/mohaeri/storemesh-contracts/pull/8
- `storemesh-platform` completion report: pending
- `storemesh-cloud`: unaffected
- `storemesh-site-server`: unaffected — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-web`: unaffected — https://github.com/mohaeri/storemesh-web/pull/9

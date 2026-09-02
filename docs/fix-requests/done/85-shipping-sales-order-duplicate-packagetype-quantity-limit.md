# Fix Request 85 — Completion report

Status: COMPLETED

## Results

- Chose the recommended invariant: one Sales Order line per `packageType`, because the domain has no line identity or product discriminator for repeated package-type lines.
- `createSalesOrder` now rejects repeated package types with `SALES_ORDER_ITEM_TYPE_DUPLICATE`.
- The same invariant is enforced before shipment creation and again before the SHIP transition, protecting legacy or externally loaded orders that already contain duplicate types.
- Published the new 409 error and uniqueness rule in the site OpenAPI contract; no request or response fields changed, so no web change was required.

## Verification

- Focused backend tests with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **2 passed, 0 failed, 0 skipped**.
- Full backend `node --test`, same real PostgreSQL database: **518 passed, 0 failed, 0 skipped**.
- Full `storemesh-contracts` `node --test`: **65 passed, 0 failed, 0 skipped**.
- Site route parity: **156 method/route templates verified**; Cloud route parity: **4 verified**.
- Backend working tree was clean and synced after push.
- Contracts tracked working tree was clean and synced after push; an unrelated untracked `package-lock.json` was present and excluded.
- Platform contains pre-existing unrelated local coordination/review files and the tracked `docs/anbarsys-spec.md` modification; none were included in this request's commits.

## Commits and pull requests

- `storemesh-site-server`: `02ab50621783f9927b1fbac9787ce1bd5d86d0eb` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-contracts`: `06f5f5f2850348d05711e229bf96e3b6b2f7bbc8` — https://github.com/mohaeri/storemesh-contracts/pull/8
- `storemesh-platform` completion report: pending
- `storemesh-web`: unaffected — https://github.com/mohaeri/storemesh-web/pull/9

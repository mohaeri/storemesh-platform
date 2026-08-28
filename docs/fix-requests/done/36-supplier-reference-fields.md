# Fix Request 36 — Completion report

## Part A — Supplier reference fields

- Added supplier-only optional `contactName`, `contactPhone`, `contactEmail`, `region`, and `settlementReference` fields.
- Values are trimmed and a supplied blank value is rejected; suppliers without optional fields and all other reference catalogs retain existing behavior.
- Added migration `050_supplier_reference_fields.sql` and complete PostgreSQL save/load mapping.
- Added permission-gated supplier create/edit fields to Master Data UI.
- Published the additive `SupplierReference` shape in OpenAPI.

## Verification

- Focused backend PostgreSQL tests: **2 / 2 pass / 0 fail / 0 skipped**.
- Full backend, real PostgreSQL (`DATABASE_URL` set): **377 / 377 pass / 0 fail / 0 skipped**.
- Web: **60 / 60 pass / 0 fail / 0 skipped**.
- Contracts: **26 / 26 pass / 0 fail / 0 skipped**; route parity **122 method + route templates**.
- Terminal unchanged.

## Commits and PRs

- site-server: `7f53859` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web: `f88731b` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts: `26eb773` — https://github.com/mohaeri/storemesh-contracts/pull/8
- terminal: unchanged.

All affected implementation repository working trees are clean after push.

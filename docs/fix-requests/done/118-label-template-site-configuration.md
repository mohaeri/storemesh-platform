# Fix Request 118 — Completion report

Status: completed and pushed on 2026-09-06.

## Results

- Added the versioned, approved, active per-site `LABEL` configuration scope.
- Label fields can now be selected independently for `BASKET`, `TRAY`, `PACKAGE`, `CARTON`, and `FRESH_SHIPPING_BOX`, covering barcode, weight, harvest/pack date, QR traceability, product, grade, size, source batch, content count, shipment, customer, and container type.
- Production printing now fails closed with `LABEL_CONFIGURATION_NOT_CONFIGURED` until the site activates a `LABEL` configuration.
- Reprint allowed reasons, manager-approval rules by object type, and excessive-reprint threshold now come from the active `LABEL` version. A legacy `PRINTING` threshold cannot override the configured `LABEL` threshold.
- Package, carton, container, and fresh-shipping-box label payloads are filtered through the active site template before persistence.
- Added the web configuration authoring/activation example and updated the OpenAPI contract for the new scope, field set, errors, and reprint behavior.

## Verification

- `storemesh-site-server`, focused FR118 and label-reprint tests on real PostgreSQL: **7 passed, 0 failed, 0 skipped**.
- `storemesh-site-server`, complete suite on real PostgreSQL with `DATABASE_URL=postgresql://postgres@127.0.0.1:55441/storemesh_fr118_test`: **538 passed, 0 failed, 0 skipped**.
- `storemesh-web`, complete suite with the same real PostgreSQL database: **99 passed, 0 failed, 0 skipped**.
- `storemesh-contracts`, complete suite: **77 passed, 0 failed, 0 skipped**.
- Contract route parity: **160 site-server routes and 8 cloud-server routes verified**, with 0 failures.
- The FR118 PostgreSQL test proves fail-closed printing, different field sets for equivalent carton labels at two sites, configuration-owned allowed reasons and thresholds, and persistence after repository reload.

## Commits and pull requests

- `storemesh-site-server`: `c85e771b7b93728cd1a7c70548d9976f3aad06c4` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-web`: `30a5e2c2c98fff186173cfcbd434fb59587aab6d` — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: `70593dc39fb085ac98dc91ed8f9e9128b61fe0a9` — https://github.com/mohaeri/storemesh-contracts/pull/8
- Completion report: committed and pushed in `storemesh-platform` on its current branch; that branch has no open pull request.

## Working tree

- `storemesh-site-server`, `storemesh-web`, and `storemesh-contracts`: clean and synchronized with their remotes after push.
- `storemesh-platform`: the FR118 report is the only FR118 change; pre-existing unrelated local coordination/specification changes remain untouched, so the overall platform working tree is not clean.
- The source file in `open/` was not edited or removed.

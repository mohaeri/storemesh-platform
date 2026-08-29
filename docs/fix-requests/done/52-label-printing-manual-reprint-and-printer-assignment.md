# Fix Request 52 — Completion report

Completed and pushed on `feat/addendum-01-fix-request-07`.

## Part A — Reprint an object's existing label

- Added `POST /api/labels/reprint`, searching active baskets, trays, packages, cartons, and fresh shipping boxes by code or id.
- Reuses the original printed label identity and its monotonic attempt counter; no new business identity is generated.
- Enforces the eight fixed reason codes and returns distinct `ORIGINAL_LABEL_MISSING` when no original printed label exists.
- Added configurable `PRINTING.reprintApprovalByType` rules, defaulting basket/tray to operator access and package/carton/fresh-box to `override:approve`.
- The existing failed-job verified-scan retry path remains unchanged and uses the same excessive-reprint warning.

## Part B — Workstation-to-printer routing

- Print jobs created with an operational session resolve the active default PRINTER assigned to that session's workstation.
- Added `POST /api/print-jobs/{jobId}/printer` for a one-job override.
- Persisted `defaultPrinterId`, `selectedPrinterId`, `printerOverride`, and the search-reprint reason on each attempt; successful audit records include the selected printer.
- Added migration `060_label_reprint_printer_routing.sql` and shipped the reprint/printer controls in the web printing page.

## Verification

Real PostgreSQL: `postgresql://postgres@127.0.0.1:55439/storemesh_fr50` with `DATABASE_URL` set; migration 060 applied.

- Backend focused: `node --test test/label-reprint-printer-routing.test.js` — tests 6, pass 6, fail 0, cancelled 0, skipped 0, todo 0.
- Backend regression focused: new tests plus Fresh Shipping Box retry regression — tests 10, pass 10, fail 0, cancelled 0, skipped 0, todo 0.
- Backend full: `node --test` — tests 449, pass 449, fail 0, cancelled 0, skipped 0, todo 0.
- Web full: `node --test` — tests 74, pass 74, fail 0, cancelled 0, skipped 0, todo 0.
- Contracts full: `node --test` — tests 44, pass 44, fail 0, cancelled 0, skipped 0, todo 0; route parity verified 142 method/route templates.
- Terminal: unaffected; no terminal changes or tests required.

## Commits and PRs

- Backend: `911cfeb58fed1d61f21270c841f41156deaf176e` — https://github.com/mohaeri/storemesh-site-server/pull/21
- Web: `9d725ca488f6bf025e1c35c045404e99793d2993` — https://github.com/mohaeri/storemesh-web/pull/9
- Contracts: `3b39ba898a274cb9ba1edeb5c88263c7770830d0` — https://github.com/mohaeri/storemesh-contracts/pull/8

All three affected product-repository working trees were clean after commit and push.

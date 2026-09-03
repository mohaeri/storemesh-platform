# Fix Request 92 — Fresh Export allowed net weights fall back to client-supplied list when FRESH_EXPORT is unconfigured

## Problem

Source: `fresh-export-review-2026-08-24.txt`, finding "[بالا] 8. اندازه Net واقعاً قابل تنظیم نیست و از client قابل دورزدن است" ("Net size isn't really configurable and can be bypassed by the client"): backend trusts `input.allowedWeightsKg`; a client can send an arbitrary list and make any `unitWeight` appear allowed. Re-verified against current `storemesh-site-server/src/domain.js` (HEAD `22dcc483d0780857c12079932cfcf12e1d07f0ec`): still open, unchanged from the review. Same class of fail-open-when-unconfigured bug FR88 already fixed for `STATION_MACHINES` and FR91 (filed alongside this one) targets for `PACKAGING`.

`createFreshNetLot` (`src/domain.js`, line 332) still resolves the allowed net-weight list with a client fallback:

```
active=this.state.configurationVersions.find(x=>x.scope==='FRESH_EXPORT'&&x.status==='ACTIVE'),configured=active?.values?.allowedNetWeightsKg??input.allowedWeightsKg??[.25,.5,1,5,7];if(!Array.isArray(configured)||!configured.map(Number).includes(unitWeightKg))throw new DomainError('FRESH_NET_CONFIGURATION_INVALID', ...)
```

If no active `FRESH_EXPORT` configuration exists (or it omits `allowedNetWeightsKg`), the validator falls back to whatever list the client itself supplied in `input.allowedWeightsKg` — the "allowed net weight" check becomes self-referential and vacuous, or silently accepts the hardcoded `[.25,.5,1,5,7]` list regardless of what the site actually wants to sell.

## Requirements

- In `createFreshNetLot`, drop the `input.allowedWeightsKg` and hardcoded `[.25,.5,1,5,7]` fallbacks entirely.
- Require an active `FRESH_EXPORT` configuration with a non-empty `allowedNetWeightsKg` array before any net lot can be created; reject otherwise with a new `FRESH_EXPORT_NET_WEIGHTS_NOT_CONFIGURED` error (409), before any other side effect (container claim, source-batch mutation) runs.
- Leave every other `createFreshNetLot` validation (source status/destination, product/grade/size matching, inventory sufficiency) unchanged; this is scoped only to the allowed-net-weights resolution.
- No date/time logic is involved in this fix; no timezone-specific test setup is required.

## Acceptance criteria

- A new backend test (real PostgreSQL, `DATABASE_URL` set, migrations applied) covering `createFreshNetLot` with (a) no active `FRESH_EXPORT` configuration and a client-supplied `allowedWeightsKg` that includes the requested `unitWeightKg`, asserting `FRESH_EXPORT_NET_WEIGHTS_NOT_CONFIGURED` rather than silent acceptance; (b) an active `FRESH_EXPORT` configuration with `allowedNetWeightsKg` set, asserting matching and non-matching `unitWeightKg` behave as before.
- Full `storemesh-site-server` `node --test` run, real output with pass/fail/skip counts, at or above the current 522-passing baseline.
- If the error contract changes (new error code), document it in `storemesh-contracts` with route-parity/schema coverage consistent with the existing `FRESH_NET_CONFIGURATION_INVALID` documentation.

# Fix Request 91 — UNIT package weight tolerance and target weight fall back to client-supplied values when PACKAGING is unconfigured

## Problem

Source: `packaging-review-2026-08-24.txt`, finding "[بحرانی] 2. client می‌تواند تلرانس تنظیم‌شده را دور بزند" ("client can bypass the configured tolerance"): `createPackage` accepts `input.tolerancePercent` and `input.targetWeightKg` from the caller and only prefers the active `PACKAGING` configuration's values when present. Re-verified against current `storemesh-site-server/src/domain.js` (HEAD `22dcc483d0780857c12079932cfcf12e1d07f0ec`): still open, unchanged from the review. Same class of fail-open-when-unconfigured bug FR88 already fixed for `STATION_MACHINES`.

`createPackage` (`src/domain.js`, line 363) still resolves target and tolerance with client fallbacks baked in:

```
target=Number(packagingValues.targetWeightsByPackageType?.[input.type]??packagingValues.targetWeightKg??input.targetWeightKg);enforcedTarget=target;appliedTolerance=Number(packagingValues.weightTolerancePercent??input.tolerancePercent??2);
```

If the active `PACKAGING` configuration doesn't set `targetWeightsByPackageType`/`targetWeightKg` for the package type, or doesn't set `weightTolerancePercent`, the caller's own `input.targetWeightKg`/`input.tolerancePercent` (or, failing that, a hardcoded 2%) is used to decide whether a UNIT package passes the weight-tolerance check. A caller can submit `tolerancePercent: 999` (or set `targetWeightKg` to match its own reported `actual` weight) and finalize a UNIT package regardless of the real measured weight, on any site that hasn't explicitly configured `PACKAGING` tolerance/target values yet.

## Requirements

- In `createPackage`, when resolving `target` and `appliedTolerance` for a UNIT package, drop the `input.targetWeightKg`, `input.tolerancePercent`, and hardcoded `2` fallbacks entirely.
- If the active `PACKAGING` configuration has no `weightTolerancePercent`, or no usable target (`targetWeightsByPackageType[input.type]` and no `targetWeightKg`), reject UNIT package creation with a new `PACKAGING_TOLERANCE_NOT_CONFIGURED` error (409) before the weight comparison runs — do not silently default.
- Leave the CARTON/BASKET (non-UNIT) packaging paths and every other `createPackage` validation untouched; this is scoped only to the UNIT target/tolerance resolution.
- No date/time logic is involved in this fix; no timezone-specific test setup is required.

## Acceptance criteria

- A new backend test (real PostgreSQL, `DATABASE_URL` set, migrations applied) covering `createPackage` UNIT creation with (a) no active `PACKAGING` configuration and a large client-supplied `tolerancePercent`, asserting `PACKAGING_TOLERANCE_NOT_CONFIGURED` rather than silent acceptance; (b) an active `PACKAGING` configuration with `targetWeightKg`/`weightTolerancePercent` set, asserting normal in-tolerance and out-of-tolerance behavior is unchanged.
- Full `storemesh-site-server` `node --test` run, real output with pass/fail/skip counts, at or above the current 522-passing baseline.
- If the error contract changes (new error code), document it in `storemesh-contracts` with route-parity/schema coverage consistent with the existing `PACKAGE_WEIGHT_OUT_OF_TOLERANCE` documentation.

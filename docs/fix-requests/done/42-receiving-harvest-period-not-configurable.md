# Fix Request 42 — Completion Report

Status: completed, committed, and pushed.

## Part A — Configured Harvest Period in Receiving

- Receiving now accepts optional `harvestPeriodId`; otherwise it resolves the active configured period covering the server date.
- Missing/invalid configured coverage fails with `HARVEST_PERIOD_NOT_CONFIGURED`.
- Batches persist `harvestPeriodId`, scalar code, and complete `harvestPeriods` provenance.
- The web receiving form requires an active configured period selection.

## Part B — Inter-site provenance

- Signed transfer manifest items include nullable `harvestPeriod` and `harvestPeriodId`.
- Destination batches explicitly retain those values; legacy manifests produce explicit null/empty provenance.

## Verification

- Backend focused PostgreSQL tests: **4/4 pass, 0 fail, 0 skipped**.
- Backend full real-PostgreSQL suite: **399/399 pass, 0 fail, 0 skipped**.
- Web: **63/63 pass, 0 fail, 0 skipped**.
- Contracts: **33/33 pass, 0 fail, 0 skipped**.
- Route parity: **123 method + route templates verified**.

## Commits and PRs

- site-server `f601422` — https://github.com/mohaeri/storemesh-site-server/pull/21
- web `b9f5f32` — https://github.com/mohaeri/storemesh-web/pull/9
- contracts `c2abde1` — https://github.com/mohaeri/storemesh-contracts/pull/8

All affected implementation worktrees are clean. Terminal was not affected.

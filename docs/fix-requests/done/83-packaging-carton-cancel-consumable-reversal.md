# Fix Request 83 — Completion report

Status: COMPLETED

## Results

- Cancelling a CARTON-level `CARTON` package now restores every matching `CARTON_CREATED` consumable debit for that package.
- Each restoration writes a `REVERSAL` ledger transaction with `reason: 'CARTON_CANCELLED'` and the cancelled package ID as `entityId`.
- Consumable threshold evaluation now resolves an open `CONSUMABLE_SHORTAGE` once stock is positive again.
- The CARTON DAMAGE path remains unchanged and does not restore physically consumed stock.
- Route, request, and response shapes did not change, so no contracts or web changes were required.

## Verification

- Focused cancellation/reversal tests with `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55439/storemesh`: **2 passed, 0 failed, 0 skipped**.
- Full backend `node --test`, using the same real PostgreSQL database: **516 passed, 0 failed, 0 skipped**.
- Backend working tree was clean and the branch was **0 behind / 0 ahead** after push.
- Platform contains pre-existing unrelated local coordination/review files and the tracked `docs/anbarsys-spec.md` modification; none were included in this request's commits.

## Commits and pull requests

- `storemesh-site-server`: `454d952980caec0dc034bed3830055a6cb307ec3` — https://github.com/mohaeri/storemesh-site-server/pull/21
- `storemesh-platform` completion report: `64e6fd19e6228a3ac24bd49e3065cf1b7f2f29fe`
- `storemesh-web`: unaffected — https://github.com/mohaeri/storemesh-web/pull/9
- `storemesh-contracts`: unaffected — https://github.com/mohaeri/storemesh-contracts/pull/8

# Fix Request 79 — Blocker Report

Status: BLOCKED

## Unresolved design contradiction

The request requires all of the following:

- increment usage only for a container whose `type` is exactly `BASKET`;
- configure thresholds keyed by container type;
- prove that “two basket types” with different thresholds warn at different cycle counts.

The current container model has a single `BASKET` type and no basket subtype, material, size class, maintenance profile, or other durable discriminator. Consequently, two different thresholds cannot be assigned to two kinds of baskets without inventing a new data-model field that the request does not define. Treating `BASKET` and `CRATE` as the two types would conflict with the explicit requirement that only `BASKET` receiving cycles increment.

## Decision required

Choose one explicit model:

1. Add a durable basket maintenance-profile/subtype field and key thresholds by that new field.
2. Count both `BASKET` and `CRATE` as receiving-container types and key thresholds by the existing `type` field.
3. Keep only one `BASKET` threshold and remove the two-type acceptance test.

No implementation was started because choosing among these options changes the database, API/container shape, contracts, web UI, and required tests.

## Verification and repository state

- No backend, web, or contracts tests were run for FR79 because implementation is blocked before Part 1.
- No backend, web, or contracts commits were created for FR79.
- Backend, web, and contracts tracked working trees remain clean at their pushed HEADs from earlier completed requests.
- Platform retains the pre-existing unrelated tracked edit to `docs/anbarsys-spec.md` plus pre-existing untracked local coordination/review files; neither is included in this blocker-report commit.
- The original `open/79-basket-maintenance-warning.md` remains unmodified and was not removed.

## Pull requests

- No FR79 pull request exists because no implementation was authorized past the unresolved model decision.
- Platform blocker report: recorded by the commit containing this file; this branch has no pull request.

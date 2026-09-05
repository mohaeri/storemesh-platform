# Fix Request 98 — Blocker Report

Status: blocked — explicit product decision required

## Blocking ambiguity

The request explicitly says not to implement the zone gates, process rules, numbering schemes, or label-template portion until Mohamad decides which items are legitimate runtime configuration knobs and which must remain code-level workflow architecture. No decision resolving that scope exists in `open/`, `needs-decision/`, or the other fix-request coordination files currently available.

Implementing only task priorities and receiving variance would leave the same Fix Request partially complete, while moving any of the undecided structural rules into Configuration would require guessing beyond the authorized requirements. Work therefore stopped before any FR98 code change.

## Decision required

For each category below, choose either **runtime configurable** or **intentional code-level architecture**:

1. Zone gates (`CONTAINER_GATES` and related station/zone eligibility rules).
2. Process definitions and transition rules (`PROCESS_RULES` and related state-machine structure).
3. Numbering schemes for tasks and operational entities.
4. Label templates and label-behavior rules.

If a category is runtime configurable, the decision must also state whether absence of an active configuration should fail closed or use a documented default during a transition period.

## Work and verification

- No backend, contracts, or web source was changed for FR98.
- No FR98 test was run because implementation did not begin.
- Backend, contracts, and web remain at their previously pushed FR97 state.
- The open request file was not edited or removed.
- Unrelated pre-existing platform specification, coordination, and scratch changes remain untouched.

## Pull requests

- Backend (unchanged by FR98): https://github.com/mohaeri/storemesh-site-server/pull/21
- Contracts (unchanged by FR98): https://github.com/mohaeri/storemesh-contracts/pull/8
- Web (unchanged by FR98): https://github.com/mohaeri/storemesh-web/pull/9
- Platform: this blocker report is committed and pushed on the existing branch; no platform PR exists for it.

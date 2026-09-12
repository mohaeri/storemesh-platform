# UI / Backend Change Control

Last updated: 2026-09-12

## Standing rule

- Product review and Figma prototype work is UI-only by default.
- Do not change `storemesh-site-server`, `storemesh-cloud`, or API/event contracts merely to make a proposed UI flow work.
- If requested UI behavior does not match the implemented backend or published contract, explain the mismatch to Mohamad before implementation.
- Backend or contract changes require Mohamad's explicit approval.
- After approval, record the decision, affected behavior, repositories, routes/events, migrations, tests, commit SHAs, PR links, and deployment notes in this document.
- Simulated prototype behavior must not be presented as proof of backend support.
- Finalized documentation changes must be committed and pushed. Unrelated local changes must not be included.

## Open UI/backend alignment notes

### 2026-09-11 — Multi-input Sorting, operator routing, and exact genealogy

- Approval and decision: Mohamad explicitly replaced the earlier single-input/manager-preapproval model. A sorting expert may lock multiple same-product baskets, weigh outputs one by one, and assign each output's final destination immediately. A manager is involved only for a later override, which requires a reason.
- UI requirement: Sorting shows multiple scanned inputs, one-at-a-time output weighing into existing reusable baskets, final grade/size, final destination, mass balance/loss reason, and exact per-output parent weight contributions.
- Existing backend/contract mismatch: the earlier implementation accepted only one input through the HTTP form, treated destination assignment as a later manager step, allowed conventional drying directly after Sorting, and always routed completed Freezing to Freeze Drying.
- Approved backend behavior: final destinations are `FRESH_EXPORT`, `DRYING`, `FREEZING`, `FREEZE_DRYING`, `QC`, `COLD_ROOM_CLEAN`, `COLD_ROOM_DIRTY`, or `WASTE`. Washing is not a destination. `DRYING`, `FREEZING`, and `FREEZE_DRYING` automatically start with Washing then Slicing. `FREEZING` ends at Packaging; `FREEZE_DRYING` continues from Freezing to Freeze Drying and then Packaging. Fresh Export is rejected by Washing. Multi-input output genealogy contains only declared contributing parents, with positive contributions summing exactly to the output weight; supplier/harvest provenance follows those parents.
- Repositories and files: `storemesh-site-server` domain/auth/server and tests; `storemesh-contracts` OpenAPI and contract tests; `storemesh-web` production UI and tests; `storemesh-platform` Figma source/prototype tests and this specification/change record.
- Routes, requests, responses, or events: `POST /api/sorting` accepts `inputs[]`; every `outputs[]` item includes `destination` and, for multi-input work, `parentContributions[]`. The existing destination endpoint remains for backward compatibility and a reasoned manager override remains separate.
- Database/migration impact: none; the repository already persists complete batch state, including destination, parents, and contribution arrays.
- Tests and real PostgreSQL result: `storemesh-site-server` 542 passed, 0 failed, 0 skipped against PostgreSQL 17 with `DATABASE_URL` set; `storemesh-contracts` 78 passed, 0 failed, 0 skipped plus parity for 160 site and 8 cloud method/route templates; `storemesh-web` 99 passed, 0 failed, 1 PostgreSQL-only test skipped; Figma prototype 15 passed, 0 failed, 0 skipped; downloaded Figma source TypeScript check passed and Vite production build transformed 19 modules.
- Commit SHAs and PR links: site server `0bb0845` ([PR #21](https://github.com/mohaeri/storemesh-site-server/pull/21)); contracts `d179030` ([PR #8](https://github.com/mohaeri/storemesh-contracts/pull/8)); web `a497eb8` ([PR #9](https://github.com/mohaeri/storemesh-web/pull/9)); platform prototype/specification `29dd5d9` on branch `feat/addendum-01-fix-request-07` (no open platform PR at verification time).
- Compatibility/deployment notes: legacy direct-domain single-input calls remain supported, but HTTP sorting fails closed when an output omits its destination. Existing batches without a destination may still use the compatibility assignment endpoint.
- Figma verification: Version 14 saved on 2026-09-12. Its live preview accepted two simultaneously selected input baskets, calculated their combined 37.820 kg, exposed one-at-a-time output weighing and operator destination selection, and correctly rejected locking before the physical cold-room prerequisite was recorded.

### Production workbench — current-backend alignment correction

Status: superseded on 2026-09-11 by the approved multi-input/operator-routing model above.

This section supersedes any conflicting route claims in the older “Sorting output routing and containers” note below. The prototype now follows the behavior that is currently implemented in `storemesh-site-server`:

- One received container is sorted per operation. Every output is assigned to a scanned, existing, healthy reusable basket/crate; no disposable container is created by sorting.
- The sort result records child genealogy, final grade and size, exact output weight, mass balance, and a classified loss reason whenever loss is positive.
- Manager destination and physical movement are separate records. A designated-zone mismatch is displayed as a warning; stage, current-zone, lock, health, and scan mismatches remain hard gates.
- Conventional drying accepts a `SORTED` batch directly in `DRYING`. The other implemented chain is `SORTED -> WASHED -> SLICED -> FROZEN -> FREEZE_DRIED`, with physical movement and exact container/tray checks between stages.
- Washing and slicing keep batch identity, classification, and official weight. The optional scale reading is informational.
- Slicing allocates existing process trays with unique sequence numbers and optional quantities. When all quantities are supplied, their total must equal the batch weight; final allocation releases the source basket.
- Freeze requires every assigned tray to be scanned exactly once. Freeze completion preserves weight and routes the same batch to freeze drying. Freeze-dry and conventional-dry completion capture positive final weights not exceeding their recorded inputs and expose yield.
- Machine cycles expose ready, running, paused, completing, completed, failed, cancelled, and manager recovery/scrap behavior. Failed material stays blocked until the manager action resolves it.
- Physical merge remains a separate operation over two or more compatible parent contributions and a scanned empty output basket.
- Production results and event history use a monotonic sequence as the stable secondary order when timestamps tie.

Known product-policy differences are labeled in the UI instead of being simulated as backend support. In particular, the current backend does not implement a permanent “fresh selection can never be washed” lock, and normal drying does not require washing/slicing. These policies would require explicit approval before any backend change.

Verification evidence:

- TypeScript `--noEmit`: pass.
- Vite production build: pass, 19 modules transformed.
- Prototype domain tests: 14 passed, 0 failed, 0 skipped, 0 todo.
- Figma interactive scenario: destination decision and physical transfer separated; wrong basket scan rejected; wash and slice preserved identity/weight; tray allocation released the basket; freeze pause/resume and completion worked; freeze-dry output was 2 kg from 10 kg input and displayed 20% yield; preview Reload restored the saved batch.
- Persistent storage is browser-local prototype state and is explicitly labeled “without API/equipment connection”; it is not evidence of factory integration.

### Sorting output routing and containers

Status: UI correction finalized in the Figma Make prototype on 2026-09-08; no backend change made or authorized.

- Sorting output must expose the intended route: fresh export, freezing, freeze drying, conventional drying, QC quarantine, or disposal.
- Fresh-export output must not subsequently enter washing.
- Processing output that requires washing/slicing must pass through those prerequisites before the selected machine process.
- Cold storage is a holding location, not a process route; UI must preserve both current location and next process destination.
- Sorting output must use scanned existing reusable containers. The operator scans and weighs each container, assigns grade/size and route, and completes aggregate output batches with preserved genealogy.
- The prototype action that creates a disposable container after sorting is a UI error and should be removed in the next Figma revision.
- Backend tests already cover distinct scanned sorting-output containers and child-batch genealogy (`storemesh-site-server/test/sorting-output-containers.test.js`). Richer route selection must be checked against implemented transition rules before the UI claims backend support.

Implemented UI behavior:

- The operator first selects and locks the input baskets.
- Every sorted output is recorded by scanning an existing reusable basket, capturing its load-cell weight, selecting final grade/size, selecting a process route, and selecting its immediate holding location.
- Supported routes shown by the prototype are fresh export, freezing, freeze drying, conventional drying, QC quarantine, and disposal.
- Fresh-export output visibly locks out washing. Freezing, freeze drying, and conventional drying visibly include their washing/slicing prerequisites.
- Cold storage is modeled separately as a physical holding location.
- Disposable-container creation was removed from sorting output. Mass balance and an explanation for variance above 2% remain visible.

### Container creation and designated zones

Status: UI correction finalized in the Figma Make prototype on 2026-09-08; no backend change made or authorized.

- The Receiving > Containers screen now opens a functional Create Basket form.
- The form captures basket type, tare weight, capacity, and one or more designated zones. Ownership is not shown because permanent fleet containers are always organization-owned.
- It generates a permanent, non-recyclable identifier and QR state, adds the basket to the list immediately, and persists it in prototype `localStorage`. The prototype uses type-specific prefixes: `BSK-` for baskets, `TRY-` for process trays, and `CTR-` for general containers.
- The table displays capacity, tare weight, status, and every designated zone.
- Only active baskets designated for `SORTING` appear in the sorting output-container selector.
- Current zone and designated zones remain separate concepts.
- Operators can edit the current tare weight, capacity, and designated zones. No separate calibration-history UI is included.
- A damaged basket is not deleted and its identifier is never reused. The damage flow can name a healthy target basket for contents, preserves the old basket record, and permanently locks its QR.
- No deactivate/retire control is shown because the current backend has no corresponding endpoint; this was intentionally left unchanged.
- Disposable containers remain traceable in a separate tab and are excluded from the permanent reusable fleet and sorting-container selection.
- Preview verification confirmed type-specific prefix generation, ownership-field removal, current tare/zone editing, damage reporting with permanent code locking, and disposable-container separation.

## Historical backend changes before this rule

The following backend work was completed before this UI-only rule. Detailed acceptance results are in the matching Fix Request reports under `docs/fix-requests/done/`.

### `storemesh-site-server`

| Date | SHA | Change |
|---|---|---|
| 2026-09-06 | `c85e771` | Per-site label-template configuration |
| 2026-09-06 | `294bd72` | Configurable operational numbering |
| 2026-09-05 | `02fee2c` | Configurable task priorities and receiving variance |
| 2026-09-05 | `5d8a1c6` | Stable consumable-ledger ordering |
| 2026-09-05 | `0a40545` | Device transfer manifests |
| 2026-09-05 | `f1c0139` | Stable PostgreSQL audit/outbox reload ordering |
| 2026-09-05 | `ec93cd6` | Recoverable outbox delivery |
| 2026-09-05 | `af6c582` | Audited password management |
| 2026-09-05 | `251f0f1` | Audit event and failure categories |
| 2026-09-05 | `fa9918a` | Inventory-ledger actor identity snapshot |
| 2026-09-05 | `0d32bbc` | Destination receipt for internal delivery |
| 2026-09-05 | `aaa39a3` | Scale evidence for UNIT packages |
| 2026-09-05 | `29072da` | Basket-maintenance usage tracking |
| 2026-09-05 | `8c46c5a` | Audit entity-type persistence |
| 2026-09-05 | `21e2f03` | Configured fresh-net weights |
| 2026-09-04 | `c736f14` | Configured UNIT-packaging tolerance |
| 2026-09-03 | `22dcc48` | Duplicate customer-shipment item rejection |
| 2026-09-03 | `9594322` | Manual task zone/priority validation |
| 2026-09-03 | `3929386` | Fail-closed station-machine configuration |
| 2026-09-03 | `c178344` | Print-failure reason validation |
| 2026-09-03 | `02ab506` | Duplicate sales-order item rejection |
| 2026-09-03 | `454d952` | Carton-stock reversal on cancellation |
| 2026-09-03 | `f49409e` | Cancelled shipment-item snapshots |
| 2026-09-02 | `459dda9` | Shipment pick-task completion on scan |
| 2026-09-02 | `55d7455` | Transactional auth-audit mutations |
| 2026-09-02 | `ab97ca0` | Merge supplier provenance |
| 2026-09-02 | `c29a926` | Append-only inventory ledger |
| 2026-09-02 | `9a48cc6` | Periodic audit archival |
| 2026-09-02 | `7a06f54` | Append-only audit history |
| 2026-09-02 | `3becb80` | Audit schema-version persistence |

### `storemesh-cloud`

| Date | SHA | Change |
|---|---|---|
| 2026-09-05 | `40221ab` | Streaming cloud event export |
| 2026-09-05 | `837ad17` | Cloud event query APIs |
| 2026-09-05 | `4ab798c` | Expiring site-key rotation |
| 2026-09-05 | `85a97c6` | Audit username snapshots |
| 2026-09-05 | `faf814c` | Categorized audit-event ingestion |

Corresponding public request/response and event-shape changes were recorded in `storemesh-contracts` during the same Fix Request rounds. No backend or contract mutation was made while creating this document.

## Approved backend-change template

### YYYY-MM-DD — title

- Approval and decision:
- UI requirement:
- Existing backend/contract mismatch:
- Approved backend behavior:
- Repositories and files:
- Routes, requests, responses, or events:
- Database/migration impact:
- Tests and real PostgreSQL result:
- Commit SHAs and PR links:
- Compatibility/deployment notes:

# UI / Backend Change Control

Last updated: 2026-09-25

## 2026-09-25 — Sorting entry locks product and grade; output reclassifies (local UI proposal)

- The first scanned Sorting input now locks both product and incoming grade for that Sorting session. A basket with a different product or grade is rejected and must be handled in a separate session.
- The entry queue and scan simulator only propose cold-room baskets compatible with the current session's locked product and grade. The locked values are persisted on the local Sorting session and included in its start event.
- Sorting output remains a transformation: each output basket independently receives its final grade and size, so an incoming Grade A session may legitimately produce A+, A, B, Industrial, or different size classes without weakening the entry-mixing guard.
- No backend, API, contract, migration, or database change was made. Verification: prototype tests 79 passed, 0 failed, 0 skipped; Vite production build passed with 19 transformed modules. No visual browser test was requested.

## 2026-09-25 — Shared scale focus and two-stage freeze-dry output (local UI proposal)

- Dryer Output now presents one physical scale console shared by grade splitting and per-package weighing. Selecting a dryer batch focuses the scale on net grade output; selecting a locked grade source or packaging consumable moves the same scale to package mode. Switching modes clears the operational context instead of pretending that two physical scales exist.
- Freeze-Dry Output now follows the same two-stage pattern. A completed machine cycle enters `COMPLETING`; its total output is split into one or more final grades and locked as `FREEZE_DRIED / READY_FOR_PACKAGING` before any retail package can be created. Compatible same-product/same-grade current output and prior remainder can then be weighed, labelled, and closed one package at a time with the shared scale.
- Freeze-dry remainders require a scanned reusable basket and return to positive clean cold storage for a later packaging session. Parent contribution, cycle identity, scale-derived net weight, pouch/absorber tare, gross weight, and label time are retained by the local prototype.
- Logic correction: the previous generic cycle `FINISH` path could directly turn freeze-dry input items into packaged output with a manually entered package code. That shortcut is now rejected in the prototype; freeze-dry output must pass grade lock and per-package weighing. Freeze-dry entry and cycle failure/pause/resume controls remain unchanged.
- Backend alignment warning: this remains browser-local prototype behavior. The current UNIT-package backend restriction still does not represent a package composed from multiple compatible parent batches, and no atomic freeze-dry grade-lock/package session route exists. No backend, API, contract, migration, or database change was made.
- Verification for this increment is superseded by the later Sorting-entry verification above. No visual browser test was requested for this round.

## 2026-09-25 — Two-stage dryer output grading and per-package weighing (local UI proposal)

- The local Production → Dryer Output screen now has two explicit stages. On the right, the operator records the dryer's output as one or more final-grade rows with separate weights, reviews input/output/loss, and locks those graded outputs before packaging.
- On the left, the operator may combine compatible dried stock from the new run and earlier carryover, selects a configured metallized pouch and moisture absorber whose tare weights are known, and creates exactly one package per connected-scale cycle. Net product, packaging tare, gross target, package identity, label time, and all contributing parents are retained by the local prototype.
- Both dryer scales now use the same compact console: device/connection telemetry is one slim horizontal line, live-scan/Zero/Tare/COM controls are a second centered horizontal line, and local test weights feed the same UI handlers. The grade-locking scale intentionally shows net product weight only; package weighing still shows packaging tare and calculated gross weight.
- Closing the packaging session requires a scanned reusable basket whenever product remains. The remainder returns to positive clean cold storage and stays available for a later compatible packaging session.
- Backend alignment warning: `createPackage()` currently requires one batch allocation for each UNIT package (`UNIT_PACKAGE_SINGLE_BATCH_REQUIRED`). The production backend therefore does not yet represent a retail package built from multiple compatible old/new parent batches, nor this atomic grade-lock + per-package scale session. This is a local UI proposal only; no backend, API, contract, migration, or database change was made. Production support requires Mohamad's explicit approval.
- Verification at the end of this increment is superseded by the shared-scale/freeze-dry verification above. No visual browser test was requested for this round.

## 2026-09-24 — Dryer output packaging, prior carryover, and reusable remainder (local UI proposal)

- The local Production → Dryer Output screen now follows the normative drying/packaging specification: it records the dryer's finished scale weight and yield, supports multiple package rows with independent count/unit weight/grade, creates individually traceable package identities, and displays the prepared-package list.
- A compatible dried remainder from an earlier packaging session can be selected alongside the new dryer output. Every resulting package and any new remainder keeps all contributing parent batches in its genealogy.
- Unpacked material must balance exactly into a scanned reusable basket. That remainder remains `DRIED`, returns to positive clean cold storage, and is offered in a later packaging session.
- Backend alignment warning: the current server supports partial packaging by decrementing a batch and retaining its remaining weight, but `createPackage()` explicitly requires a UNIT package to contain exactly one batch allocation (`UNIT_PACKAGE_SINGLE_BATCH_REQUIRED`). It does not currently expose the proposed atomic dryer-output session that mixes old and new batch allocations into one retail package and creates a scanned remainder basket. This screen is therefore a local UI proposal, not proof of production backend support. No backend, API, database, or contract change was made; implementing the mixed-parent unit-package behavior requires Mohamad's explicit approval.
- Verification: prototype tests 73 passed, 0 failed, 0 skipped; Vite production build passed with 19 transformed modules. No visual test was run, per Mohamad's instruction.

## 2026-09-24 — Inventory aging warning drives operator work priority

- Approval and decision: Mohamad explicitly approved connecting the existing inventory-aging warning to real operator work while preserving the existing configured threshold and priority system.
- UI requirement: Inventory must show aging units without opening the ledger, rank warned/older units first, and expose a clear operator action rather than a decorative `در حال پیر شدن` badge.
- Existing backend/contract mismatch: Fix Request 62 already calculated aging and raised `STORAGE_AGING_WARNING`; Fix Requests 43 and 116 already supplied configurable task priority. The warning was not linked to an operator task, and task-priority changes plus aging-link metadata were not fully persisted by the PostgreSQL task upsert.
- Approved backend behavior: Crossing the active aging threshold promotes the relevant open task, or creates one `Review aging inventory` task for `STORAGE_OPERATOR` when none exists. Priority increases with overdue age, repeated reads remain idempotent, and clearing the condition resolves the warning and cancels the generated task or restores the prior task priority.
- Repositories and files: `storemesh-site-server` domain, PostgreSQL repository, migration, and tests; `storemesh-contracts` inventory response documentation/tests; `storemesh-web` inventory presentation/tests; `storemesh-platform` local Figma-source prototype, tests, and this change-control record.
- Routes, requests, responses, or events: no new route or request shape. `GET /api/inventory` adds optional additive fields `agingTaskId` and `agingTaskPriority`; the linked task retains internal storage-aging metadata used for idempotence and priority restoration.
- Database/migration impact: migration `078_task_storage_aging.sql` adds nullable `tasks.storage_aging JSONB`; the task upsert now persists this metadata and updates `priority` on conflict.
- Tests and real PostgreSQL result: `storemesh-site-server` 546 passed, 0 failed, 0 skipped against PostgreSQL 17 with `DATABASE_URL` set; `storemesh-contracts` 78 passed, 0 failed, 0 skipped with parity for 160 site and 8 cloud method/route templates; `storemesh-web` 100 passed, 0 failed, 0 skipped with its PostgreSQL-backed form test enabled; `storemesh-platform` prototype 73 passed, 0 failed, 0 skipped and Vite production build passed with 19 transformed modules.
- Commit SHAs and PR links: none yet. This round is intentionally local-only until Mohamad asks to publish it; no commit, push, PR, or Figma update has been made.
- Compatibility/deployment notes: inventory response changes are additive. Deploy migration 078 before the updated site server. Existing tasks without `storage_aging` remain valid, and an aging warning is linked lazily during inventory evaluation.

## 2026-09-20 — Stitch-inspired Production Workbench visual and flow alignment

- Used the supplied `میز کار تولید` Stitch export strictly as a visual layout reference; its HTML and interaction logic were not copied.
- Replaced the crowded Production navigation row with a grouped operator workbench for monitoring, Sorting, Washing, Freezing, Slicing/Drying, and Freeze Drying.
- Removed Physical Merge from Production navigation.
- Split Washing into independently selectable Entry and Exit views while retaining the persisted multi-input session, Grade/Size lock, fresh output baskets, weighing, mass balance, and genealogy.
- Recast Freeze as `Freeze Output + Packaging`; Freeze-Dry-bound material remains unpackaged and is routed to Freeze-Dry Entry.
- Recast Slicing as a confirmation step whose next process is derived from the already-selected operational destination.
- Recast Dryer as `Dryer Output + Packaging` and separated Freeze-Dry Entry (frozen trays entering the machine) from Freeze-Dry Exit (final weighing and packaging).
- No backend, database, API route, request/response shape, or shared contract changed. The new controls are prototype-only behavior over the existing local production ledger and must be contract-reviewed before production implementation.

## 2026-09-20 — Stitch-inspired Receiving visual refresh

- Updated Receiving → Container Registration and Weighing to follow the supplied Stitch mockup's visual hierarchy only: full-width scale telemetry, separate container/product registration card, action bar, and registered-container table.
- Preserved the existing StoreMesh scan simulator, load-cell simulation, tare/net calculations, disposable-container creation, validation, persistence, review, and destination workflow.
- No Stitch mock behavior was copied, and no backend, API contract, or database change was made.

## 2026-09-20 — UI-only removal of duplicate transfer confirmation

- Removed the normal-workflow `physical transfer confirmation` action from Production → Work Queue & Route.
- The queue now displays the next required operation only. The scan performed at the real destination station records entry, state/location change, and traceability in one action.
- Washing, Slicing, Freezing, Freeze Drying, Drying, and Packaging accept a routed basket directly from its physical cold-room location when the scanned basket's `nextZone` matches that station.
- Washing completion records the approved post-wash physical cold room and exposes the next required process. Slicing completion similarly records negative storage for freeze-bound product without creating a second queue approval.
- Exceptional manual relocation between physical stores remains under Inventory Movement.
- No backend, API contract, or database change was made in this round.

## Standing rule

- Product review and Figma prototype work is UI-only by default.
- Do not change `storemesh-site-server`, `storemesh-cloud`, or API/event contracts merely to make a proposed UI flow work.
- If requested UI behavior does not match the implemented backend or published contract, explain the mismatch to Mohamad before implementation.
- Backend or contract changes require Mohamad's explicit approval.
- After approval, record the decision, affected behavior, repositories, routes/events, migrations, tests, commit SHAs, PR links, and deployment notes in this document.
- Simulated prototype behavior must not be presented as proof of backend support.
- Finalized documentation changes must be committed and pushed. Unrelated local changes must not be included.

## Open UI/backend alignment notes

### 2026-09-15 — Physical locations, operational destinations, and required processes (UI prototype only)

- Mohamad defined three separate concepts: physical storage location, operational destination, and required process. The prototype now keeps them separate instead of using one overloaded destination field.
- Physical locations are limited to `COLD_ROOM_POSITIVE_DIRTY`, `COLD_ROOM_POSITIVE_CLEAN`, and `COLD_ROOM_NEGATIVE`. Receiving selects only one of these. Receiving QC is an independent checkbox; a checked load remains in its selected cold room and waits for a manager decision.
- Operational destinations are configurable in Base Data with per-process applicability: QC, Fresh Export, Freezing, Freeze Sliced, Waste/Disposal, Drying, and Freeze Drying. Sorting, Washing, Slicing, and Packaging are processes, not destinations.
- Sorting returns output to its prior physical cold room, records final grade/size, and selects an operational destination. Waste output records weight without a basket. A QC checkbox is available at process output and pauses the next action for manager routing.
- UI route plans: Fresh Export goes to Packaging and remains in positive dirty cold storage; Drying goes through Washing, Slicing, Dryer, Packaging and becomes positive clean after Washing; Freezing goes through Washing, negative cold storage, Packaging; Freeze Sliced goes through Washing, Slicing, negative cold storage, Packaging; Freeze Drying goes through Washing, Slicing, negative cold storage, Freeze Dryer, Packaging.
- Backend/API/contract/database impact in this change: none. No backend or contract repository was changed. The current backend model does not yet expose this complete two-axis physical/operational taxonomy, `FREEZING_SLICED` route, per-stage QC hold, or basketless disposal as one coherent public workflow. Those remain explicit backend-alignment work requiring Mohamad's separate approval before implementation.
- This decision supersedes conflicting route descriptions in the 2026-09-11 note below for the Figma prototype. It must not be presented as proof that the production backend already supports every route.

### 2026-09-14 — Persian sidebar and Washing scan suggestion (UI only)

- The Persian Web shell now places its primary sidebar on the right while preserving the existing menu order and content layout.
- Washing passes the first eligible input container code to the shared scan simulator, so opening it pre-fills a real candidate and still uses the same scan validation handler.
- Backend/API/contract/database impact: none. No backend repository was changed.

### 2026-09-14 — Sorting scan/continue state consistency (UI only)

- Each accepted Sorting input scan physically transitions the basket from its cold-room location into `SORTING`.
- The continue and output-completion validators now require that scanned Sorting location. They no longer reject successfully scanned baskets for no longer remaining in cold storage.
- Backend/API/contract/database impact: none. No backend repository was changed.

### 2026-09-13 — Receiving-to-Sorting discovery (UI only)

- Correction: Sorting now derives its visible eligible-input queue from the same persisted receiving batch based on actual physical cold-room location, not a synthetic `SORTING` destination written by Receiving. Persian cold-room display names and canonical `COLD_ROOM`/`COLD_STORAGE` identifiers are normalized by the same predicate.
- Receiving no longer offers Sorting as a destination. Once the cold-room handoff is complete, the basket is stored with no pending movement destination; entering Sorting is initiated and recorded by the Sorting scan itself.
- The screen shows the number and next code of recognized baskets. Its shared scan simulator pre-fills that next eligible code and sends it through the same transition validator as hardware/manual scanning.
- Backend/API/contract/database impact: none. No backend repository was changed.

### 2026-09-13 — Receiving destination and in-flow handoff (UI only)

- Receiving now asks for the direct destination after shipment review and before completion.
- The operator can confirm movement of the complete batch or scan baskets one by one in the same Receiving flow. The Inventory page is an optional trace view and is no longer required to complete normal movement.
- Every completed basket records its location, state, destination/next route, operator action, and movement event immediately.
- The shared scan simulator refreshes its suggested value on every open and pre-fills the next basket code; manual hardware-style entry and simulated scanning still invoke the same validation handler.
- Backend/API/contract/database impact: none. This is browser-local prototype behavior only; no backend repository was changed.

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

## UI-only change record

### 2026-09-13 — User management and scan-driven workflow-state completion

Status: Figma Make Version 17 finalized; UI/prototype logic only. No backend, database, API route, request/response shape, or contract was changed.

- Settings > Users now uses its own persisted collection and controlled form state, validates required/unique fields, and supports create, edit, cancel, search, and active status.
- Receipt containers and production batches are normalized with current location, current state, explicit destination when movement is pending, and a clear next operator action. The old generic transfer-ready state is migrated away and is not produced by new operations.
- The normal path `Receiving -> Cold Storage -> Sorting` is confirmed at the operational scan gate and records location/state/history/traceability updates. Exceptional manual relocation remains a separate Inventory Movement action.
- A single scan-simulator component now feeds the same handlers used by typed/hardware scan input in receiving and production. It is reused for production gate movement, washing output registration, packaging entry, and outbound shipping entry.
- Optional transition weighing and delta history remain shared for Sorting entry, Washing entry, and the existing washing/slicing transition points. Washing still enforces one Grade/Size group per active multi-input session and preserves all-parent to all-output genealogy.
- Verification: 28 prototype tests passed, 0 failed, 0 skipped; TypeScript `--noEmit` passed; Vite production build passed with 19 transformed modules. No visual test was run, per Mohamad's standing instruction.

### 2026-09-13 — Master data, movement, sorting entry, and washing session prototype

Status: Figma Make Version 16 finalized; UI/prototype logic only. No backend, database, API route, request/response shape, or contract was changed.

- Products, suppliers, customers, and warehouses use independent browser-local collections and forms. Product active status gates new receiving choices while saved history remains intact; grades and sizes are product-specific.
- Normal workflow movement is scan-driven at the operational step. Shipping no longer contains internal transfer; a separate Inventory Movement screen is labeled and recorded as an exceptional manual move.
- Sorting accepts only scanned input baskets. Entry weighing is optional; when supplied, the prototype stores previous weight, new weight, and delta in the event ledger.
- Washing is represented as a persistent session with multiple compatible inputs, multiple new weighed outputs, all-parent genealogy, and a completion gate requiring every output to be registered and the unit confirmed empty.
- These interactions require backend capability verification before production implementation. Version 16 must not be interpreted as evidence that the current server exposes the same master-data status/grade APIs, exceptional movement endpoint, transition-weight evidence, or multi-output washing-session contract.

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

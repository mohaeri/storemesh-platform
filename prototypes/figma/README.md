# StoreMesh Figma Make production prototype

This folder keeps the reproducible source prepared for Figma Make as Version 36 on 2026-09-21.

## What is included

- `ProductionWorkbench.tsx`: shared same-session production ledger, routing, process cycles, results, and event history without user-facing test controls.
- `SortingScreen.tsx`: multi-container input sorting with one-at-a-time weighed outputs, operator-selected final routes, automatically weighted parent contributions, load-cell simulation, existing-container scans, and child genealogy.
- `ProductionInventory.tsx`: production output integration for Inventory and Trace.
- `WebApp.tsx`: the complete assembled Figma Make source snapshot.
- `HubApp.tsx`: the Figma Make hub source with the updated 20-screen Web count.
- `assemble.mjs`: deterministic assembler for a baseline or for refreshing an already assembled snapshot.
- `production.test.mjs`: focused storage and production-domain regression tests.

## Rebuild and verify

```powershell
node prototypes/figma/assemble.mjs <baseline-WebApp.tsx> prototypes/figma/WebApp.tsx
$env:PROTOTYPE_TYPESCRIPT='<path-to-typescript-package>'
node --test prototypes/figma/production.test.mjs
```

The assembled source must also pass the downloaded Figma project's TypeScript check and `pnpm build` before it is installed through the Figma Make code editor.

Version 33 completes the Production Workbench split into independent Sorting Entry, Sorting Exit, Washing Entry, and Washing Exit stations. Optional/new sorting-entry weight and all sorting/washing exit weight capture now live exclusively in the top scale console, with cleaner input tables and no duplicated lower load-cell controls. The supplied Stitch screens were used only as visual references; StoreMesh state, validation, persistence, scanning, genealogy, and workflow behavior remain authoritative. Version 32's operation map and Version 31's Receiving refresh remain intact.

Version 34 aligns the Sorting Entry and Washing Entry basket rows with the supplied Stitch visual hierarchy. Sorting Exit and Washing Exit now treat a successful basket scan as physical placement on the connected scale and capture the stable reading immediately, without a second on-screen weight action. Washing Exit also exposes the computed next process and final operational destination before each output is registered. These are UI/prototype changes only; no backend behavior was changed.

Version 35 fixes the Sorting Entry row logic with an explicit per-basket weight state machine. A newly scanned or reselected basket is «در انتظار ثبت وزن»; a successful scale capture changes it to «وزن جدید ثبت شد»; and scanning the next basket without capturing a new weight changes the previous row to «وزن قبلی انتخاب شد». This is a Figma/prototype-only correction and does not change backend routes, requests, responses, or persistence contracts.

Version 36 applies the same optional three-state weighing behavior to Washing Entry. Scanning a basket leaves it pending until the operator elects to capture a fresh scale reading; moving on without capture records that the previous valid weight was selected. Washing Entry rows now show the final operational destination assigned during Sorting instead of incorrectly repeating Washing as the next step. This is a Figma/prototype-only correction and does not change backend routes, requests, responses, or persistence contracts.

## Scope boundary

This is a browser-local interactive prototype. Its production records are saved in `localStorage` under `storemesh.prototype.production.v1`, and its independent master-data records under `storemesh.prototype.master-data.v1`. It neither calls StoreMesh APIs nor controls factory equipment. The behavior alignment and known differences from the current backend are recorded in `docs/ui-backend-change-control.md`.

Figma Make file: https://www.figma.com/make/eOUgDgsvoVyRJn5ZB1SHqX/Interactive-Product-Prototype?p=f

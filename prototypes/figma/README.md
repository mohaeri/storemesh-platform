# StoreMesh Figma Make production prototype

This folder keeps the reproducible source prepared for Figma Make as Version 30 on 2026-09-20.

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

Version 30 removes the redundant physical-transfer confirmation from the normal work queue. A basket remains in its physical cold room while the queue shows its next operation; the real scan at Washing, Slicing, Freezing, Freeze Drying, Drying, or Packaging performs the entry transition and writes traceability. Exceptional cold-room-to-cold-room relocation remains in Inventory Movement. Version 29's separated physical storage, operational destination, required process, QC holds, Freeze Sliced route, and basketless disposal remain intact.

## Scope boundary

This is a browser-local interactive prototype. Its production records are saved in `localStorage` under `storemesh.prototype.production.v1`, and its independent master-data records under `storemesh.prototype.master-data.v1`. It neither calls StoreMesh APIs nor controls factory equipment. The behavior alignment and known differences from the current backend are recorded in `docs/ui-backend-change-control.md`.

Figma Make file: https://www.figma.com/make/eOUgDgsvoVyRJn5ZB1SHqX/Interactive-Product-Prototype?p=f

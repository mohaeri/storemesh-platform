# StoreMesh Figma Make production prototype

This folder keeps the reproducible source prepared for Figma Make as Version 31 on 2026-09-20.

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

Version 31 adapts the Receiving → Container Registration and Weighing view to the supplied Stitch visual reference: a full-width industrial scale monitor, a separate scan/product card, a compact action bar, and the existing registered-container table. StoreMesh state, scan, weighing, disposable-container, validation, and four-stage receiving handlers remain authoritative; no Stitch behavior was copied. Version 30's station-scan routing remains intact.

## Scope boundary

This is a browser-local interactive prototype. Its production records are saved in `localStorage` under `storemesh.prototype.production.v1`, and its independent master-data records under `storemesh.prototype.master-data.v1`. It neither calls StoreMesh APIs nor controls factory equipment. The behavior alignment and known differences from the current backend are recorded in `docs/ui-backend-change-control.md`.

Figma Make file: https://www.figma.com/make/eOUgDgsvoVyRJn5ZB1SHqX/Interactive-Product-Prototype?p=f

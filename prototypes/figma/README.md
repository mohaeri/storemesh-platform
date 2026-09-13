# StoreMesh Figma Make production prototype

This folder keeps the reproducible source installed in Figma Make as Version 16 on 2026-09-13.

## What is included

- `ProductionWorkbench.tsx`: shared same-session production ledger, routing, process cycles, results, and event history without user-facing test controls.
- `SortingScreen.tsx`: multi-container input sorting with one-at-a-time weighed outputs, operator-selected final routes, exact parent contributions, load-cell simulation, existing-container scans, and child genealogy.
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

Version 16 adds independent persisted master-data collections and working create/edit/status controls, excludes inactive products from new receiving operations while retaining stored history, and drives grade/size choices from each product. It removes normal internal transfer from Shipping, adds an explicitly exceptional Inventory Movement workflow, makes sorting input scan-driven with optional transition weighing and weight-delta history, and models washing as a compatible multi-input/multi-output session with complete parent genealogy and an explicit empty-unit completion gate.

## Scope boundary

This is a browser-local interactive prototype. Its production records are saved in `localStorage` under `storemesh.prototype.production.v1`, and its independent master-data records under `storemesh.prototype.master-data.v1`. It neither calls StoreMesh APIs nor controls factory equipment. The behavior alignment and known differences from the current backend are recorded in `docs/ui-backend-change-control.md`.

Figma Make file: https://www.figma.com/make/eOUgDgsvoVyRJn5ZB1SHqX/Interactive-Product-Prototype?p=f

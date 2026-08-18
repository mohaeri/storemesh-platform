# AnbarSYS implementation audit

Canonical source: `docs/anbarsys-spec.md`

This file is the executable audit ledger for the chapter-by-chapter implementation pass. A requirement is marked complete only when code evidence and automated coverage both exist.

## Chapter A — System overview

| V1 capability | Status | Evidence / remaining work |
|---|---|---|
| Receiving, physical container validation, weighing | Complete | Site domain container gates; terminal scanner/scale workflow; adversarial tests |
| Batch split, merge and genealogy | Complete | Sorting and transform genealogy plus property tests |
| Zone inventory and FIFO recommendation | Complete | FIFO deviations warn without blocking, are scoped by product+grade+size, and create audit evidence |
| Multi-level packaging | Partial | Hierarchy and basic state transitions exist; package-by-package scan evidence and the exact package state machine remain |
| Label identity, attempts and safe reprint | Complete | Separate labels/attempts, verified scanner capture, device-attributed printing |
| Session auto-save and recovery | Partial | Draft persistence/resume and PostgreSQL-backed manager/admin JWT-session revocation survive restart; inactivity timeout, handover and complete operational lifecycle remain |
| Task management | Partial | Create/claim exists; work orders, eligibility, assignment/reassignment, pause/fail/recovery and dependencies remain |
| Device management | Partial | Device identity is captured; registry, assignment, heartbeat and online status remain |
| Processing cycles | Complete | Identity-preserving freezer/freeze-dryer/dryer cycles, exclusive scanned-container lock, strict transitions/history, final yield and packaging-task tests |
| Master data | Missing | Products, suppliers, grades, sizes, zones, package types, roles, skills and devices are not managed as reference entities |
| Operational QC | Partial | Basic approval/rejection/quarantine exists; configurable checklists, rework and signature remain |
| Notifications and exceptions | Missing | No durable exception entity, assignment/resolution workflow or notification rules |
| Reports and dashboards | Partial | Read models and basic UI exist; standard operational reports and equipment/exception views remain |
| Fine-grained operational RBAC | Partial | Ten station roles and route-level permissions are enforced; skills and task-based authorization remain |
| Complete audit record | Partial | User, session, device, request ID, IP and success/failure result are persisted; before/after state and role/workstation/category fields remain |
| Per-entity concurrency | Missing | Site-wide optimistic version exists; entity versions/state-history and row-level transition protection remain |

## Chapter B — Business workflows

Audit in progress. The confirmed cycle mismatch is fixed: `FREEZE`, `FREEZE_DRY`, and `DRY` are rejected by the derived-batch transform path and execute only through independent machine Cycle records. PostgreSQL persistence and adversarial state/identity/weight/container-lock tests cover the implementation.

## Chapters C–M

Pending sequential review.

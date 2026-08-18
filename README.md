# StoreMesh Platform

StoreMesh is a multi-site warehouse and production platform for traceable food processing operations.

This repository is the governance and architecture hub. Implementation is split into independently reviewable private repositories.

## Repositories

- `storemesh-contracts`: API, event, and shared data contracts
- `storemesh-site-server`: transactional application server deployed at each site
- `storemesh-web`: management and operational web application
- `storemesh-terminal`: Raspberry Pi terminal, scales, scanners, and printers
- `storemesh-pda`: installable PWA for Android industrial PDAs
- `storemesh-cloud`: read-only cross-site aggregation and reporting
- `storemesh-infrastructure`: deployment, backup, monitoring, and per-site configuration
- `storemesh-e2e`: end-to-end operational acceptance tests

## Delivery model

Work is delivered as small issues and pull requests. Every feature must identify its requirement, contract changes, tests, failure behavior, and operational impact.

## Initial vertical slice

Login -> Receiving Session -> Scale Measurement -> Batch Creation -> QR Print Queue.

## Current runnable prototype

The first integrated release includes receiving, idempotent retries, weight history, zone movements, transformations with genealogy, packaging, shipment conflict protection, print queues, site outbox events, a management dashboard, terminal and PDA clients, cloud aggregation, multi-site Docker topology, and black-box scenarios.

The current release includes normalized PostgreSQL persistence and migrations, standard HS256 JWT authentication and granular role permissions, audit/outbox delivery, health/readiness/Prometheus endpoints, automated backups with restore validation, and CI coverage. Physical scale/scanner/printer certification, production secrets, and deployment-specific security review remain environment-dependent acceptance activities and are not represented as completed.

The user experience is delivered as three complete, connected surfaces: a responsive RTL operations console covering receiving, inventory, containers, production, quality, packaging, shipment, cross-site transfer, tasks, printing, traceability, configuration, overrides, audit, cloud, and system health; a touch-oriented receiving terminal; and an offline-capable industrial PDA interface.

## Run the complete stack

Clone all implementation repositories into one parent directory, enter `storemesh-infrastructure`, and run `docker compose up --build`. The operational dashboard is then available at http://localhost:8080 and connects to the Iran site API at http://localhost:3000.

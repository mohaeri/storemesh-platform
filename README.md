# StoreMesh Platform

StoreMesh is a multi-site warehouse and production platform for traceable food processing operations.

This repository is the governance and architecture hub. Implementation is split into independently reviewable private repositories.

## Repositories

- `storemesh-contracts`: API, event, and shared data contracts
- `storemesh-site-server`: transactional application server deployed at each site
- `storemesh-web`: management and operational web application
- `storemesh-terminal`: Raspberry Pi terminal, scales, scanners, and printers
- `storemesh-pda`: Android industrial PDA application
- `storemesh-cloud`: read-only cross-site aggregation and reporting
- `storemesh-infrastructure`: deployment, backup, monitoring, and per-site configuration
- `storemesh-e2e`: end-to-end operational acceptance tests

## Delivery model

Work is delivered as small issues and pull requests. Every feature must identify its requirement, contract changes, tests, failure behavior, and operational impact.

## Initial vertical slice

Login -> Receiving Session -> Scale Measurement -> Batch Creation -> QR Print Queue.


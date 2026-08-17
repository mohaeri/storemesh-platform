# Architecture

Each operational site owns its local writes and remains functional without international connectivity. A shared modular application server and relational database are deployed per site. Cross-site reporting is asynchronous and read-only.

The Version 1 backend is a modular monolith. Domain boundaries remain explicit so selected modules can be extracted later without sacrificing local ACID transactions.

## Site-server modules

Identity, Configuration, Receiving, Inventory, Batches, Production, Quality, Packaging, Shipping, Printing, Tasks, Sessions, Audit, and Outbox.

## Site variants

Iran, Dubai, and Rome use the same application artifacts. Differences are expressed through validated site configuration and feature flags in `storemesh-infrastructure`.


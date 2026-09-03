# Needs decision — Three open questions from the inventory audit that aren't mechanical fixes

Found during the same pass that produced FR61/FR62. Each is real but requires a genuine call, not something to guess at and force into a Fix Request.

## 1. How strict should destination validation be for general container movement?

`moveContainer` today checks that the target zone exists, is active, and that the container isn't locked or owned by another active session — but nothing checks whether the destination is a *legitimate* next step for what's inside (the way `releaseQuarantine`, after FR59, now checks a forward-zone map derived from the batch's pre-quarantine status). The review is right that this is weaker than "destination valid for object/stage."

The reason I haven't just copied FR59's pattern here: container movement is general-purpose and not always "forward" the way a batch's process status is — a container legitimately gets moved to cold storage temporarily, back out, staged near a station, etc. A strict forward-zone map risks blocking real, harmless operational moves. **The question for Mohamad**: should container movement gain the same kind of destination legitimacy check as quarantine release, and if so, what should the "legal" zone graph actually look like for a container (as opposed to a batch's linear process stages)? This needs a real answer about how staging/holding moves are supposed to work before it's buildable.

## 2. Inventory permission granularity

The spec distinguishes `inventory.view`/`move`/`adjust`/`consume`/`release`/`count` and `adjust.approve`. The current roles mostly collapse these into `inventory:read`, `storage:write`, and `inventory:adjust.approve` — coarser than the spec's model. **The question**: is this coarser grouping an acceptable simplification for the current pilot's operator count, or does it need to be split out now? Splitting it is mechanical once decided, but deciding the actual permission boundaries (who specifically should be able to count without moving, or consume without adjusting) is a real access-control design call, not something to invent unilaterally.

## 3. Concurrency model — site-level versioning vs. per-entity locking

PostgreSQL transactions and site-level state versioning already prevent most overwrite races, but there's no row-level lock scoped to an individual batch/container/package balance — under low operator counts (the current pilot) this is tolerable, but as concurrent operators increase, unrelated operations can start contending and retrying against each other. **The question**: is this worth addressing now, or is it a "revisit when operator count actually grows" item? This is a real architectural change (per-entity optimistic or row locking) that shouldn't be started speculatively without knowing the actual scale target.

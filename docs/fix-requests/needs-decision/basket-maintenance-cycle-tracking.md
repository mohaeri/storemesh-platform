# Decision needed: basket maintenance-cycle warning — what counts as "two basket types"?

Status: reopened 2026-09-02. The original question (does a completed receiving cycle count as one "use" toward a maintenance warning, spec §2.19) was answered by Mohamad on 2026-09-02: yes, count every completed receiving cycle as one use, threshold configurable per basket type, soft warning to a supervisor only, no automatic blocking. That became FR79.

FR79 hit a real modeling blocker before any code was written (see `done/79-basket-maintenance-warning.md`): the request also requires proving that two different basket types warn at two different cycle counts, but the live container model (`storemesh-site-server/src/domain.js`) only has a flat `type` field with values `BASKET`/`CRATE`/`TRAY`/`SINGLE_USE` — no basket subtype, material, size class, or maintenance profile. There is no existing field to key two different thresholds off of.

**Decision needed — pick one:**

1. Add a new durable field (e.g. `basketProfile` or `maintenanceClass`) to containers, set at creation, and key thresholds by that. Most correct long-term, but touches schema, container-creation API/UI, and `storemesh-contracts`.
2. Treat `BASKET` and `CRATE` as the two "basket types" for this feature and key thresholds off the existing `type` field. Zero schema change, but conflicts with the original request's explicit wording that only `BASKET` cycles should increment usage — would need Mohamad to explicitly relax that.
3. Ship with a single `BASKET`-wide threshold now (no per-subtype differentiation) and drop the two-type acceptance test. Fastest to ship, defers the harder modeling question.

Once Mohamad picks one, this becomes a new numbered `open/` fix request (FR79 stays as the closed/blocked historical record; the follow-up gets a fresh number).

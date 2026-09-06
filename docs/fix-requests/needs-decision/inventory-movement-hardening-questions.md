# RESOLVED 2026-09-04 — no action taken, decisions recorded in anbarsys-spec.md

Mohamad picked the lowest-risk/lowest-effort answer to all three open questions in a fast-track decision pass aimed at reducing backlog and shipping faster: keep current behavior for all three (destination-legitimacy checking, permission granularity, per-entity concurrency locking), explicitly deferred rather than built now. No new numbered fix request was created — this resolves to "no change," not "build something."

Full decision text for each of the three questions is recorded inline in `docs/anbarsys-spec.md`:
- Question 1 (destination validity for general container movement) — note near section 12.8 ("Destination is valid").
- Question 2 (inventory permission granularity) — note under section 10.21 ("Inventory Permissions").
- Question 3 (concurrency model, site-level vs. per-entity locking) — note under section 11.72/11.73 ("Final Rule" / "Version 1 Boundary").

This file is kept as a stub (not deleted — `rm`/`mv` still return "Operation not permitted" on this mount as of 2026-09-04) so the resolution isn't mistaken for an unanswered question. If operator count or scale actually grows, re-open these as a real fix request rather than treating this stub as a permanent architectural decision.

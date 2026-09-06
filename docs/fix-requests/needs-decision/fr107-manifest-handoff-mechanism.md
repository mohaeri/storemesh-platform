# RESOLVED 2026-09-05 — see open/112-pda-terminal-internal-transfer-manifest-fetch.md

Mohamad picked option 3: fetch the manifest by shipment ID over the device's existing authenticated session — no paste-JSON desktop dependency, no QR encode/decode/tampering surface. Physical scan-to-confirm against the fetched manifest is still mandatory. This file is kept as a stub, not deleted (rm/mv still return "Operation not permitted" on this mount).

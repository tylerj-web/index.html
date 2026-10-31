# Framework Command secure gateway — integration contract (not active)

This file is a design contract; the mobile app must not claim a live connection without a deployed compatible gateway.

## Requirements before pairing
- Windows Framework laptop service running with authenticated HTTPS access over a private network.
- Device registration after explicit human approval, short-lived access tokens, revocation, TLS certificate verification and strict role scopes.
- A signed, versioned authoritative policy manifest supplied by the user and verified in the client. No AI-created policy changes.
- Versioned read-only APIs for permitted audit status, user-approved knowledge, operational evidence and high-level Commander coordination data.
- Writes require explicit review and acknowledgement; offline instructions are drafts until online validation and receipt.
- Conflict-handling for reports and edits, audit trails, privacy controls, timestamps and a documented fallback when the laptop is unavailable.

## Suggested endpoints (specification only)
GET /v1/health      -> {service, version, time, public_capabilities}
POST /v1/pair/start -> device challenge, user-approved session
POST /v1/pair/finish -> scoped credential after challenge proof
GET /v1/policy/manifest -> signed policy manifest with version/hash
GET /v1/audits?since= -> permitted records
GET /v1/evidence/:id -> authorised evidence with source metadata
GET /v1/command/status -> permitted operational snapshot
POST /v1/outbox/validate -> dry run and permission/conflict check
POST /v1/outbox/commit -> idempotent authorised commit with receipt

## Security invariants
- Orbit and Commander retain equal standing under user-provided governing policy; neither overrides the other.
- No public unauthenticated gateway endpoints expose private system details or files.
- No secret keys, tokens or private policy records are committed to public GitHub Pages.
- A cached record has its own freshness, provenance and verification state; disconnected mode never simulates live activity.

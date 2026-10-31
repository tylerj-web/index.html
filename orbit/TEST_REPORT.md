# Orbit Mobile 3.0 — Verification report

**Static checks completed**
- JavaScript parser checks: app.js, orbit-store.js, orbit-behavior.js, offline-brain.js and service-worker.js.
- PWA manifest JSON parsed and icons exist.
- All referenced local PNG and CSS/JS file paths exist.
- HTML element IDs are unique; all entry scripts and styles are present.
- No code path switches from the 589x760 base robot to the obsolete 160x192 frame PNGs. The former sprite frames were excluded from the release.
- No `Establishment Officer` title remains in UI or model persona.
- Archives checked for valid structure and required files.
- The update retains migration of the prior v2.4 localStorage state, but **has not been exercised in an installed iPhone PWA**.

**Not completed — do not represent as tested**
- Browser UI automation: the local browser test environment blocks navigation to all local/localhost/test pages (`net::ERR_BLOCKED_BY_ADMINISTRATOR`).
- iPhone/iPad Safari WebGPU, memory/storage limits, offline model download and inference, and native microphone behaviour.
- Encrypted Framework Command gateway, pairing, signed policies, server-side coordination, remote sync, and real agent operations (no backend supplied).
- Live Pages site status: verify separately after GitHub Actions reports success.

**Mandatory real-device acceptance tests before using sensitive information**
1. Open app online and verify every screen and text input.
2. Upgrade an existing v2.4 Home Screen install; confirm existing conversations, reports, notes migrated.
3. Add, rename, switch and delete conversations; relaunch and ensure the correct conversation loads.
4. Create and edit reports, inspections and notes; backup and restore on the same device.
5. Install local model on Wi-Fi; verify chat can respond after closing, reopening and entering Airplane Mode.
6. Force insufficient storage/interrupted download and ensure an accurate error appears without deleting records.
7. Test reduced motion, screen readers, orientation changes and automatic app cache updates.
8. Verify Orbit remains crisp through every animation, with no 160x192 source assets loaded.

**Release classification**: local-first functional update, not a security-certified or fully connected hybrid assistant.

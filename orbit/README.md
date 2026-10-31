# Orbit Mobile — Robot Edition 2.0

**The user’s original Orbit robot is now the face of the app.** This release uses the original black-and-gold floating robot artwork and transparent animation atlas, including his cyan eyes and chest core.

## What is included

- Home screen: Orbit himself, floating and responding when you tap him (waving animation).
- Chat: Orbit’s robot avatar accompanies each simulated response. Stored chat history uses browser LocalStorage.
- Audits: Sample inspection templates; optional conversion to saved local report drafts.
- Knowledge: A few demonstration dictionary entries and local notes; authoritative governing policy is **not loaded**.
- Command: The authorised organisational relationship between Orbit and Commander (informational only).
- Reports: Local report editor, export and deletion.
- Settings: Colour controls, reduced animation, optional browser text-to-speech, demo connectivity status, export and reset.
- A small floating Orbit companion on non-chat screens; tapping him returns you to your conversation.
- Robot Home Screen icon, PWA manifest and offline application caching.

## Important limitations

**This is a fully packaged and interactive design prototype, not a connected AI assistant.** All chat answers are scripted examples. There is no Framework Command server, no local LLM, no synced authority/policy, no secure device pairing, and no application-level encryption. The online/offline toggle is a visual demonstration. Live iPhone speech recognition depends on Safari/browser support and may send audio to a service; it is not guaranteed to function offline. Do not store sensitive/confidential material.

## Install for free on an iPhone

1. Unzip this folder. Upload **the folder contents** (`index.html`, `app.js`, `styles.css`, `assets`, etc.) to an HTTPS website you control, such as a GitHub Pages repository. Do not upload just the HTML file without its assets.
2. Open the resulting `https://` URL in Safari on iPhone. Verify the little robot appears on the Home screen.
3. In Safari, choose **Share → Add to Home Screen**, and turn on **Open as Web App** if that option appears.
4. Open the Orbit icon. Visit once while connected to allow the site’s service worker to cache the app. You can then launch the cached interface offline. Offline launch is subject to available browser storage and iOS cache retention.
5. To update a hosted copy, replace the files with the new release. The app’s service worker uses a different cache identifier to update offline assets. You may need to reopen Orbit with network access once to obtain the new files.

The bundle can be opened locally on a computer for casual preview, but installation/offline service-worker functionality requires an HTTPS origin (localhost works for development). `file://` URLs and directly opening an HTML file from iPhone Files do not provide standard PWA installation.

## Interaction test

- Tap the large robot: he waves with his original sprite frames.
- Send a message: Orbit replies with **SIMULATED RESPONSE** clearly indicated and performs a short work animation.
- Browse Audits, Knowledge, Command and Reports through the bottom navigation.
- On any other tab, tap the little robot at lower right to return to Orbit.
- Create a local report in Reports and export it. It is saved only in your browser and not shared with Framework Command.
- In Settings, turn off Ambient animation to disable reactions.

## Technical layout

- Vanilla HTML/CSS/JavaScript, zero external libraries or CDNs.
- Robot artwork: `assets/orbit-robot.png` (keyed transparent version of the user's supplied character).
- Character animation: `assets/orbit-wave-*.png`, `orbit-working-*.png`, `orbit-waiting-*.png`, `orbit-review-*.png`, etc., extracted from the original sprite atlas.
- `manifest.webmanifest`: installability and device icons.
- `service-worker.js`: versioned app-shell and robot-frame cache, no connection to a server beyond fetching hosted files.
- Local browser persistence only; existing v1.1 prototype drafts are preserved using the same storage key when installing as an upgrade on the same origin.

## Production pathway (not yet implemented)

1. Authentic Framework Command gateway and explicit device authorisation.
2. Verified, signed offline policy snapshots and access-controlled evidence.
3. Genuine local AI/remote AI routing, with clear network status.
4. Reliable speech and background limitations evaluated for iPhone.
5. Encrypted storage, controlled sync, operational audit logs, user-approved actions and proper testing.

**Version:** 2.0 · Orbit Robot Edition · 31 October 2026

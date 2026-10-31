# Orbit — The Fixer | 3.2 Fluid UI

This release builds on the 3.1.1 HD articulated robot, preserves its local records and adds a minimalist, customisable interface. Open Settings → Appearance Studio to choose Minimal (default), Balanced, Workspace or Character. The animated HD robot now stays present throughout navigation in one persistent character component.

**Device limitations:** iPhone Safari and actual keyboard behaviour, local model inference, IndexedDB persistence across reload, and service-worker upgrade still require physical/origin-backed testing. See `TEST_REPORT.md`. Framework Command is not connected.

This is a standalone, installable PWA for iPhone and iPad, designed to use the original Orbit robot art. The HD character image (589 × 760 px) remains rendered for **every animation state**. Motion is applied with CSS transforms and lighting, with reduced-motion support; the former 160 × 192 px animation frames are not used.

### What's actually working

- Optimized mobile and tablet layout, four-destination mobile navigation with More menu, and Orbit's HD motion behaviour for listening, waiting, speaking, considering, waving, completing and error states.
- Independent local working features: **multiple conversations**, renaming, deleting, searching, backup and restore.
- Structured local inspection records: scope, referenced evidence, findings, proposed follow-up, and review status (always unverified unless a future authoritative gateway validates it).
- Reports editor with saved **revision history**, Markdown export, local importable `.txt` / `.md` reference notes and local search.
- IndexedDB structured local storage with migration from the former v2.4 `orbit.mobile.prototype.v1` localStorage key, without deleting the old data automatically.
- Optional WebLLM model installer for Qwen2.5 0.5B (baseline) or 1.5B (experimental), with model-status progress and streamed answers if the hardware/runtime supports WebGPU.
- Versioned service-worker cache for offline app-shell support. The model has a separate cache and must be explicitly installed and tested.

### What is **not** yet working / available

- The app does not contain the Framework Command Windows gateway, authenticated pairing, live coordination with Commander, agent actions or synced authoritative policy. The UI must always show **unpaired** until those services are supplied and tested.
- No user-approved policy codes have been loaded or signed. General English entries, imported notes and locally drafted audits have **no governing-policy authority**.
- This PWA does not have native iOS-level Face ID enforcement, encrypted application records, silent background microphone access, guaranteed offline speech recognition, or reliable native push without permissions and infrastructure.
- The AI model files are not bundled in this 1–3 MB PWA. They require a separate first-time download, WebGPU device support and enough Safari memory/storage. Safari may evict caches. **Offline AI on physical iPhone/iPad has not been validated in this release.**
- The small local model has limited reasoning and context capabilities. It must not be treated as an accurate replacement for a powerful connected AI.

### Installation on iPhone/iPad

1. Publish the **contents** of this ZIP to `https://tylerj-web.github.io/index.html/orbit/` (not the ZIP itself).
2. In Safari, open the site, Share → Add to Home Screen → Add.
3. Open Orbit and go to **More → Settings & Offline AI**, choose the baseline model, then tap **Install model** on Wi-Fi.
4. Confirm that a brief local AI response works; close and reopen Orbit, enable Airplane Mode and test again. If the model cannot reload, the device/browser is not yet reliably compatible.
5. Use **More → Settings → Backup** to export local records regularly. The exported file is **unencrypted**; keep it private. Use Restore if needed.

### Migration and data safety

v2.4 localStorage is read on the first launch in the same browser origin. The new IndexedDB database stores conversations, reports, notes, inspections, revisions and settings separately. It will not delete old data automatically. The app can fall back to legacy localStorage if IndexedDB is unavailable, but storage size may be limited.

Do not use this app for confidential operational records yet. Never upload private policy or data to the public GitHub repository. Website code is public; local database contents are not published by the PWA.

### Update and testing

The service worker uses version `orbit-shell-v3.2.0` for the app shell and clears obsolete Orbit caches; WebLLM model cache is separate. On iPhone, reopen in Safari after deployment; a second reload may be necessary to activate the new service worker.

Automated checks validate the JavaScript syntax, XML/JSON/asset integrity, PWA file references and ZIP extraction. Browser automation in this environment is blocked from navigating to local pages, and real device testing remains required.

### Development status

**Orbit Mobile 3.0 is a local-first functional release, not a fully paired hybrid assistant.** The protected Framework Command gateway and signed policy integration are separately gated on laptop infrastructure and authorised policy source files.

## 3.1 animation hotfix
Real waving and expressive gestures are back. The robot uses the same original HD character asset for a three-layer SVG rig: masked torso, independent left arm, independent right arm. It does not load the old low-resolution frame sequence. Touch Orbit on Home to trigger a full right-arm wave; speaking, listening, reviewing, thinking and success animate the arms separately. Settings > Reduce Motion continues to suppress movement. No changes to stored data or Framework Command pairing.

3.1.1: Corrected the body clip so both original arms fully retract during gestures; avoids duplicated limbs.

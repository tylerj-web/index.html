# Orbit Mobile — The Fixer | Version 2.4 (Robot Personality & UI Rework)

Orbit's actual black-and-gold/cyan original character remains the mascot. This release rebuilds the interface with richer responsive cards, a calmer home screen, full on-device presence indicators and reactive animation states. No separate character was generated.

## What is new

- Redesigned Home: compact four-tile launchpad (Ask Orbit, Inspections, Knowledge, Reports), holographic rings, interactive particles, dark glass surfaces and a character-centred greeting.
- Reworked chat: Orbit's permanent presence indicator above the composer and clearer conversation header.
- Unified workspaces: new card styling, visual hierarchy, active navigation, color system and mobile layouts.
- Robot personality states, powered by the **original supplied sprite frames**: idle breathing/hovering, wave, thinking, reviewing, waiting, listening, talking, happy and error. These react to actual UI events: sending chat, launching the local model, saving drafts, opening inspection templates, browser speech input, and optional text-to-speech.
- Optional reduced motion and native reduced-motion respect; animations pause when the document is hidden.
- UI remains fully functional without downloading the language model; chats remain scripted until the model is loaded successfully.
- All local reports, notes and existing conversations remain under the existing LocalStorage key; this release does not migrate or erase user data.

## Installing

For GitHub Pages, upload the **contents** of this archive inside `orbit/` in the `tylerj-web/index.html` repository, preserving subfolders and without replacing the repository root `index.html`.

Open `https://tylerj-web.github.io/index.html/orbit/` in Safari → Share → Add to Home Screen. The service worker caches the interface files; first open online. For on-device AI go to Settings → Offline intelligence → Install model and allow time for its weights and runtime to download; then test with Airplane Mode on your actual device.

## Truthful status

- This package is a **working UI prototype with optional experimental local text AI**, not a connected Framework Command client. The Connected mode is simulated. There is **no configured laptop gateway, sync, authentic policy store, or approved authority**.
- Model: Qwen2.5-0.5B-Instruct-q4f16_1-MLC via WebLLM. Weights are not included in the ZIP, require download and compatible WebGPU; model memory / browser cache constraints may prevent use on iOS. There is **no cloud AI fallback**.
- SpeechRecognition is browser-provided and may require internet or third-party processing; optional text-to-speech uses the browser's available voices. Offline *text* inference is distinct from offline *voice*.
- Local reports, notes and conversations are stored via browser localStorage **without app-level encryption**; do not enter sensitive or confidential material.
- Browser syntax, navigation and layouts can be tested here; until tested on the device, no iPhone/iPad inference compatibility is guaranteed.
- The user-facing name is **Orbit**; optional title **The Fixer**. The functions, authority limits and relationship with Commander remain unchanged.

## Files

Core: `index.html`, `styles.css`, `rework.css`, `app.js`, `offline-brain.js`, `orbit-behavior.js`, `manifest.webmanifest`, `service-worker.js`, and `assets/` with the original robot frames/icons. Preview PNGs (if included) are optional.

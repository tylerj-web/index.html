# Orbit 3D Laboratory — Build & Test Report
**31 October 2026 · Version 1.0**

## Passed

- Node syntax checks: `app.mjs`, `rig.mjs`, `renderer.mjs`.
- GLB export: importable with trimesh; separate `Head`, `Torso`, `LeftArm`, `RightArm` root nodes, 16 decorative/surface meshes, curved head-screen surface.
- All 16 behavior configurations and their pose values finite.
- Wave visibly rotates right arm by >2 radians at peak; celebration raises both arms symmetrically in the pose math.
- Renderer WebGL2 API mocked integration: shader sources submitted, 16 meshes drawn per state, canvas face texture updates for all 16 states without JavaScript exceptions.
- Chrome DOM/browser UI (GPU renderer substituted with a test stub): 375×667, 390×844, 820×1180, 1440×900, 1920×1080. No horizontal overflow or JavaScript page errors. Behaviour selection, playback toggle, facial override, tabs and preference sliders respond.
- Build uses no external JavaScript packages or remote animation APIs.
- Static source, downloadable GLB and versioned app-shell files included. ZIP integrity and file-reference checks completed during packaging.

## Not verified / constraints

- **Real WebGL2 shader compilation and GPU output:** The provided Chromium environment returns `null` for WebGL/WebGL2 contexts, including with SwiftShader and Xvfb. A true GPU shader/visual pass cannot be claimed.
- **GPU frame rate / actual desktop smoothness:** Requires target desktop hardware or a normal WebGL2-capable browser.
- **Chrome or Edge WebM `MediaRecorder` export:** Code present but browser recording API not exercised with real GPU frames.
- **Standalone browser download handling:** PNG and GLB downloads require a manual end-user check in a real browser.
- **Offline service worker after browser restart:** Static code verified, not exercised across a real HTTPS install in the restricted browser.
- **Physical desktop visual approval:** Model proportions/finish should be reviewed by user at multiple camera angles before declaring character final.
- **Framework Command integration:** Intentionally absent; this is an animation testbed only.

## Important caveat

The GLB is a new **procedural four-part 3D foundation**, not a high-detail artist-finished model. Source reference dimensions/materials are approximated, and the character needs direct design approval. No claimed AI behavior or task status is live.

## Test commands

```
node --check app.mjs
node --check renderer.mjs
node --check rig.mjs
node tests/renderer_mock_test.mjs
python tests/model_integrity_test.py
python tests/browser_ui_test.py
```

The browser harness tests layout and interactions by replacing the WebGL renderer with a stub; it does not claim actual 3D graphics output.

# Orbit — Four-Piece 3D Character Laboratory

**Purpose:** Desktop-first browser testing ground for a genuine 3D Orbit model. This edition replaces the previous 2D animation studio at `/orbit/`, without changing the repository root site. It does not contain a live AI or Framework Command gateway.

## Quick start

- Online: use the deployed GitHub Pages `/orbit/` page.
- Offline after a successful app-shell install: revisit the page in a browser that supports WebGL2 and allows service workers.
- From source: in this directory, run `python -m http.server 8000`, then visit `http://localhost:8000`. Do not open the `.mjs` files directly from `file://`, because module security restrictions vary by browser.

Use **Behaviours** to select one of 16 motions, drag the character to orbit, scroll to zoom, and use timeline controls to pause and scrub. The **Face screen** tab lets you test eyes, cyan scanning, yellow caution, green complete and red error. **Output** exports PNG and WebM (where supported) or downloads a GLB model.

## Files

- `index.html`, `styles.css` — studio shell.
- `rig.mjs` — independent behavior curves, four moving roots and state machine.
- `renderer.mjs` — WebGL2 rendering and dynamic curved face-screen texture.
- `app.mjs` — UI interactions, playback, preferences, capture and optional recording.
- `assets/Orbit_4Piece_Rig.glb` — importable Blender-ready 3D model with four transformable part parents.
- `build_model.py` — reproducible GLB source generator.
- `PRODUCTION_SPEC.md` — comprehensive desktop character technical specification.
- `tests/` — browser UI (mocked GPU) and renderer integration tests.
- `TEST_REPORT.md`, `CHANGELOG.md`, `ROLLBACK.md` — release records.

## Important boundaries

The studio's task-success or error buttons are *demonstrations*, not real operations. The `.glb` file has a static default face texture, while the browser screen uses a live canvas texture. The browser renders the procedural model directly and does not parse the GLB. Their major dimensions and nodes are matched.

The final 3D identity must be visually approved before integration into the Framework Command desktop application. See `PRODUCTION_SPEC.md` for quality gates and remaining sculpting work.

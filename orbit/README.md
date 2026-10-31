# ORBIT Master Sculpt — 2.1 (Dark-blue metal / reflected gold light)

Open `index.html` from a local HTTP server or visit the GitHub Pages testing ground when deployed. WebGL2 is required. Internet is not required once app assets are cached. This is a 3D character testing studio, not Framework Command or a functional AI assistant.

**Character correction:** the suit is midnight-blue metallic. Amber/gold is light reflected along edges, **not** gold-painted metal. The GLB and the studio are built from the same 41 child meshes attached to four moving roots.

* Interactive studio: `index.html`, `app.mjs`, `renderer.mjs`, `rig.mjs`, `styles.css`
* Editable model: `assets/Orbit_Master_Sculpt_Four_Piece.glb`
* Studio mesh source: `assets/sculpt-meshes.bin`, `assets/sculpt-meshes.json`
* Approved references: `assets/approved-orbit-reference.png`, `assets/approved-orbit-sprite-sheet.png`
* Sculpt builder (developer package): `build_sculpt.py`, software preview script `render_sculpt.py`
* Production details: `PRODUCTION_SPEC.md`

User data: this testing ground contains no changes to your Framework Command databases. Service worker updates replace only app-shell caches with the `orbit-3d-` prefix, not site storage/IndexedDB.

Offline video recording and WebGL rendering availability depend on browser/GPU support. All 3D geometry and local code are included in the release; no network library/CDN is loaded.

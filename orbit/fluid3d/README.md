# ORBIT FLUID 3D MOTION LAB 1.0

This is a true WebGL2 3D animation testbed, not the flat Canvas 2D lab. It reuses the actual reference-projected four-root GLB/WebGL meshes, preserving the approved original artwork on the reference-facing surfaces while deriving unseen side/back depth. The physical pieces are Head, Torso, LeftArm and RightArm.

- Continuous physical pose controller: damped springs preserving position and velocity through behaviour changes, integrating with fixed substeps.
- 28 emotion/gesture modes; five chained tests; original-image-derived textures; animated 3D camera orbit and zoom.
- No image-frame interpolation, crossfades, transparent limb morphs or whole-character sprite swapping.
- Dynamic screen overlays for scan, caution, success and error; original eye artwork otherwise maintained.
- Source model in `assets/Orbit_FourPart_Reference3D.glb`.
- WebGL2 is necessary. GPU testing on a desktop remains the main quality checkpoint.
- The geometry cannot be *pixel-perfect* from side/rear views because those views are inferred from limited artwork. The original image is preserved byte-for-byte in `assets/approved_master_1254.png`.

Run using a local web server (e.g. `python -m http.server 8000`) or GitHub Pages. Simply opening via file:// will block mesh fetches in some browsers.

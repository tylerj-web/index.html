# Orbit Fluid 3D — test report

## Structural tests
- Four-root 3D mesh, real depth, projected 2D reference textures.
- 28 behaviours, five chains.
- No CSS/PNG sprite swapping or whole-body opacity fading.
- Spring continuity: state switches preserve current position and velocity.

## Verified test results
- JavaScript syntax: `app.mjs`, `motion.mjs`, `renderer.mjs`, `service-worker.js` passed Node syntax checking.
- Physical 3D geometry: `Orbit_FourPart_Reference3D.glb` has Head, Torso, LeftArm, RightArm roots, 8 rendered meshes, 15,779 vertices.
- Four-piece front reference texture: identical SHA-256 to approved 1254×1254 Orbit PNG (`4a01c38b...`).
- 28 behaviour modes and five chained tests: completed without NaN / undefined pose parameters.
- Joint interruption continuity: new mode selection makes **no immediate change** to pose or joint velocities.
- Maximum angular change: 5.04 degrees per simulated 60fps step in test sequences; this is a numerical check, not a subjective smoothness guarantee.
- Software 3D mesh renders: 5 states rendered with VTK from the exported GLB and recorded pose parameters; see `Orbit_Fluid_3D_Pose_Review.jpg`.
- Static interface layout: 375×667, 390×844, 820×1180, and 1440×900 all fit horizontally without overflow.

## Not verified
- Browser WebGL2 visual appearance and hardware FPS: the available Chromium environment blocks navigation and its blank-page WebGL2 context is unavailable. Test on the actual Framework Laptop 16 in a normal browser.
- Software GLB pose renders do not display the dynamic screen icons, which are implemented in the browser renderer. Facial overlay appearance needs desktop GPU review.

## Design limitations
- The sculpt's unseen sides and back are inferred: this is true 3D with view-dependent rendering but cannot exactly match unseen canonical views.
- The projected arm front texture may look thinner at some rotations; the animation is continuous, but additional 3D sculpting may be required for premium side angles.
- The face signals are dynamic screen graphics over the 3D head; they do not crossfade the character image.

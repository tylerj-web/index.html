# Orbit Motion Studio 1.0 — Test Report

## Passed

- `node --check` on both JavaScript files.
- 15 behaviour profiles present, with finite pose values at sampled times, ordered keyframes, complete 0–1 timeline ranges.
- Simulated Canvas rendering through the frame update loop for all 15 states, with no runtime exceptions.
- The wave drives the right shoulder away from neutral; left and right segments support independent shoulder/elbow movement.
- Simulated click-to-wave event handler and active state selection.
- Motion-setting controls, validation, independent local preference storage, reduced-motion still pose and showreel start.
- All referenced element IDs match an element in `index.html`.
- All six runtime layer PNG files align at 1178 × 1520 px and are loaded by the runtime.
- The manual source-art composite shows actual raised arms and no original hanging-arm duplicate.
- Frame-derived 6-second MP4 review generated successfully for the wave and double-arm celebration.
- Archive integrity, assets included, syntax and static path validation (performed before release).

## Not passed / unavailable

- **Physical desktop GUI/browser navigation:** This environment's Chromium policy is `URLBlocklist=["*"]` and blocks local-file and local-HTTP navigation. Automated browser screenshots and interaction tests therefore cannot be run here; no contrary claim is made.
- **Physical Framework Laptop 16:** not connected to the build environment. Visual smoothness and measured on-screen FPS must be tested on actual hardware.
- **Recording in Safari / iOS:** unverified; feature checks capability and reports unsupported codecs.
- **Service-worker offline restart:** static cache routes and references verified, but offline-browser runtime untested because of the browser restriction.
- **Usability of specific poses:** the rig is available for human evaluation on the published testing ground; the user may request further pose and expression refinements.

## Safety and data

No prior Orbit data stores or local records are accessed. The studio uses a new isolated localStorage preference key. No Framework Command gateway or AI interface is claimed.

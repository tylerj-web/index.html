# Orbit · Character Animation Studio

**Animation Lab release:** 1.0.0 (Orbit desktop character development test ground)

## Purpose

This is a standalone, locally rendered animation and behaviour testing environment for **Orbit — The Fixer**, using the user's approved original black-and-gold artwork. It temporarily replaces the previous mobile assistant interface **only at `/orbit/`** so the robot's movement can be examined and refined before integration into Framework Command.

It is **not** a live Framework Command connection, a local AI model or a replacement for the desktop AI architecture.

## Main capabilities

- 15 controlled behavioural states, including a true jointed wave, hover, greeting, listening, thinking, speaking, reading/reviewing, scanning, curiosity, deep focus, celebration, concern, error, sleep and waking.
- High-resolution animated layers derived from the approved original 1254×1254 source illustration: two independently rotating shoulders, two elbow sections, a head pivot, eye expression / blink animation and a responsive core light.
- State-based transitions with eased keyframes, secondary hover motion and cursor-aware gaze.
- Frame-by-frame animation review, playback controls, looping, timeline seeking, speed / motion / glow adjustments and scene themes.
- Play-all showreel, PNG frame snapshots, motion-profile import/export and a browser-recording option where MediaRecorder supports the necessary codec.
- Reduced-motion support, background suspension and automatic render-resolution reduction when the browser is consistently unable to sustain smooth playback.
- Self-contained HTML, CSS, JavaScript and raster artwork; no third-party script or cloud AI call.

## Quick start

Use the published `/orbit/` page, or host the extracted package as a static website. For local work, `python -m http.server 8765` from this directory can serve the static files; use `http://localhost:8765/` in an unrestricted browser.

Click one of the 15 behaviours to play it. Click Orbit himself to wave. Press **Space** to pause, **Left/Right** to change behaviour, **W** to wave, and **R** to run the showreel. Use the right inspector for speed and expression tuning. The **Capture frame** button exports a PNG of the current animation canvas.

Browser-supported clip recording lasts up to 8 seconds and may not work in some browsers. If recording is unsupported, the studio reports that explicitly.

## Important data separation

This animation lab writes only to the new preference key `orbit.motion.studio.settings.v1` and its own application-shell cache. It does not open, migrate, delete or modify the prior Orbit chat, report, policy, or IndexedDB storage. The old mobile interface is not displayed while this studio occupies `/orbit/`, but the legacy source can be restored using Git history or the separate Orbit 3.2 release package.

## Architecture

- `studio.js`: behaviour library, interpolation, puppet rig, Canvas 2D renderer, interaction controls, exports.
- `studio.css`: responsive studio interface and showcase environment.
- `assets/head.png`, `assets/torso.png`, `assets/*-arm-{upper,lower}.png`: isolated original HD artwork, all sharing an aligned 589×760 logical coordinate system at 2× pixel density.
- `assets/orbit-master-hd.png`: higher-resolution chroma-key extraction of original supplied character illustration.
- `service-worker.js`: this studio's isolated shell cache.
- `manifest.webmanifest`: installable web app metadata.

## Known limitations

- The animation is a high-resolution 2.5D rig, **not a fully modelled 3D character**. Some out-of-plane motions would require new painted views or an actual 3D asset.
- The source illustration has only one limb texture per arm. Elbow deformation is an approximation, and complex silhouettes are not yet production-validated on the physical Framework Laptop 16.
- Quality and actual frame rate depend on the user's browser, graphics drivers and hardware. The on-screen FPS is measured rather than promised.
- The local browser environment used for this build enforces an administrator URL blocklist, preventing page-navigation screenshot testing. We used asset-derived rendered pose comparisons, JS runtime simulations and static integrity checks instead. Real browser, desktop hardware and device tests remain open.

See `TEST_REPORT.md` for exact evidence and limitations. See `ROLLBACK.md` for reversing the testing-ground deployment.

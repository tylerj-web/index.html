# Orbit Fluid Motion Studio 1.0

Replacement animation **testing ground**, deployed separately at `/orbit/fluid/`, keeping `/orbit/` 3D and `/orbit/5x/` legacy atlases for comparison.

## Why

The previous `5x` library used optical-flow frame synthesis and image-to-image fades, producing translucent duplicates, ghosting and pose snapping. Increasing frames did not solve those problems.

This version **does not use optical flow, sprite-frame blending, or swapping of whole characters**. It uses original-approved artwork extracted into four stable HD PNG layers (head, torso, left arm, right arm). Each layer has a pivot. Time-continuous target poses are followed with exact critically-damped spring integration, maintaining both position and velocity when the user interrupts an action.

The screen-face expressions (cyan eyes, scan, yellow caution, green completion, red error, processing) are rendered on top of a constant head shell. Only the character parts change their transforms. The polished face expressions are drawn at canvas resolution, not downloaded as images.

## Included

- `index.html` + `style.css` + `engine.js`: complete zero-dependency fluid animation test page.
- `assets/*.png`: **cropped from the existing approved Orbit master artwork**, not AI-generated replacements.
- `assets/parts.json`: source-space crop coordinates for each piece.
- `previews/Orbit_Fluid_Motion_Test.mp4`: an 11-second clip captured from Chromium's actual canvas at 30fps, with seven sequential actions.
- `service-worker.js`: dedicated local cache scoped to `/orbit/fluid/`, not touching user data elsewhere.
- `tests/`: optional development-level checks in source ZIP.

## Behaviours

28 UI states are available. Five chain tests cover conversation, inspections, recovery, greeting, and interruption. A selectable behaviour may be interrupted at any time without a pose reset.

## Limitations

This is an improved 2D visual animation rig, **not** a complete physically sculpted 3D replica or a finished AI engine. A rigid arm rotates as one piece; deep 3D turns and artist-sculpted hidden surfaces are not supported. The face graphics are procedurally recreated, so the resting screen is faithful but **not pixel-for-pixel identical** to the source. Some poses may still need art-direction refinements. This engine removes the specific optical-flow ghosting and hard-switch pose jumps, but it does not establish subjective 100%-perfect naturalism. Physical iPhone and user's desktop GPU testing remain outstanding.

No Framework Command connectivity, AI replies, or policy data are included.

# Orbit Sprite Alignment — Production Contract V3

## Why V2 was visibly wrong

The previous 14-sheet atlas repair verified empty cell borders, but did not verify Orbit's position inside those borders. The actual original V2 atlas frames still had 55–90.5 pixel horizontal movement in the detected helmet location, even in supposedly stationary emotes.

## Rules for every future animation

1. Extract and inspect each source pose individually. Never infer frame boundaries solely by dividing an image-generated collage into equal columns.
2. Anchor the character to a physically identifiable landmark, normally the centre and top of Orbit's helmet, and record that coordinate in metadata. Preserve chest-core coordinates for additional diagnostics.
3. Convert separated poses into uniform transparent RGBA cells. Never upscale, reshape, or stretch the character merely to conceal jitter.
4. After packing, **measure temporal positioning** of all displayed frames, not just border opacity. For stationary emotes the visible head anchor must remain within 2 pixels of the declared position throughout the clip; V3 measured <=1 pixel.
5. Allow at least 12 completely transparent pixels at every cell boundary; expand the cell if gestures, beam trails, jet effects or portal effects need more room.
6. Keep unmodified approved source PNGs; all new processed images go in new versioned directories.
7. Explicitly mark and count missing-source frames. The existing 14 animations have 18 documented holds copied from intact adjacent poses where generated source art was incomplete; do not mislabel them as newly animated frames.
8. Future fast and slow flight sheets: store a stable local sprite pivot; the desktop runtime controls screen translation separately. Mirror direction using the declared pivot; check the position of jet streams and particle tails against cell padding.
9. Teleport and portal hiding: mark frames with no character as `characterPresent: false`. Register the glowing portal or blue spark against its own fixed world-space anchor; do not attempt helmet detection when Orbit is absent.
10. Diving or emerging from a portal is *intentional* movement. Store expected per-frame root offsets and measure **residual** drift relative to those offsets. Do not mistakenly eliminate desired motion.
11. Test the last frame against the first on looping clips, as well as neighbouring-frame changes. Require no abrupt position discontinuity unless explicitly authored.
12. Before publishing, load all images in a real browser, scrub across atlas rows, run full animation playback, verify dimensions and metadata, and check console errors.
13. If there is any unregistered drift, clipped artwork, missing source, corrupted export or unsupported frame geometry, fail the release. Do not claim a visual pass based only on empty edge pixels.

## Verified approved V3 set

- 14 sprite sheets, 60 frames per action, **840 frames total**.
- Each output cell **416 × 416**; each atlas **4160 × 2496**.
- Before stabilization: helmet horizontal variation **55–90.5 pixels**, depending on action.
- After stabilization: horizontal variation **1 pixel**, vertical variation **0–1 pixel**.
- Zero opaque pixels within 12 pixels of frame edges.
- Original approved source images and prior V2 assets preserved for reference/rollback.
- Browser loads and plays all 14 stabilized animations with no JavaScript errors.
- These are source-preserving positional repairs. Some originally generated pose-to-pose shape changes and the 18 held frames can still create motion artifacts; this process does not invent 3D frames or repair missing anatomy.

## Code and runtime

- `stabilize_atlases_v3.py`: registers original V2-approved separated poses against a consistent helmet reference.
- `manifest-approved-stabilized.json`: production atlas URLs, frame geometry and drift measurements.
- `assets/approved/stabilized/`: deployed V3 PNG masters, WebP playback atlases and thumbnails.
- `.github/workflows/orbit-stabilized-v3.yml`: runs a new reconstruction and rejects images with drift over 1.5 pixels or any edge contamination.

For new actions with genuine character movement, replace the stationary-anchor assumption with authored `expectedOffsetX` / `expectedOffsetY` curves and validate measured anchor minus expected movement.

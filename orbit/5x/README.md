# Orbit — The Fixer / 5× Motion Atlas v2.3

## Contents

- **28 emote sprite sheets**, 60 RGBA frames each at 352×448 pixels: 1,680 frames.
- **31 transition sprite sheets**, 24 RGBA frames each: 744 frames.
- **2,424 individually numbered PNGs**, packaged separately due to size.
- **59 animated GIF previews**, plus five chained MP4 previews.
- **Interactive offline HTML viewer** (`index.html`, `viewer.js`, `manifest.js`).
- Full metadata and validation in `manifest.json` and `TEST_REPORT.json`.

**Important:** This is an image-derived expansion of the supplied Orbit sprites. It preserves the source imagery at frame 1 of each emote, but some synthesized in-betweens still contain warped/blended edges or doubled limbs during large changes. It is **not** certified to have 100% perceptual continuity and should be treated as a production *review candidate*, not a hand-animated final master.

## Installation

1. Extract `ORBIT_5X_Studio_and_Sprite_Sheets.zip` into a folder.
2. Open `index.html` in Chrome, Edge or Safari. The viewer is static and requires no server or LLM. The embedded manifest avoids local JSON-fetch restrictions.
3. Choose an emote on the left or a transition from the dropdown. Use speed, pause, next frame and scrub to inspect motion.
4. To inspect all standalone PNGs, extract `ORBIT_5X_Individual_Numbered_Frames.zip` into **the same folder**. The viewer's **Download frame** button can also export the currently displayed PNG directly from its canvas without that package.
5. The GIFs are in `previews/`, the MP4 chain tests in `chained_previews/`.

## Asset layout

`atlases/<index>_<emote>_60f.png`  — 10 columns × 6 rows, 352×448 tiles

`transitions/<index>_<source>_to_<target>_24f.png` — 8 columns × 3 rows

`frames/emotes/<emote>/<emote>_0001.png` ... `_0060.png`

`frames/transitions/<source>_to_<target>/<source>_to_<target>_0001.png` ... `_0024.png`

All atlas and frame PNG backgrounds are transparent. Magenta is used only in visual reference material or as an optional viewer background.

## Transition engine

Clips normally play at **24 fps**, with all emotes 2.5 seconds and bridges 1 second. The terminal frame of each transition is pixel-identical to the first target emote frame, while its first frame matches the source emote's last frame. The viewer can execute chains such as:

- idle → listening → thinking → speaking → idle
- idle → scanning → complete → idle
- idle → caution → error → idle
- sleepy → wake → idle → wave
- sad → idle

`wake` is a transitional bridge only, not a separate emote. The viewer uses a transition graph and can route through intermediate states where authored bridges exist. For unsupported pairs, it reports that no bridge is available instead of falsely implying the change is seamless.

## Motion generation

The canonical input consists of 28 existing 12-frame Orbit atlases. We generate four intermediate frames between adjacent source frames using bidirectional optical-flow warping, alpha-aware synthesis and ease curves. The original first source frame is preserved exactly. For wave, greeting and celebration, a separately masked image-space arm rig avoids the worst double-arm ghosting. Smooth, subtle cyan eye/core illumination adds secondary motion to otherwise static holds.

The result has 60 **byte-distinct** RGBA frames for each emote. Byte-distinctness does **not** mean every pose is unique or that all frames are artistically perfect.

## Limitations

- Interpolation cannot infer truly unseen arm/torso surfaces or guarantee anatomical continuity.
- Some bridges between visually disparate poses show temporary double silhouettes; inspect these manually before adopting them in a production UI.
- Loop seam matching and frame-difference metrics are not substitutes for artist review.
- Physical device GPU performance is not verified by the rendering tests.
- The library's master source sheet is not modified, and no changes to GitHub have been made as part of this build.

## License / ownership

All imagery derives from the user-supplied Orbit artwork and sprite references; these packages make no claim of new intellectual property ownership.

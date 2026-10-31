# Orbit 5× Expansion — Test report

**Version:** v2.3, source-derived RGBA animation library.

## Passed checks

- 28 named emotes, each expanded from 12 source frames to 60 PNG frames.
- 31 one-shot transition clips at 24 PNG frames each (25 minimum required plus six additional bridges).
- Exactly 2,424 numbered individual PNG frames: 1,680 emote + 744 transition frames.
- 28 atlases at 3520×2688 pixels, each containing a 10×6 grid of 352×448 transparent tiles.
- 31 transition atlases at 2816×1344 pixels, each containing an 8×3 grid of 352×448 transparent tiles.
- All 28 emote first frames match the canonical source's first frame byte-for-byte (pixel-for-pixel RGBA).
- Every emote has 60 distinct frame hashes after subtle continuous core/eye-light modulation.
- All 31 bridge starting and ending frames match their documented source/target clips pixel-for-pixel.
- All 28 measured loop seam differences are within the predefined relaxed threshold (≤8 average difference on an 88×112 proxy image).
- 59 GIF previews plus five chained MP4 reviews.
- Viewer JavaScript syntax verified; desktop (1440×900) and mobile (390×844) **Chromium component tests** with embedded local assets passed, with no recorded page errors or horizontal overflow.
- Five chain route definitions included; automatic bridge selection tested.

## Flagged for artistic review

Three generated emotes show comparatively larger per-frame differences in the proxy metric: `curious`, `nod`, and `fly_left`. Large changes in face shape and limb pose also produce visibly imperfect optical interpolations even where the numerical metric is low. In particular, scan→complete contains temporary overlaps in the intermediate hand positions. The extracted original art is not a fully segmented deformable rig, which prevents an automatic guarantee of 100% perceptual continuity.

## Not verified

- A real-world desktop runtime sustained at 24 fps on the user's Framework 16.
- Pixel-perfect appearance at every in-between frame. Source anchors are preserved; interpolation is reconstructed.
- Every possible pair of emotes. The transition graph includes 31 direct pairs and rejects unsupported connections.
- GPU, battery and memory profiling on iPhone, iPad or desktop hardware.

**Release decision:** Suitable as an **inspection and development library**. Not certified as fully hand-animated production masters. See `TEST_REPORT.json` for counts and frame-delta metrics.

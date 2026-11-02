# V3 positional alignment correction — 2 November 2026

The V2 version still visibly shifted Orbit between animation frames because its check only looked for opaque atlas edge pixels. A direct head-centre audit found 55–90.5 px of motion in nominally stationary emotes.

**V3 is now the production runtime source.** Each original approved pose was translated (without reshaping it) into a padded 416×416 transparent cell, registered to the helmet's visual centre and top. This reduced the measured head-position variation to 0–1px across every 60-frame animation. All 840 frames also passed the 12px fully transparent margin test. The exact original approved sources, V2 atlases and 18 documented source-missing frame holds remain preserved.

- Runtime manifest: `manifest-approved-stabilized.json`
- Runtime atlases: `assets/approved/stabilized/<action>.webp`
- PNG atlases: `assets/approved/stabilized/<action>.png`
- Rebuilder / QA: `stabilize_atlases_v3.py`
- GitHub Actions: `.github/workflows/orbit-stabilized-v3.yml`
- Mandatory future requirements: `FUTURE_SPRITES_V3_ALIGNMENT.md`

The live browser was tested against all fourteen repaired actions: frames displayed, playback changed, original-download links pointed at the stabilized images and there were no JavaScript page errors. These checks verify registration and functional playback, not perfection of every generated pose transition.

---

# Orbit — Approved Sprite Animation Studio (14 motions)

**Published:** 2 November 2026  
**Live site:** https://tylerj-web.github.io/index.html/orbit/sprite-studio-v4/

## Production state

This page now plays the fourteen **user-approved** Orbit animation strips, not the earlier V4 placeholder/blue-dot emotes and not the older optical-flow 5× library.

The approved action set comprises:

1. Idle / float — updated approved sheet
2. Wave / greeting — updated approved sheet
3. Listening — updated approved sheet
4. Thinking — updated approved sheet
5. Speaking
6. Celebration
7. Scanning
8. Caution
9. Complete / success
10. Error / recovery — updated approved sheet
11. Sleep
12. Wake
13. Review / inspection
14. Return to idle

Each source atlas is a **10-column × 6-row** ordered grid, 60 illustrated frames, with 30 FPS playback as the default (2 seconds per sequence). The viewer also supports 24, 15 and 8 FPS playback for inspection. Some are looping; the rest play once and stop at the end pose. These are the exact approved images, not a claim of independently rendered 3D motion.

## Files

- `index.html`: mobile-friendly static playback studio, scrubbable timeline, playback controls, background options, sheet view, direct downloads.
- `manifest-approved.json`: installed asset metadata and frame counts.
- `approved_sources.json`: name mapping, short-lived imported-source references, original SHA-256 checksums; preserved for provenance.
- `assets/approved/<id>.webp`: optimized, full-dimension RGBA WebP sheets used on the site.
- `assets/approved/source/<id>.png`: unmodified original approved PNG source sheets.
- `build_assets.py`: deterministic hash-checking, black-background separation for later source sheets, and output generation.
- `.github/workflows/publish-orbit-approved-14.yml`: one-time import workflow (completed successfully).

Original sheet dimensions: 1448×1086 (nine corrected/new sheets) or 1619×971 (five retained earlier approved sheets). Grid cells are calculated from actual image dimensions, avoiding mistaken fixed-width cropping.

## Verification

- Automated GitHub Actions import: **success**.
- Fourteen WebP outputs and fourteen preserved source PNGs: **confirmed in the GitHub repository**.
- All 14 WebP sheets: **HTTP 200** from published GitHub Pages when checked via browser.
- Live browser test at 1440×920: fourteen selectable entries, frame playback changes, full motion viewer, every selected action draws non-empty pixels, **zero page JavaScript errors**.
- No dependency on temporary Adobe asset links at runtime; the site serves the versioned sprites from its own repository.

## Boundaries

Approved sprite art and browser playback are complete for this set. The page is a **sprite animation preview**, not an AI agent, OS mouse tracker, or a live physically animated 3D model. Those future mechanics require a separate native integration and can reuse the manifest as a behavior-to-animation map.

The original `orbit/` 3D studio and `orbit/5x/` motion library have been preserved.

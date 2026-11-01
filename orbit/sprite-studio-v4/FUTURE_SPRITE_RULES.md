# Orbit Sprite Atlas Production Contract — v2

## Mandatory for every subsequent animation

1. Render individual fully-visible RGBA PNG frames first. **Never treat an image-generator collage as a mathematically uniform grid.** The approved 14 had horizontal drift, unequal vertical pitch, and lost right-edge frames.
2. Each frame has an explicit, identical canvas (recommended 320×320 or 512×512). Maintain a constant anchor at Orbit's cyan chest core for static gestures. Animate head/arms *relative* to that anchor. For travel, move Orbit via the desktop engine; render flight loops anchored at the core.
3. At least 9 px of fully transparent margin on **all four edges** of every frame. Put exhaust, sparks and portal effects in their own oversized/layered effects atlas if they exceed Orbit's canvas; do not clip or move Orbit's anchor to accommodate effects.
4. When Orbit teleports, hides or reappears, disappearing pixels are intentional; register the intended location and size in the JSON manifest. **Never require a visible chest core on every transition frame.** Build such sequences with explicit anchor metadata and effect layers.
5. Assemble **from individual validated frames**, never by calculating imageWidth/10 and assuming all objects are centered. Add cell padding and preserve the full character silhouette.
6. Export `action.webp` (optimized preview), `action.png` (lossless source), a compact thumbnail and a manifest with `frames`, `fps`, `cols`, `rows`, `cellWidth`, `cellHeight`, `anchor`, `loop`, `duration`, `transitions`, and known source limitations.
7. Run `validate_future_atlas.py` and reject any result with opaque border pixels or mismatched atlas geometry. Human-review scrubbed playback for jumps, wrong poses, accidental neighbouring frame fragments and motion timing.
8. No false claims of native 30 FPS: 60 still frames played at 30 FPS is a 2s sequence, but interframe artistic quality remains a separate review requirement.

## For pre-existing badly aligned source sheets

Use `normalize_sprites.py` (specialised for the approved 14) to detect the variable rows and columns, align to the chest core, remove detached neighbour fragments, add alpha guard margins, and mark clipped source frames as `held_complete_prior`. **These recovered holds are not newly animated frames.** Do not silently declare missing source artwork recovered.

## Flight and portal design

- Fast flight uses one rightward animation, mirrored for left, plus a separately anchored cyan exhaust trail.
- Slow flight uses a distinct calm loop; desktop application performs translation.
- Teleport: separate departure and arrival phases, with explicit fully transparent frames.
- Hide: laser cut circle behind Orbit → dark portal expands → Orbit enters → hole collapses.
- Return: cyan spark → portal expands → Orbit climbs/flies out → portal closes.
- Each of these must be rendered as actual individual frames and separately reviewed before publication. Concept boards are **not** production atlases.
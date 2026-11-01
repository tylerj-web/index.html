# V4.1 playback correction — 2 November 2026

The initial V4 page incorrectly defaulted to a live static Orbit rendering plus tiny OLED symbols. This produced a blue dot and almost no full-body motion. That was **not the user's requested animation system**.

The page now defaults to the 28 actual pre-existing, source-derived 60-frame 24 FPS emote atlases, and also exposes 31 actual 24-frame 24 FPS transitions. Unproduced actions are in a separate Planned tab and do not play a fake bobbing animation. The static character fallback is explicitly identified as unanimated. The placeholder blue-dot OLED function is no longer invoked. No change was made to the old Orbit 3D or Orbit 5× viewer files.

The online page does **not** host the new high-resolution 30 FPS pilot atlases. The local offline package `ORBIT_V4_1_FIXED_MOTION_REVIEW.zip` contains 4 image-derived 30 FPS pilot clips and 10 original user-supplied sprite strips (73 frames). They can be played, stepped, and scrubbed in the offline reviewer.

**Artistic status:** The existing 5× atlas contains optical-flow-generated in-betweens and some known deformation; the four 30 FPS pilot clips are 2.5D image-derived movements, not rigged 3D renders. The full 141-action bespoke high-resolution animation library has not been produced.

---

# Orbit V4 — Original Sprite & OLED Review Studio

Source-only review deployment. This is a new subdirectory; it does not replace the existing `orbit/` 3D sculpt or `orbit/5x/` motion viewer.

## What this page really does

- Loads the original approved high-resolution Orbit reference in the browser and removes its magenta background for a live canvas preview.
- Renders status glyphs *inside the face* and demonstrates browser-canvas pointer reactions.
- Lists the 141 requested emotions, commands, system states, cursor behaviours, movements and composite actions.
- Reuses the 28 existing source-derived 24 FPS emote atlas sheets from `orbit/5x/` when an actual existing clip is available.
- Allows users to filter, inspect, review and export notes as JSON. Local notes stay in the browser's localStorage.

## What it does NOT do

The 141 actions do not yet have 141 individually authored motion sheets. Many are procedural screen-state **concept previews**, explicitly labelled in the interface. The live 30 FPS canvas animation is **not a new 30 FPS sprite export**. The 28 existing 5× emotes are source-derived and have known interpolation limitations.

Four new 1024×1024 transparent RGBA pilot animations (idle, thinking, wave and processing) were generated separately from the approved original artwork, with 30 FPS timing and individual atlas pages. They are distributed as review/download ZIPs in the ChatGPT conversation, not uploaded into this static GitHub directory because they contain hundreds of megabytes of new lossless images. They are image-derived 2.5D motion, not newly modelled 3D renders and require artist review.

## Character rules

Master visual authority: `../assets/approved-orbit-reference.png` and `../assets/approved-orbit-sprite-sheet.png`. Dark midnight-blue metal with warm-gold reflections, original cyan eyes and core, legless floating structure. Never substitute a generic robot.

## Local GitHub Pages path

Likely project-site location when Pages publishes from `main`: `https://tylerj-web.github.io/index.html/orbit/sprite-studio-v4/`. Repository commit is confirmed; a live Pages browser check was not available at build time.

## Next artistic and technical gate

Review the four detailed pilots; repair wavering limbs / face-display transitions where necessary, then create bespoke assets from the vetted 3D rig. Desktop mouse-tracking and computer controls will need a separate authorised native application or bridge; the GitHub page is a browser-only demonstration.

# Orbit Sprite Atlas v1 Test Report

## Passed
- 28 unique per-emote atlas PNG files exist.
- 12 nonempty RGBA frames per atlas; 336 total.
- Every atlas is 4224 x 448 pixels; each frame exactly 352 x 448 pixels.
- No alpha-free frames, so compositions do not depend on the original magenta background.
- Browser simulation in Chromium via in-memory HTML succeeded on 390x844 mobile and 1280x800 desktop viewports.
- Emote buttons, state switching, frame-stepping, background change and animation rate UI passed. No JS page errors in those checks.
- The original source art is preserved; output operations are cropping, chroma removal, layout alignment, state-specific vertical motion and light pulses.

## Not verified or not fully satisfied
- These are not hand-drawn unique in-between frames: some emotes repeat their original authored pose across multiple frames.
- Pixel-for-pixel continuity across independent historical source images is not guaranteed. The images come from multiple pose strips and may differ subtly in proportions.
- Actual GPU performance on user's Framework laptop is not tested.
- Chromium navigation to local files is blocked in the testing environment. In-memory page testing was used.
- Source reflections and shapes are preserved from the images; no fully rigged 3D animation is supplied.

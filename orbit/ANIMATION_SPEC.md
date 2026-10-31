# Orbit Animation Rig — Production Notes

## Asset provenance

All visible robot textures originate from the user's approved original illustration **"Orbit, the cyan-core floating robot.png"** and the existing Orbit visual canon. The HD source is chroma-keyed, matte-cleaned and split into head, body, and left/right upper and lower arms. Eyes are redrawn parametrically against the eye-free head texture. This avoids switching between low-resolution sprite frames. No new alternate character has been substituted.

## Coordinate system

Animation rig uses a 589 × 760 logical unit space. Source PNGs are exported at 1178 × 1520 pixels to maintain sampling quality. The head pivot is `(294,445)`; left and right shoulder pivots are approximately `(174,475)` and `(415,475)`; elbow pivots are `(102,585)` and `(487,585)`.

## State machine

The library includes 15 choreographed states. Each keyframe describes body/neck tilt, shoulder and elbow angles, displacement, eye openness, gaze offset, and core pulse. Keyframes are interpolated smoothly and new states blend from the currently displayed pose. Continuous states loop; one-shot gestures settle to idle. The Showreel follows a preset sequence. The user can scrub a timeline or pause performance.

### Emotional operating standards

- Idle: restrained, natural hover; not perpetual excessive motion.
- Greeting and wave: secondary anticipation, real shoulder lift, independent elbow ripple, natural settle.
- Listening: attentive posture, measured core light, no indication that a microphone is actually connected.
- Thinking/reviewing: careful eye shifts and arm gestures; no invented knowledge or audit status.
- Speaking: paced gesture movement, not a claim of phoneme-level lip syncing or TTS integration.
- Celebration: high-energy but short-lived motion.
- Error/concern: communicate uncertainty calmly, avoiding alarm-like flashing.
- Sleep: eyes closed and motion limited.

## Desktop integration boundary

This studio develops the **character performance layer** only. The eventual desktop version must provide real inference, task and notification events to the state controller. A user should not need to run a fake "thinking" animation without an underlying AI action once the production system is built. No live Framework Command or Commander channel is present here.

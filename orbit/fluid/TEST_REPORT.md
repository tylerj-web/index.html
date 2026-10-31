# Orbit Fluid Studio 1.0 — Test report

## Passed in local Chromium

- Canvas and all four approved-art PNG layers loaded, no console/page errors.
- 28/28 behaviour modes selectable; 5/5 chained sequences completed.
- Desktop 1440×900, mobile 390×844 and 375×667, tablet 820×1180: no horizontal overflow.
- Actual rendered screenshots inspected for idle, wave, celebration, listening, thinking, speaking, scan, caution, completion and error.
- Recorded a real 11-second H.264 motion preview directly from Canvas output.
- `node --check engine.js` passes.
- All physics channels finite under rapid state-switching stress tests.
- Immediate pose delta at transition: 0.0; immediate velocity delta at transition: 0.0.
- Max observed angular change in the 28-state stress test: 5.177 degrees per 1/60 second simulation step, under test threshold 9 degrees. This is a numerical check, **not** subjective proof of smoothness.
- No whole-body sprite cross-fading or optical-flow frame interpolation in the renderer.
- No model/data persistence migration: this is a separate path; legacy test pages remain available.

## Not physically verified

- User's exact desktop GPU frame-rate and animations under sustained processing load.
- Physical mobile GPU, touch, and Safari performance.
- Subjective animation quality with real-time playback, which should be inspected by the owner.
- Service worker installation/online-offline restart, because the local browser harness blocks direct website navigation; tests loaded scripts/images inline using `page.set_content`.

## Key engineering constraint

Critically damped springs preserve position and velocity when changing targets. The bodies remain the same approved PNG source layers. Screen-only symbol changes remain intentionally discrete/electronically animated and do not mix two whole sprites.

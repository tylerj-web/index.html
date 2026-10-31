# ORBIT — THE FIXER
## 3D Character Production Specification & Integration Contract
**Version:** 1.0 · **Release:** Four-Piece 3D Animation Laboratory · **Date:** 31 October 2026

### Purpose and authority
Orbit is a character-driven interface for a future desktop AI system. The 3D Studio is **an animation and facial-signal test environment only**. It contains no language model, no Framework Command gateway, no authoritative policy, and no connection to live tasks. Its signals can be invoked manually for preview; in a deployed assistant, the desktop application must drive them from verified events.

## A. Character anatomy — exactly four moving pieces

| Root node | Neutral center in world units | Dynamic channels | Construction |
|---|---:|---|---|
| `Head` | (0, +0.77, 0) | yaw, pitch, roll | Oversized glossy black rounded shell; gold perimeter trim; front screen surface with dynamic texture |
| `Torso` | (0, −0.71, 0) | lean, pitch/roll, hover | Tapered compact black shell, gold trim and mounted cyan core |
| `LeftArm` | (−0.73, −0.37, +0.06) | shoulder rotation and secondary depth motion | Single rigid articulated arm including its gold perimeter and black plating |
| `RightArm` | (+0.73, −0.37, +0.06) | shoulder rotation and secondary depth motion | Independent counterpart used for actual waving, gestures and celebrations |

The model is organised into four **independently transformable root parts** in `assets/Orbit_4Piece_Rig.glb`. Each root includes decorative surface meshes. There are no independently articulated fingers, wrists, elbows, or legs. The head's display is a *surface texture*, and the cyan chest light is an *attached material detail*, rather than extra character pieces.

The default GLB contains a static eye texture suitable for import into a 3D editing package. The browser studio replaces that static texture with a dynamic 1024 × 640 pixel screen generated at runtime. The browser renderer and GLB are procedurally matched; the deployed renderer does **not** parse the GLB at runtime.

### Art direction
- Maintain the approved character identity: compact floating robot, oversized black face/head, gold trim, black torso and two short arms, cyan eyes and center core.
- Rounded continuous materials rather than segmented mechanical fingers/limbs.
- Premium but restrained surface highlights, soft environmental glow, no gratuitous effects.
- Front gaze is dominant. Side rotation must reveal genuine volume and joint separation.
- Use high-resolution continuous rendering rather than swapping old 160×192-pixel images.
- Never substitute a different mascot design or invent facial anatomy such as a human mouth.

### Geometry / material requirements
- World up is +Y, character front is +Z, root body nominally at X=0.
- Metallic gold trim with contrasting near-black armour.
- Separate curved facial display surface attached to head pivot, emissive or unlit.
- Emissive cyan center core attached to torso.
- High-resolution mesh tessellation, antialiasing, consistent silhouette from ±60° view.
- No visible part clipping in the default pose, wave or celebration at front and 3/4 perspectives.

## B. Dynamic face screen

The head owns a live display, which is an independent *visual system* but not a fifth body part. Draw and upload the face graphic at an appropriate rate; the main 3D model remains stable.

| Category | Display | Color | Meaning |
|---|---|---|---|
| Idle, greeting, joy | Two expressive cyan curved eyes, blink | Cyan | Present and friendly |
| Listening | Responsive cyan eyes | Cyan | An active listening state, if supplied by real host events |
| Thinking / focus | Narrowed or shifted eyes | Cyan | Model processing only when the host actually reports it |
| Speaking | Eye and subtle screen response | Cyan | Speech playback/response in progress; not lip-sync unless integrated |
| Scanning | Sweep + scan outline | Cyan | Host reports an actual scanning job |
| Caution | Triangle with exclamation | Yellow `#ffd36b` | Nonfatal warning / user attention required |
| Task completed | Checkmark in circle | Green `#67f0a4` | Host confirms successful completion |
| Error | Exclamation in circle | Red `#ff6373` | Host returns a real failure |
| Resting | Closed/dim cyan eyes | Cyan/dim | Low-activity character state |

**Priority rule:** error > caution > success > scanning/processing > conversation emotion > idle. Critical screen indicators must be legible without relying only on color. They must not flash rapidly. Success and error displays must only claim real outcomes when driven by a verified event from the host.

The studio contains a *manual face override* solely to test the display. In production, the override must be restricted to developer/debug mode.

## C. Movement and state machine

**Implemented preview behaviours:** Idle, Greeting, Real wave, Listening, Thinking, Speaking, Curiosity, Scanning, Reviewing, Focused, Celebration, Task complete, Caution, Error, Resting, Wake. These are 16 independently selectable states.

- Use time-based interpolation rather than static image swaps.
- Enter a new state by interpolating from the currently displayed pose to the next state using eased transitions; never snap parts abruptly.
- Idle motion is restrained: breathing-like lift, soft head drift, quiet core oscillation and occasional blinking.
- Wave: body acknowledgment → shoulder lift → visible repeated arm sways → settling → rest.
- Celebrate: both arms lift, coordinated buoyancy, settle; short-lived and not continuously repetitive.
- Head gestures and torso movement overlap with slight timing differences.
- Reduce motion when app is hidden, when a low-power mode is requested or when user accessibility preferences require it.
- Do not use visual behaviours to fabricate task evidence.

### Host events for the eventual desktop app

The application should expose a narrow event bridge rather than letting the AI directly mutate rig matrices:

```ts
type OrbitEvent =
  | { kind: "presence"; activity: "greet" | "idle" | "rest" }
  | { kind: "input"; activity: "listening" | "user_typing" | "input_ended" }
  | { kind: "inference"; activity: "started" | "streaming" | "finished" }
  | { kind: "workflow"; activity: "scan_started" | "review_started" }
  | { kind: "result"; status: "success" | "caution" | "error"; eventId: string; source: "desktop_backend"; summary?: string };
```

Validate event shape and origin. Treat a request to *show* a green check as a different event from a verified task-completion result. The character is presentation, not an authority source.

### Priority and duration
- Error and caution must preempt idle and ordinary conversation gestures.
- One-shot actions should return to rest or the last appropriate active state after an explicit duration.
- Continuous states should not endlessly replay large gestures; use lower-energy variants.
- Animation time should be independent of frame rate, with delta-time clamped to avoid jumps when a device wakes.
- Default target is 60fps on suitable desktop hardware. Never claim guaranteed frame rate without measurement.

## D. The 3D test studio (Github `/orbit/`)

The studio is a standalone static website. All runtime sources and assets ship in the deployment ZIP. There are **no CDN scripts** or network API calls required to draw Orbit. A compatible GPU/browser must support WebGL2.

User-facing testing features:
1. 16 selectable behaviour states.
2. Face-screen override, including yellow caution, green success, red error, cyan scan.
3. Camera drag-to-orbit, wheel-to-zoom and reset.
4. Timeline scrub, play/pause, one-shot/loop state playback and showreel.
5. Adjustable intensity, playback speed, rendering resolution and reduced-motion mode.
6. Local capture of a PNG frame and optional WebM recording where MediaRecorder supports the format.
7. Downloadable `.glb` with four articulated roots.
8. Offline service-worker shell cache; no installed LLM or Framework connection.

State controls persist locally under `orbit3d.studio.prefs.v1`, **separately** from historic Orbit 3.x IndexedDB/localStorage data. Deployment must never erase browser databases.

## E. Visual performance acceptance

Before calling the character final, validate on real desktop GPU hardware:
- Front and 3/4 angle: no disconnected limbs or surface intersections.
- Actual articulated wave: the arm visibly raises and performs distinct motion.
- Full 360-degree camera orbit: proper 3D volume; no billboards disguised as body geometry.
- Face messages are readable and do not clip into shell from 0° to ±45° head yaw.
- No blur caused by low-resolution sprite substitutions.
- Smooth transitions with no pose resets at the midpoint of a gesture.
- Head, torso and both arms use distinct object transforms.
- Stable input handling for play/pause, scrubbing and speed changes.
- Production-level FPS, GPU, memory and responsiveness measured on the target Framework laptop.

## F. Current scope and known limitations

The released model is a **parametrically modelled, four-part 3D foundation**, not a hand-sculpted final production asset. It reproduces the approved color palette and key silhouette but does not exactly replicate every reflection/contour of the original illustration. It has no detailed hand articulation, IK, physics-based inertia, PBR environment maps, audio lip-sync, or backend event bridge. The face renderer is dynamic but uses procedural 2D symbols. The web studio intentionally has no AI model or remote connection.

The preview renderer uses custom WebGL2 to keep runtime dependencies local. Its shaders and GPU performance require physical desktop verification; mocked tests are insufficient to prove real hardware output.

### Future finishing stages
- Artist review of model proportions and materials against approved concept.
- Fine mesh refinement of head trim, smooth contiguous arms, decorative lines and face curvature.
- Rig refinements and independent head/world timing curves.
- Additional live eye shapes, gaze tracking and subtle emotional nuance.
- Desktop task event bridge with signed/validated status notifications.
- GPU profiling and accessibility testing across Windows/Chrome and the chosen desktop host.
- Iterative character approval before packaging into Framework Command.

## G. Repo-safe release and rollback

The GitHub Pages site is hosted from `tylerj-web/index.html`. Replace only files under the `orbit/` path. Never delete the root `index.html` or unrelated repository folders. One package, one checksum-verified workflow; publish after validation. For rollback, restore the last known-good `/orbit/` directory from Git history, then bump the cache version. Cached scripts may require reloading. Do not clear IndexedDB or all Safari/Chrome website data.

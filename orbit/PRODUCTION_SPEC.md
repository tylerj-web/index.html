# ORBIT — Master 3D Character Specification, Revision 2.1

## Approved identity and reference

Canonical reference: `assets/approved-orbit-reference.png` and `assets/approved-orbit-sprite-sheet.png` (user-supplied artwork). The reference establishes a large, rounded hooded head; inset black OLED face; cyan curved expressive eyes; small rounded tapered torso with central cyan circular core; two rounded pod-like arms; floating presentation. Side/rear views in the sprite sheet inform rotations, but many rear details remain interpretations, not captured measurements.

**Material correction (31 October 2026): Orbit is NOT a gold-coloured robot.** The physical shell is **very dark metallic midnight blue**, almost black in shadow, with a rich blue reflectance at the highlights. The golden/amber colour seen in the reference is **reflected warm light along glancing shell edges, bevels and arm contours**, not gold paint, bronze plating or gold armour. The cyan glowing face and chest core are emitted light.

## Construction

* Four independently animated roots: `Head`, `Torso`, `LeftArm`, `RightArm`.
* 41 child detail meshes remain parented rigidly to those roots; face screen and core are not separate articulated body pieces.
* Head: curved elliptic shell and front OLED screen, projecting reflective blue rim, inset faceplate and overhanging top hood.
* Torso: compact rounded body, shallow neck collar, sculpted V contour/catch-line, concentric cyan chest emitters.
* Arms: two rigid smooth asymmetrically bowed blue-metal pods with controllable shoulder pivots.
* Export: `assets/Orbit_Master_Sculpt_Four_Piece.glb` uses glTF PBR materials. `assets/sculpt-meshes.bin/json` is the **same** mesh geometry consumed by the local WebGL2 studio, not a second approximate model.

## Material contract

* Body: dark navy blue metallic (not yellow/gold), metalness 0.88–0.98, low roughness.
* Inset screen: near-black glass, live cyan emotional graphics and status signals.
* Environment: simulated warm gold/amber reflection on surface edges, dominant physical base remains dark blue; blue secondary fill highlights.
* Chest and eyes: luminous cyan; warning icon yellow, success icon green, error icon red.
* Live WebGL shader simulates a warm environment reflection on the moving blue-metal geometry. The GLB stores a neutral PBR base material and only modest warm colour in narrow glint features. A 3D editor must light the GLB with appropriate environment illumination to reproduce the same appearance.

## Face screen modes

Idle/friendly eyes, blink, listening, thinking/focus, curious, speaking, sleepy, scanning with sweep, yellow caution triangle, green completion tick, red error exclamation. The studio runs a generated 1024×640 live face texture in WebGL, not a swap of whole-body bitmap frames.

## Motion and rig

Sixteen states: idle, greet, wave, listen, think, speak, curious, scan, review, focus, celebrate, success, caution, error, sleep, wake. Pose animation uses four rigid articulated roots with head, torso and arms moving independently; easing and transition blending, hover movement, speed and expressiveness controls, reduced-motion support. Character remains four articulated physical pieces; any decorative child geometry is rigidly attached.

## Quality and limits

* Geometry/root integrity, facial logic, animation maths and script syntax are testable locally.
* Front, three-quarter and profile images generated from actual mesh using off-screen software render.
* **Full fidelity to hidden back/sides cannot be established from a single front hero image plus small sprite-sheet silhouettes**; side and rear details are artist interpretations.
* Actual desktop WebGL/GPU performance, physically based reflection appearance in the user's browser and visual approval of the model require direct user-side testing. Not marked verified by local static/source tests alone.

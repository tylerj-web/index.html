# Orbit Master Sculpt 2.1 — Test Report

Date: 31 October 2026

## Passed

- Four independently articulated GLB root nodes: Head, Torso, LeftArm, RightArm.
- Exported GLB: 41 attached detail meshes; 126,431 mesh vertices; all valid geometry and finite positions.
- Runtime studio mesh data matches the GLB builder and passes offset / binary size validation.
- PBR physical body materials are blue-black metallic; no base metallic gold armour materials.
- Thin warm highlights are modelled/rendered as **ambient environmental reflection**, not permanent gold-coloured body paint.
- Sixteen behaviour states: 112 sampled key poses finite, multiple transition state updates without invalid values.
- JavaScript syntax checks: app, renderer, rig and service worker.
- Front, three-quarter and profile preview images rendered using the sculpt's geometry with software/offscreen VTK.
- All app-shell asset links in the service-worker cache list exist in the release source.

## Unable to verify in this environment

- Real WebGL2 GPU rendering and frame rate: browser test environment did not expose a WebGL2 context.
- Browser navigation screenshot: local browser navigation blocked by administrator (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Exact match of hidden rear geometry to canonical art: not completely verifiable because source reference is predominantly front and low-resolution rotating sprites.
- Physical Framework Laptop 16 rendering and animation smoothness.

## Important

This is a revised, inspected and exportable 3D sculpt, **not** a claim that final artist-signoff or physical GPU performance testing has passed. The next quality gate is review of actual desktop GPU rendering, especially blue-metal reflectance and four-part motion.

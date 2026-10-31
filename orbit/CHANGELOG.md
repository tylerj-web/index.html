# Orbit 3.2 — Fluid UI | Changes

## Presentation
- Simplified Home: original HD Orbit, concise greeting, message composer and a single Workspaces control. Secondary functions remain in navigation and More.
- Replaced the stack of four overlapping baseline stylesheets with consolidated `orbit-core.css`; new design tokens and responsive rules live in `fluid.css`. The HD arm rig remains isolated in `gesture-rig.css`.
- Streamlined header, panels, typography, modal styling and mobile navigation. Secondary reports and Commander destinations remain accessible through More.
- Added high-contrast light appearance, adaptive dark/light/system themes and controlled quiet/glow/grid backgrounds.
- Implemented Appearance Studio with Minimal, Balanced, Workspace and Character presets, custom accent with readable colour adjustment, density, type scaling, corners, navigation slots, home shortcuts, robot size, companion alignment, motion intensity, optional click sounds, labels, safe JSON import/export, validation and reset.
- Appearance preferences are stored separately under `orbit.appearance.v3.2`; legacy accent/motion settings are migrated on first use where possible without modifying or removing operational data.

## Behaviour and navigation
- Kept a **single** articulated HD Orbit stage in the DOM; it relocates between Home and the header companion slot without replacing the robot or resetting its animation state.
- Preserved the 3.1.1 masked torso / independent-arm gesture rig and all existing character states.
- Added lightweight 175ms transform/opacity page-entry motion with cancellation on rapid navigation and predictable per-page scroll restoration.
- Avoided repeated DOM rebuilding for already visited workspaces unless actions explicitly refresh them; preserved dynamic Home and Settings status refresh.
- Removed smooth scrolling from the main navigation container to prevent competing scroll animations.
- Reduced duplicate metadata and heavy blur/backdrop effects in the primary navigation surfaces.

## Mobile keyboard and accessibility
- All visible editable text inputs, textareas and selects enforce a minimum 16px computed font size to avoid iOS Safari focus zoom on small text controls.
- Added `visualViewport`-aware app height/keyboard visibility management, composer-preserving responsive sizing and keyboard-mode navigation reduction.
- Kept manual browser pinch zoom enabled. Honours reduced-motion and nonessential animated state controls.
- Maintained focus-visible outlines, accessible form labels and meaningful unavailable-connection messaging.

## Data, PWA and capability boundaries
- Existing IndexedDB schema and legacy migration path unchanged. No reset, replacement or modification of user records in the release package.
- Reduced unnecessary conversation timestamp updates on no-op navigation.
- Preserved reports, inspections, revisions, notes, chat history, local model loader, backup/restore and optional browser voice support.
- Updated PWA app-shell cache to `orbit-shell-v3.2.0` with new asset list; WebLLM model cache remains separate.
- Framework Command remains unpaired and no governing policy has been loaded; no simulated live connection.

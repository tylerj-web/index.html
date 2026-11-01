# Framework Command — Interactive Website Concept

This is the public visual prototype for the future Windows 11 Framework Command desktop environment. It is not the production desktop application.

## Live entrypoint

- Repository homepage: https://tylerj-web.github.io/index.html/
- The root homepage loads the prototype from this folder.
- A second preview entrypoint is framework-command/preview.html.

## Layout

WORK:
1. Reliable Friends — Commander, Orbit, directors, knowledge, governing policy and oversight
2. Archives & Administrative Tools — ATLAS, collections and reference management

CREATE:
3. HTML Studio — existing project catalogue, OneList, Elite System Pro development/export only, ATLAS development, Orbit Mobile, miniature HTML editor
4. Promotion & Marketing — Canberra, ANZO, newsletters and campaign rooms
5. Video Editing Studio — editing interface concept, local clip playback and planned app connections
6. SEVERANCE Studio — episode production, writing, canon, animation and post-production
7. Music Studio — song library, songwriter and external app launchers
8. Real Life — Living World simulation and Orbit character creation

ENTERTAIN:
9. Entertainment Hub — games, music, media and app launchers

## Interactive features

- Nine studio pages, each with its own tabs and visual design
- Separate project-detail routes, including episodes, campaigns and code projects
- Responsive layouts
- Project creation, local draft editing and browser-storage persistence
- Project search (Ctrl/Cmd+K)
- Miniature HTML editor, sandboxed preview and HTML download
- Text drafting and text export
- External web-app launchers and configurable URLs
- Local audio/video playback (files remain in the browser)
- Data export, import and reset
- Orbit companion panel using the approved existing character artwork

## Limitations

- Not connected to Commander, local inference or live Orbit AI.
- Cannot launch Windows executables or scan private local folders as a public webpage.
- External creative app icons are URL launchers, not connected APIs.
- Timeline visuals and episode production status are design examples.
- Sample project titles do not mean private project materials were loaded.
- Browser storage can be cleared; use the data export feature.
- Elite System operational data is expressly excluded.

## Code organisation

- styles.css: styling and distinct studio design languages
- data.js: section and project registry
- screens.js: studio and project page renderers
- app.js: navigation, local state, interactions and Orbit
- preview.html: independent preview entry point

## Previous homepage backup

The original Elite System Pro homepage is preserved in:
backups/elite-system-pro-index-2026-11-01.html

## Validation

All JavaScript files parsed successfully. The homepage initialized in an isolated DOM stand-in and 71 individual studio-tab and project-detail views rendered without exceptions. This is not a substitute for real-browser visual inspection or Windows-native integration testing.


## Minimal interface update — 2026-11-02

- Framework Home remains the uncluttered Work / Create / Entertain entry screen.
- Removed the persistent sidebar from division, studio and project screens.
- Each interior page now provides a small top-left Back control and a consistent floating navigation dock.
- The dock includes Home, all three divisions, personal favourite studios and personalisation.
- Customisation is accessible anywhere. Browser-saved options include five colour themes, dock size/placement, Orbit size/visibility, animations, ambient lighting and dock favourites.
- The default Orbit illustration is smaller and is built in-browser using the approved four-part character PNGs from orbit/fluid/assets instead of displaying the background-bearing reference sheet.
- All studio-specific layout and production pages remain independent.
- Cached CSS/JS files are refreshed via the root index query version.
- No Windows-local apps, AI models or external creative APIs were connected by this visual change.

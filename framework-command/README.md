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


## Restored original Framework Home — 2026-11-02

The repository root index.html now uses the supplied FRAMEWORK_HOME_DESIGN_LAB_v1.html as its authentic starting point. The exact unmodified reference is retained in framework-command/references/FRAMEWORK_HOME_DESIGN_LAB_v1.html.

The home view preserves:
- Three large side-by-side Entertain / Create / Work sections on desktop.
- Fixed translucent top status bar (CPU/memory/storage figures are labelled as demo, not device measurements).
- The original Design Lab appearance editor: dark/light, accent colours, four wallpaper modes, glass opacity, corner radius, dock icon size, motion control, Orbit visibility, and design JSON import/export.
- Favourites dock, quick links and smaller floating black/gold Orbit artwork without a pink image background.

The home section buttons hand off to framework-command/preview.html#/division/{work,create,entertain}. All nine separate studio workspaces remain in the modular preview app. That preview's Home controls return to ../index.html.

The user's Framework_Command_Interactive_Chart.html is installed at framework-command/org-chart.html, linked and embedded in Reliable Friends → Organisation. The original prior site home remains archived at backups/framework-command-home-pre-design-lab-2026-11-02.html.

Public GitHub Pages delivery and Windows-native features remain separate from the successful GitHub commit verification.

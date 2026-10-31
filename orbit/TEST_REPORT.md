# Orbit 3.2 — Testing and limitations

## Tests performed and passed

- **Source validation:** `node --check` of the application, appearance, navigation, storage, animation, AI loader and service worker modules. Manifest JSON parsed. Referenced runtime files and image assets present.
- **Chromium visual renders:** the actual HTML, CSS and JavaScript were loaded into a Chromium document with original artwork embedded as a data URI, because navigation to a local test server was prohibited by the sandbox. Screen sizes: 375×667, 390×844, 430×932, 820×1180, 1180×820 and 1440×900.
- **Page initialization:** no captured JavaScript page errors at the tested sizes.
- **Responsive layout:** no horizontal document overflow at the tested widths; four mobile navigation destinations are reachable, including the More menu; all six workspaces are reachable.
- **Input zoom mitigation:** the chat input and report/inspection/note fields computed at **16px or larger** at the mobile test viewports.
- **Appearance Studio:** all four presets, dark/light switching, accent switching, navigation slot reordering, import validation, clamping of out-of-range settings, and live re-rendering passed browser tests.
- **Workflows:** created/saved an inspection, created/edited a report and verified a preserved previous revision, created a reference note, sent a message without a loaded local model and verified that Orbit responded with an explicit model-unavailable message instead of a fabricated AI response.
- **Robot rig:** one HD character element persists across page navigation; tapping Orbit triggers the existing articulated `orbit-real-wave` animation, not low-resolution sprite substitution.
- **Release:** ZIP integrity, SHA-256 checksum and asset path checks, including service-worker app-shell file list.

## Not fully verified in this environment

- **iPhone/iPad Safari keyboard zoom:** 16px CSS correction and viewport handler tested in Chromium responsive simulation only. A physical iOS keyboard and Safari focus-zoom behaviour remain untested.
- **Real 60fps on device:** no physical-device frame-time/battery/thermal profiling was performed.
- **IndexedDB restart persistence and service-worker offline upgrade:** the local sandbox blocked normal browser navigation; the in-memory test page has an opaque origin and cannot establish reliable persistent IndexedDB or service-worker context. Existing store schema and app-shell caching code were preserved/updated, but these need origin-backed or device testing.
- **Native download UX:** the page harness cannot reliably exercise browser file-download UI; export code was retained but actual appearance/backup download clicks require an origin-backed browser test.
- **WebLLM/WebGPU inference and microphone offline capability:** requires a compatible iPhone/iPad and downloaded model. Neither was tested here.
- **Authenticated Framework gateway / approved policy sync:** deliberately unavailable; implementation requires the laptop service and authorised policy source data.
- **Screen reader/focus management:** basic semantic inspection and visual reviews only; VoiceOver and full WCAG audit require separate testing.

## Recommended post-release iPhone acceptance checks

1. Refresh Orbit in Safari and reopen the installed PWA. Verify old conversations and reports remain present and create a backup.
2. Tap all chat, report, search, note, inspection and Appearance Studio editable fields. Confirm **no unexpected auto zoom**, that the keyboard does not cover the active field and that manual pinch zoom remains possible.
3. Tap Orbit; confirm his **actual arm waves** smoothly and stays sharp. Switch pages while he is animating.
4. Test Minimal, Balanced, Workspace, Character and dark/light modes; close and reopen Orbit to verify appearance persistence.
5. Edit an existing report, create a note, export/import a controlled appearance preset, and export a records backup.
6. Disconnect from the internet, reopen the PWA and verify saved records and the app shell. Separately test local AI only if its model is installed and has previously loaded successfully.

# Rollback and data preservation

This version **replaces the `/orbit/` interface only**. It does not erase, migrate, read or write the older Orbit app's records, chats or reports. Old Orbit's browser IndexedDB and localStorage records remain in the same origin but are unused by the animation lab.

To roll back:
1. Identify the repository commit immediately before the 3D Studio publication.
2. Restore the `/orbit/` directory to that tree. Leave the root website and other folders untouched.
3. Commit the rollback and allow GitHub Pages to deploy.
4. Bump the service-worker cache version in the restored page if stale cache contents prevent it from updating.
5. Reload the app in Safari or Chrome. Do not clear site data or the browser's IndexedDB unless you already exported your important records and intentionally accept deletion.

The published directory must contain `index.html`, `.mjs` runtime files, `styles.css`, `manifest.webmanifest`, `service-worker.js` and the GLB and SVG under `assets/`.

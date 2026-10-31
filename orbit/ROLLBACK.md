# Orbit 3.2 — Rollback and recovery

1. **Back up your records first.** In Orbit Settings → Privacy & local data → Backup, export `Orbit_Backup_v3_<date>.json`. Store it privately because exports are not encrypted.
2. To roll back the UI, restore the Orbit `/orbit/` directory from the previous known-good GitHub commit or the `ORBIT_Mobile_3.1.1_HD_True_Wave.zip` release. Do not clear device storage, IndexedDB or localStorage.
3. Publish the corresponding old application files as a consistent set, including that release's `service-worker.js`. The versioned cache will refresh on the next online load.
4. Open the site in Safari and refresh it online; close and reopen the Home Screen app. If an old cached shell persists, allow the service-worker update to finish and reopen again. Do **not** use "Clear local data" as a cache-repair mechanism; that deletes records.
5. Appearance settings are separate from documents and conversations. Older Orbit versions ignore `orbit.appearance.v3.2`; they do not need to delete it.
6. If records are missing after any migration, stop editing and restore the exported data using Orbit's existing Restore command. Backups replace current records, so export current data before restoring.

## Release boundaries

The Orbit source is publicly hosted. Never commit individual user records, approved policy texts, credentials or private backups to this repository. Local browser records are not included in the release ZIP or automatically uploaded to GitHub. The app's local records are not end-to-end encrypted.

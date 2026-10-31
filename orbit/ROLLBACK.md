# Orbit animation testbed rollback

The GitHub repository can be reverted to the preceding commit through GitHub's normal revert process (without deleting browser user data). A previous studio release archive is available as a separate release package; keep a local copy before replacing the testbed.

No scripts in this release erase localStorage, IndexedDB, or unrelated repository content. The service worker deletes only older `orbit-3d-` app-shell caches as it activates. Do not manually clear all browser site data; that can destroy records from prior Orbit prototypes.

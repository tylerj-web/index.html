# Rollback — animation studio to previous Orbit 3.2

The animation studio intentionally replaces only `/orbit/` in the `tylerj-web/index.html` GitHub Pages repository, leaving the rest of the website untouched.

To restore the earlier assistant interface, restore the `/orbit/` files from the Git commit immediately preceding the installation of the animation studio, or redeploy the previously archived `ORBIT_Mobile_3.2_Fluid_UI_RELEASE.zip` to `/orbit/`.

After restoring, reload the page so the prior service worker takes over. The animation studio's independent cache may be cleared safely if needed. **Do not clear all Safari website data**: earlier Orbit conversations and reports may still be in IndexedDB or localStorage. This studio does not erase them, and a domain-wide storage reset would be a separate destructive action.

When authoring a new animation release, increment the `orbit-animation-studio-...` service-worker cache version and update `index.html` resource version query strings.

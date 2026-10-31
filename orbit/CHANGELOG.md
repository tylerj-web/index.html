# 3D Studio — Initial Release

- Replaced old flat/sprite-based character stage with a custom local WebGL2 3D renderer.
- Created a reproducible `.glb` model with 4 articulated root pieces: Head, Torso, LeftArm, RightArm.
- Built a live curved face screen with emotional eyes and dedicated scanning, caution, success and error symbols.
- Implemented 16 behaviour states with time-based easing and independent head/arm/torso poses.
- Added showreel, play/pause, timeline scrub, camera orbit/zoom, motion and quality preferences.
- Added PNG capture, WebM capture where available, GLB download and performance readout.
- Added reduced-motion support, visibility pause and a device-local preferences store.
- Isolated all files to `/orbit/`; no Framework backend or remote data access is present.
- Included production specification, source generator, reproducible tests and rollback instructions.

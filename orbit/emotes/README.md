# Orbit Emote Atlas v1.0

28 distinct emote/behaviour sheets, each a 12-frame transparent PNG atlas arranged left-to-right. 336 total frames.

- Cell: 352x448 pixels (RGBA transparent)
- Sheet: 4224x448 pixels (12 columns x 1 row)
- Per-state playback rates: manifest.json
- Extra magenta-background preview JPEGs in previews/
- Open index.html to preview all animations without installation.

## Source fidelity
The character comes from user-provided original Orbit drawings and animation strips plus image-generation reference art. Each image was cropped by its actual silhouette, chroma-keyed and aligned. Body poses are taken from the supplied art, not a newly rigged 3D model. A single drawn emote may repeat through gentle 2-10 pixel vertical motion, and status emotes use soft pulses. Therefore, do not treat these sheets as 12 distinct hand-drawn frame poses or claim that they are identical to one master image pixel-for-pixel.

## Usage
For each state, draw frame i from its PNG atlas using `drawImage(image, i * 352, 0, 352, 448, x, y, w, h)`. Use `manifest.json` to obtain FPS, labels and filenames. Frames are stable-sized to prevent visible scale jumps.

## Future artist pass
For a final production assistant, recommend replacing repeated poses with uniquely authored in-between drawings, adding measured interpolation and cleaning dark-edge chroma contamination under studio lighting.

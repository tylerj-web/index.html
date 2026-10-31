# Orbit 5× Transition Map

Motion graph edge clips are one-shot, 24 frames at 24 fps. State names correspond to the keys in `manifest.json`.

| Outgoing state | Incoming state |
|---|---|
| idle | listening |
| listening | thinking |
| thinking | speaking |
| speaking | idle |
| idle | wave |
| wave | idle |
| idle | celebrate |
| celebrate | idle |
| idle | caution |
| caution | idle |
| idle | error |
| error | idle |
| idle | sleepy |
| sleepy | wake |
| wake | idle |
| idle | reviewing |
| reviewing | complete |
| reviewing | error |
| scanning | complete |
| scanning | caution |
| scanning | error |
| sad | idle |
| slumped | idle |
| curious | focused |
| focused | complete |
| idle | scanning |
| complete | idle |
| caution | error |
| idle | sad |
| idle | slumped |
| idle | hover |

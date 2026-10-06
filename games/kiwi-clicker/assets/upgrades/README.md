# Kiwi Clicker upgrade artwork

Packages: `clockwork/`, `flock/`, `factory/`, `snacks/`, `worms/`, `gold/`, and `double/`.

Use **registered PNGs** for direct compositing. They have identical canonical canvases within each package, preserving empty space and alignment. Raw generator source images are retained separately; some generated extractions shifted or expanded subjects. Their alignment transforms are documented, but do not apply those transforms again to registered PNGs. Native SVG assembly files are also included. Registered exports render those SVG assemblies without changing the approved source kiwi or button design.

- Clockwork: 1800 × 1100. Fixed `body-registered.png`; moving `arm-registered.png` and `key-registered.png`. Shoulder pivot (937,293), key pivot (335,398), arm travel 0–5.5° clockwise. The whole arm rotates as one assembly initially; its elbow can be articulated using a mask around the source joint. Reuse existing button layers at documented placement.
- Flock: 1800 × 500. `flock-idle.png` contains exactly three approved kiwis in a single row, one approved button per bird. For animation create three instances of the existing kiwi mesh and button mechanism at the placements in alignment.json, delayed 0/220/440 ms. Original kiwi pixels are reused, not regenerated.
- Factory: 1536 × 1024. `frame.png` is stationary. Three `press-N-registered.png` files are individually movable piston/pad layers with 48/50/51 px travel. Reuse existing button parts with 6 px travel after contact. Draw presses behind frame so the fixed sockets occlude extended shafts. Conveyor and frame remain fixed; moving presses clearly operate the buttons.
- Snacks: 1536 × 1024. `base.png` is fixed tin/lid/soil. `worms-registered.png` is a separate worm layer, with at most ±2 px wiggle. The open lid is part of the fixed assembly.
- Worm farm: 1536 × 1024. `base-registered.png` is fixed tray/soil/plants. `worms-registered.png` is the separate worm layer, with at most ±2 px wiggle.
- Gold sleeve: 1536 × 1024. `sleeve-aligned.png` overlays the original bill, leaving face and bill tip intact. Apply the same kiwi mesh deformation to sleeve and bird; compose the sleeve into the source texture before drawing or draw it using identical geometry/uniforms. `idle.png` is a complete fallback.
- Double: 1800 × 1100. `linkage-registered.png` is one moving bar with two pads, over two spaced large buttons. Beak contact stays (1430,710); move bar and both caps down together 0–20 px, bases fixed. Button contact centers (1242.8,865.8)/(1618.8,865.8), scale .32. Optional 10% horizontal button enlargement keeps a gap while preserving those centers.

Every package has alignment.json with layer order, contacts, pivots, placement and travel details. All PNGs are RGBA with transparent corners and no baked text or ground shadows. Full idle fallbacks and factory/automaton/double pressed previews are supplied. Final artwork was inspected in the browser on a green background.

Preview: http://127.0.0.1:4173/play/kiwi-clicker/assets/upgrades/preview.html

## Generation and reference notes

Built-in ImageGen created the new mechanical/soil/sleeve/linkage art using approved diffuse kiwi and button references. Prompt set: neutral diffuse tactile soft 3D, true transparency, no text/ground shadow; clockwork helper with distinct winding key and arm operating a button; coherent three-piston conveyor workstation; open tin with five worms; planted soil tray with four worms; thin fitted gold sleeve preserving bill silhouette; one linked bar with two pads. Follow-up prompts extracted fixed/moving parts. Registration wrappers were rendered to PNG for direct use. The flock is a deterministic composition of the approved existing kiwi/button PNGs.

The button package in ../button/ was relit to match the approved diffuse kiwi. Prior button layers are preserved as -v1.png. Gameplay, saves, and main animation files were not edited here; integration belongs to the web project chat.

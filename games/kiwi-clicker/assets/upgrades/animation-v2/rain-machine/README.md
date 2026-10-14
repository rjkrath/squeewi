# Button rain machine

Registered transparent layers for the replacement conga upgrade. No renderer or game files changed. All scene layers are **1536 × 1024**, in the same registration, except the compact **64 × 64** BB sprite.

Use `manifest.json` for geometry and the 4 second timing suggestion. `assembled-idle.png`, `assembled-tug.png`, and `assembled-impact.png` are assembly/contact checks, not an animation sheet.

- `background.png`: complete fixed hopper, BB contents, supports and three open spouts. Alternatively use `fixed-box.png`, `fixed-supports.png`, and `fixed-spouts.png` together. Do not draw both approaches.
- `gate-0.png` through `gate-2.png`: independent closed release gates. Translate each by `[46,0]` to open. The `-open` images are registered reference states.
- `kiwi-body.png`: approved torso and planted legs.
- `kiwi-head-neck.png`: connected head, bill and continuous neck with throat feather overlap. Rotate about `[361,633]` by 0–5 degrees for the tug; `kiwi-head-neck-tug.png` is the exact 5 degree reference state. No morphing or nonuniform scaling.
- `cord-idle.png`, `cord-tug.png`: exact endpoint registration states. For intermediate frames draw a cord from fixed `[673,260]` through fixed elbow `[552.76,260]` to the transformed bill-tip grip. The manifest records color, ring radius, path and stroke width. Do not move the anchor with the head.
- `button-N-housing.png`, `button-N-housing-front.png`, `button-N-cap-up.png`, `button-N-cap-down.png`: identical approved common buttons registered under the three outlets. Draw housing, cap, then front collar. Continuous cap travel is 22.95 pixels downward. The up/down states share exactly the same housing, width and registration.
- `bb.png`: isolated silver sphere, center `[32,32]`, radius 24. Use scale 7/12 for a scene radius of 14. Or use full-canvas `bb-registered.png`, centered at `[768,512]`, radius 14. Use one sprite for all three falling/rolling BBs.

Each outlet is aligned directly above its button. Impact BB center is 14 pixels above the current cap contact point. BBs move toward the foreground, gradually enlarge to at most 1.55×, and continue beyond y=1047 before reset; suggested end is y=1100. Keep opacity 1 throughout.

The kiwi and buttons are reused from the approved `common` layers. Machine and BB source art were created with built-in ImageGen. `build.cjs` performs native SVG registration/export, uses the established alpha-edge treatment for the generated machine, and writes PNG/SVG pairs. Source bitmaps remain unchanged. The assembly states are built from the exact delivered layer geometry.

## Generation prompts

Machine: Transparent soft naturalistic 3D game asset; one wide clear-front rectangular hopper packed with small round silver steel BBs, on two slender brushed-metal supports; exactly three equally spaced short downward open spouts. Frontal camera with slight top/right view; sage-grey trim. Uniform diffuse ambient light, no cast/ground shadow. Empty fall area. No kiwi, buttons, cord, winch, pulleys, hanging weights, floor or text.

BB: One isolated round silver steel BB matching the machine's BB material. Broad soft ambient reflections, no sharp spotlight/star. Transparent background, no halo, floor, cast shadow, seams, holes, labels or additional objects.

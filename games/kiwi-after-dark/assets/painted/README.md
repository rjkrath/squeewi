# Simple painted art — first pass

Generated with the built-in image tool, using `outputs/art-previews/simple-painted.png` as the style reference.

- `lawn.png`: background only; simple gouache, broad painted shapes, muted teal open grass, navy sky, three tree silhouettes, wooden fence, cream crescent moon. No interactive objects baked into the scene.
- `lawn-sprites.png`: transparent atlas, 4 columns × 3 rows. Rows: burrow/mushrooms/stone/hole; stick/leaves/snail/sprinkler; soil/ball/fence/kiwi. Same simple painted palette, isolated forms, no outlines, no human abilities.

The renderer reads cell alpha bounds once and places the sprites at the existing game coordinates. Background height is fitted in two bands to keep all targets inside the lawn. Existing interaction logic, save data, and routes are retained. Walking and probing animate the bird with a small bob, tilt, and grounded lunge. This initial pass covers the lawn and kiwi; the other clearings retain their existing scenery.


## Feet and scenery update

`lawn-sprites-v2.png` is the active 4 × 4 atlas. The first eleven objects retain their identities with clearer ground silhouettes. Cell 12 is the kiwi body without feet. The last row contains a low bush, broad-leaf bush, fern, and one separate bird foot. The renderer duplicates the foot and animates opposite steps from travel distance, with a planted phase and lifted return phase. The body has a smaller walking bob.

Generation: built-in image tool using the existing atlas and approved simple painted preview as references. Prompt: simple opaque gouache, clean isolated transparent sprites in a 4 × 4 grid, ground-level props, nearly horizontal forked stick seen from above, leaf scatter, squat mushrooms, body separated from feet, three sparse garden plants, one natural three-toed foot. No human abilities, clothing, tool use, or detailed ornamental foliage.

The ground stick and recovered stick drops use the same flat painted image; bushes sit at the clearing edges. Validation includes the existing gameplay flow and a renderer check that both feet take turns lifting and settle after stopping.


## Ground contact correction

Atlas bounds use connected opaque regions to exclude isolated alpha specks beneath props. Each object meets a compact contact shadow, and resting finds do not bob. The hose enters from beyond the right canvas edge; its kink lies in the ground plane. The freestanding gate and its interaction target have been removed.


## Snail leaf and rubber hose

`sleeping-snail-leaf.png`: standalone transparent sprite made with the built-in image tool using the active atlas as the reference. Final prompt: preserve the small sage-green sleeping snail, beige spiral shell and simple gouache style; add one curled ochre fallen leaf draped directly across the shell like a blanket, keeping its sleepy face and lower spiral visible; transparent background, no scenery, text or extra objects. Alpha contact bounds keep it planted on the lawn.

The hose is one continuously drawn rubber tube, with a contact shadow, dark edge, subtle highlight and tight flattened fold. The crease opens smoothly after a firm beak probe and resets on the next night. It remains connected beyond the right screen edge.


## Sleeping expression correction

`sleeping-snail-leaf-v2.png` is the active snail sprite. Edited with the built-in image tool using the leaf-covered snail as the reference. Prompt: erase the black U-shaped smile and replace it with a small thin closed eyelid with a downward lash; no mouth or smile; preserve the leaf blanket, beige shell, sage-green body and painted texture; relaxed feelers, transparent background, no text.


## Painted sprinkler water

Animated water uses irregular layered canvas brush marks in muted sage-blue and moonlit mint, with uneven pigment patches. Three broken arcs flow from the top of the sprinkler, spreading into drops and small ground splashes. Spray and feather splashes share the same painterly marks. Rotation, range, wet soil and kiwi splash consequences retain the existing simulation. No straight white beam or vector outline remains.


## Stick perspective and contact repair

`ground-stick.png` is the active resting and dropped stick image. Built-in image tool prompt: one slender forked twig lying fully flat in the grass plane, nearly horizontal, seen from above at a gentle three-quarter angle; thin muted-brown gouache bark, no cylindrical front-facing cut end; narrow dark-green contact shading directly following the underside of the entire twig and fork, two small grass tips overlapping its edge; transparent background, no detached oval shadow, hovering, glow, scenery or text. The ground renderer preserves this flat silhouette and draws no separate oval beneath the stick. The held stick retains its existing beak pose.


## Foreground exploration sprites

`lawn-exploration.png`: transparent 3-column, 2-row atlas made with the built-in image tool, matching the active gouache atlas and grounded twig references. Prompt: six separate grounded sprites in muted nighttime browns, sage and cream; closed seedpod, split pod with seeds, low dandelion puff, matching bare dandelion, cupped fallen leaf with dew, and a sideways discarded cream paper cup with coral band. Broad painted shapes, subtle pigment, clear cell margins, attached contact edges, no scene, text, glow or detached shadows. The active renderer crops connected alpha bounds and animates the pod's beetle, drifting seeds, dew drops and cup roll separately.


## Orchard hedgehog

`orchard-hedgehog.png` is a transparent two-cell atlas: a sleeping hedgehog on low leaves and the same hedgehog with its nose tucked into a curl. Generated with the built-in image tool, using `lawn-sprites-v2.png` as the gouache style reference. Exact prompt: `orchard-hedgehog-prompt.txt`. Cropped contact bounds keep it on the orchard floor. A poke switches to the tucked pose for 1.2 seconds; quiet breathing and sleep then resume.

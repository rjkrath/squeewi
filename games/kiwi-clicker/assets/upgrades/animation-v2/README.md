# Revised animation asset pack

Use `manifest.json`, `renderer.js`, and the per-scene PNG layers. The seven earlier `animation/pose-sheet.png` drafts are superseded. Their four-frame swaps should not be used.

Open `preview.html` through the local server. It shows actual continuous loops at 230px card height, with pause, individual loop scrubbing, contact guides, green/dark/checker backgrounds. `preview.png` is a saved card-size inspection view.

The salad bar is static by the user's latest instruction. Its approved no-kiwi image remains at `../salad-bar/assembled-idle.png`; no worm or feeding animation is needed.

## Integration

```js
import {createRenderer, commands} from './animation-v2/renderer.js';
const manifest = await (await fetch('./animation-v2/manifest.json')).json();
const render = await createRenderer(manifest);
render(canvas, 'seesaw', elapsedMilliseconds);
```

`commands(scene, elapsedMilliseconds, manifest)` returns ordered `{file, matrix, alpha}` draw operations. Each matrix is a standard Canvas 2D affine transform in the scene's exact canvas coordinates. Clear the scene canvas, apply one uniform contain transform for the whole card, then draw these operations in order. Do not trim individual layer files or scale head/body separately. Native SVG source files beside each PNG record the registration and overlap masks.

Shared buttons have stationary `common/housing.png` and `housing-front.png`, moving `cap-up.png`, and a 135-source-pixel vertical travel. `cap-down.png` and `button-up/down.png` are explicit inspection states. The renderer draws housing, cap, front collar so the plunger retracts behind the housing correctly. Scene travel is `135 * buttonScale`.

## Motion choices and practical limits

- Slide: one fixed seated kiwi follows all four contact points, with only the contacted cap depressed. Exit and fade reset conceal re-entry. Feet are extended in a stable seated pose; there is no new anatomical pose generation during travel.
- Trampoline: fixed-proportion kiwi translates vertically; cap travel and mechanical spring compression share one displacement. Only coils compress; no kiwi squashing.
- Seesaw: central support stays fixed. The board, identical mounted housings, caps and birds rock together ±8 degrees; left and right depress alternately, with level recovery. Birds translate with their cap, without changing proportions.
- Staircase: a fixed-proportion kiwi hops through all five steps, plants on each cap and releases the previous cap. This is a simplified hop rather than a multi-pose gait. Exiting the canvas and a fade hide reset.
- Carousel: five identical buttons orbit the perspective ellipse, sort by depth, index to a stop under the bill, then press and release. The platform is rotationally symmetric, so its stationary texture is deliberately stable while the button positions show rotation. The kiwi body and feet stay fixed; only its overlapping head/neck layer rotates up to 11.5 degrees.
- Conga: a staggered dance in place, not a traveling procession. Reuses the latest slender-neck cutout. Rigid front-leg swings and small rocks around planted rear feet give varied steps. Lead bill lifts by a clear gap before rotating down with cap travel. Small-angle overlapping feather joints preserve texture; they are not a full skeletal gait rig.

These native assemblies reuse approved source identities and furniture style. Extracted actors and rebuilt mechanical connections mean some compositions differ from the old assembled scenes. Alpha transfer is baked once into SVG layer exports to suppress low-opacity matte residue; no changing colour/backdrop pixels are regenerated during loops. Check detailed feather joints before using at sizes much larger than 230px cards.

`states/index.json` in each scene lists stable full-canvas inspection PNGs exported from this renderer. These are contact/recovery examples, not a sparse playback sequence. Continuous movement, timing, pivots, tracks and contacts are in the renderer and manifest.

No gameplay or layout files are changed by this pack. Build the local project to refresh preview files served from `dist`.

# Connected conga revision

The old cut masks left angular holes under the neck and at the front thigh. Independent rotations enlarged them, while 460px spacing hid followers' bill tips inside the next body. Rear pivots at y570 were above the actual soles and caused foot motion at the floor.

Revision 3 uses three full-canvas connected poses: `pose-step-right.png`, `pose-stand.png`, `pose-step-left.png`. Each uses exactly the same `torso-connected.png`, which includes the whole slender neck, head and bill. Only paired-leg art changes. Hip plugs draw beneath the feather belly. No moving head seam, cut feather strips or independent flapping legs. `legs-*.png` and the native assembly SVGs are supplied for inspection and future refinement, but playback draws whole poses.

All files are 2172×724 with the bird at the same leftmost registration. The displayed whole-pose scale is uniformly 0.88 throughout the loop. Origins are x=0,520,1040,1560 and y=45.52. Extra spacing keeps bills clear of the bird ahead. No wings, fade, alpha changes, horizontal travel or offscreen resets.

Follower sequence: right raised (450ms), both planted (150ms), left raised (450ms), both planted (150ms). Repeat every 1200ms; followers lag by 200ms. During raised-foot states only, the whole bird rocks up to 1.2 degrees around its planted toe. Both-planted poses have zero rock. The torso/neck texture never swaps or deforms. This is a stylized stepping dance in place, not a continuous skeletal walking rig; discrete foot-pose changes remain visible when enlarged.

Source toe pivots: step-right [180,596], stand [190,596], step-left [380,596]. Uniform registration maps y596 to the scene floor y570. The active toe stays fixed through a pose's rock, avoiding sliding. Between poses there is a small foot placement change consistent with the next stance.

The lead keeps the right-raised pose and leans as a complete connected bird around [180,596]. Loop duration 3000ms: lifted through phase .30; approaches cap through .43; depresses and releases during .43–.69; lifts clearly away during .69–.85; settles raised. The housing remains fixed at button contact centre [2045,355.17], scale .31. Vertical cap travel is 135×.31=41.85px. Lead lean runs from −4 degrees to about +8.055 degrees, following the cap travel, with no head/neck deformation. Its bill contacts the right side of the cap face, not the housing.

Use the updated root `manifest.json` and conga branch of `renderer.js`. They preserve the other scenes' current changes. `build-conga.cjs` recreates native registered assets; `build-layers.cjs` calls it for subsequent pack exports. Old split body/head/front-leg assets remain archived but are excluded from the manifest. Inspection states are regenerated into `states/`.

Review `preview.html` in this folder for a focused animated 230px-card view, scrub controls and green/dark/checker backgrounds. No gameplay/layout changes are required other than consuming the updated shared renderer/manifest as already integrated by Clicker.

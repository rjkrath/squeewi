# Approved kiwi animation assets

All three PNGs are 1536 × 1024 RGBA with genuine transparent backgrounds. Draw them at the same origin and scale, never center or crop layers separately.

- `kiwi-body-feet.png`: stationary body, both legs and feet, reconstructed shoulder feathers under neck.
- `kiwi-head-neck-beak.png`: moving head, complete bill, whiskers, and feathered neck overlap. Draw above the body.
- `kiwi-idle.png`: complete kiwi for fallback and reduced motion.

Alignment: neck pivot (900, 450); bill tip approximately (1464, 624). Positive rotation dips the bill clockwise in screen coordinates. At 20 degrees the tip is approximately (1370, 806). Button positioning and contact timing belong to integration; this preview checks layer overlap only. Feet stay entirely in the stationary layer. Shared scale/placement checked visually at rest and 20 degrees. Transparent backgrounds checked in RGBA and on pale green. No ground shadow.

Preview: http://127.0.0.1:4173/play/kiwi-clicker/assets/preview.html

Generation: built-in ImageGen, editing `kiwi-approved-diffuse.png`.
Prompt set: preserve approved character, fine feather detail, lean small face, colors, diffuse lighting, pose and exact full 1536 × 1024 canvas placement. For idle, remove only ivory background and retain fine edges. For body, remove head/bill/upper neck and reconstruct matching shoulder feathers under the future overlap. For head, remove body/legs/feet, retain full bill and whiskers, and extend feathered lower neck around the (900,450) pivot. Request true transparent alpha for every output; no cropping, centering, rescaling, ground shadows, added fluff, or redesign.

Generated layers may contain minor feather-texture differences from the approved flattened image. The original approved image is retained alongside them.

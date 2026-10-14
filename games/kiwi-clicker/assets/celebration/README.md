# Big Peck celebration balloons

Five transparent sprites: coral, warm gold, leafy green, muted teal and lavender. Each includes the softly shaded textured latex body, tied knot and gently curved ivory string. No scenery, lettering, cast shadow or animation frames.

Use `balloon-COLOR.webp` (lossless, smaller) or `balloon-COLOR.png`. All are 256×512 RGBA with the same registration and uniform scale. At 48–60px image width, the full sprite is 96–120px high. The visible balloon body is roughly 39–49px wide; transparent margins protect its silhouette and string during rotation.

Animate the whole sprite with gentle upward movement and drift. Do not recreate or separately animate the string. A suitable transform origin is `[128,144]` in sprite pixels (50% horizontally, 28.125% vertically), within the balloon body. `manifest.json` lists dimensions, individual string-inclusive alpha bounds and game-relative file paths. Bounds are `[left, top, right, bottom]`, with right/bottom exclusive and alpha>0.

`contact-sheet.png` shows large artwork and the intended 56px display width against light green and dark backgrounds. Source PNGs are kept in `sources/`. Native SVG registration/export is reproducible with `export.cjs`; it applies the project's established alpha-edge treatment once and preserves the original source bitmaps. No game, celebration, style or HTML files were edited.

## Built-in ImageGen prompts

Base coral: Single transparent portrait balloon sprite, matching the naturalistic detailed soft illustration and tactile texture of `../kiwi-idle.png` and `../button/button-idle.png`. Coral inflated oval latex body with a full round top, gently tapered neck, tied knot and thin gently S-curved warm ivory string. Fine matte latex grain, broad diffuse ambient shading and restrained satin sheen. No hard spotlight, giant icon highlight, halo, cast shadow, scenery, text, patterns or additional objects. Fully contained edges and transparent margins.

Four edits: Change only body and latex knot color to warm gold (honey/marigold latex, not metallic), leafy sage green, muted teal, or lavender. Preserve silhouette, proportions, pose, canvas, knot, complete ivory string shape/length, texture, lighting and transparency. One built-in ImageGen call per color variant, using the coral output as edit target.

## Validation

Inspected the contact sheet at 56px sprite width on light/dark backgrounds. Verified 256×512 dimensions, transparent margins, full contained alpha bounds, PNG/WebP registration, and connected visible strings. This asset pack is ready for Clicker to integrate.

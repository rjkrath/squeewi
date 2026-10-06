# Kiwi button asset package

Transparent 1536 × 1024 RGBA PNGs with identical alignment. No ground shadow or baked background. Matte coral cap and muted grey-green housing; diffuse material shading.

Draw at scene placement translate(1184.24,630) scale(0.32), for the existing 1800 × 1100 kiwi scene. Broad top contact landmark (768,250) maps to (1430,710). Press travel is 20 scene pixels = 62.5 asset pixels. Maximum recommended travel is 20 scene pixels.

Draw order:
1. Stationary `button-housing.png`.
2. Moving `button-cap-plunger.png`, translate down 0–62.5 source pixels.
3. Stationary foreground collar: draw `button-housing.png` again, clipped to source rectangle (0,580,1536,444). This occludes the lower plunger so it slides inside the housing, not across its front. See preview SVG clipPath. `button-front-collar.svg` provides the same mask as an SVG wrapper; inline its contents for browsers that restrict external images inside SVG images.
4. Kiwi above the button for visible beak contact.

`button-idle.png` is the complete idle fallback. No separate pressed cap needed: the rigid cap translates vertically without changing highlights. The socket is dark and filled behind the cap, preventing transparent gaps. Do not crop or center individual layers. No generated text; retain accessible UI label.

Preview: http://127.0.0.1:4173/play/kiwi-clicker/assets/button/preview.html
The preview uses the existing kiwi mesh module, with stationary poses at amount 0 and 1; it does not modify game logic or animation files. Contact placement should be tuned against the final game rendering if its scale changes.

Generated using built-in ImageGen. Prompt set: diffuse-lit matte coral broad cylindrical cap on muted neutral raised cylindrical housing, orthographic elevated camera, blank transparent 1536 × 1024 canvas, no text/shadow. Edit complete image into stationary housing with reconstructed full collar/dark socket, and aligned moving cap with continuous concealed plunger. Preserve exact original placement/materials across edits.

Lighting revision: all button layers relit with the approved diffuse kiwi as lighting reference. Prior assets retained as -v1.png.

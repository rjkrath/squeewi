# Kiwi Archaeology Society — Desert Division

A playable browser game about a kiwi archaeologist, an extremely capable baby kiwi named Bean, and a cart with no sensible load limit.

## Play

Open `index.html` in a modern browser. No installation or build is required. Alternatively serve the folder with a static web server, such as `python3 -m http.server 4186`, and visit http://localhost:4186.

- Walk with Left / Right or A / D; hold the on-screen arrow buttons on touch devices. Click the sand to choose a destination.
- Click a sand mound, crack, or patch of stones to walk over and poke it. Poke twice to uncover a find.
- Space, P, or the Poke button probes in front of Pip. You can make empty holes too.
- S or Sniff highlights promising mounds.
- Bean automatically fetches each discovered object, carries it to the cart, and tosses it onto the pile.
- A chicken cache contains multiple separate rubber chickens. The two caches contain nine chickens between them.
- Tall stacks wobble and shed objects while the cart is travelling. Bean retrieves the spills. Objects are never permanently lost.
- Collect all 34 discoveries (50 individual cargo objects) across the desert, pyramid chambers, oasis, and Great Tomb. You can continue walking after completion.
- Open items in the manifest to read their illustrated field notes.
- Sound is optional and starts muted. Escape closes dialogs.

Progress automatically saves in this browser. The desert uses a separate save from the original garden MVP. A new-expedition button resets the desert after confirmation.

## Contents

`index.html`, `style.css`, and `game.js` are the complete application. All illustrations and sound effects are created locally. Local fallback fonts work offline and comply with the arcade’s security headers. No API keys, accounts, frameworks, or build tools are needed.

## Tested

An isolated simulation exercises real game logic for walking to a mound, two-poke excavation, Bean's pickup/carry/toss sequence, multi-object caches, unstable cargo, spill recovery without duplication or loss, empty holes, the entire 16-find journey and ending, save restoration, world boundaries, and reset. Browser checks cover the rendered scene and actual excavation / pickup interactions.

## Named areas and warehouses

Pip runs to exits. E selects the nearest route; route buttons choose the pyramid, oasis, desert, or deeper tomb. Three desert entrances lead into the shared pyramid chambers, whose far doorway leads to the Great Tomb. The oasis lies beyond the eastern desert.

Bean retrieves and individually ties every piece before a crossing. Cargo is then stored at the warehouse and each arrival starts with an empty cart. Discoveries and excavation progress persist. The main manifest shows the current area, with expandable collections for the other areas. Existing mixed-area saves move earlier areas’ cargo safely into warehouse storage.

## Bean’s packing routine

Bean loads heavier objects low. When Pip and the cart stop, Bean climbs to each loose item and ties its own visible rope. Moving interrupts the current knot; finished knots remain secure. Loose items can tip off tall piles, and Bean catches reachable pieces or retrieves misses. An area succeeds only when every treasure has been found and every individual item collected and tied down.

Run `npm run dev` from the arcade project to play at `/play/kiwi-archaeology-society/`. Run `node --test tests/engine.test.mjs tests/pyramids.test.cjs` for arcade and archaeology regression checks, including S, exit running, all routes, individual knots, unloading, reloads, and returning to earlier areas.

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


## Naxos expedition

Completing the Desert, Pyramid, Oasis and Undertomb unlocks the **Naxos →** sign at the far end of the oasis. Click it to sail to the Olive Grove. The four connected Greek areas are the Olive Grove, Temple Courtyard, Oracle’s Chamber and Temple Below, with 24 new finds (26 cargo pieces), original vector artwork and 1–4 pecks per find. Half the finds require sniffing to reveal their initial clue.

The cart stays loaded across all Greek areas, including saved-game reloads. Return to the Olive Grove and click **Harbour ←** to deposit the cargo and sail back to the oasis. Completing all four collections triggers the collection bell and a departing flock of pigeons alongside Bean’s confetti. Existing Egyptian save IDs remain unchanged.

Greek catalogue, artwork and scenery live in `greek.js`, loaded before `game.js`. Run `node --test tests/pyramids.test.cjs` for the complete expedition regression, including all discoveries, routes, packing, unlock and save/reload checks.


## Jungle expedition

After all four Greek areas are completed, click **Jungle →** in the Olive Grove (x=1650). Explore the Canopy Trail, Rain Courtyard, Root Vault and Heart of the Temple. There are 24 new finds / 26 cargo pieces with original SVG artwork, half hidden until sniffed, plus wall alcoves and root-covered finds. The first peck clears roots; total effort stays within 1–4 pecks.

All four areas share a cart, with a swaying leaf umbrella, rainfall, mossy ruins and ceiling drips. Return via **← Naxos** in the Canopy Trail to deposit the collection. Catalogue IDs are appended, preserving existing saves. `jungle.js` contains the catalogue, artwork and canvas scenery and loads before `game.js`. The expedition regression now plays through the complete jungle chapter and checks unlocks, roots, packing, save/reload and return travel.


### Bathhouse and highland expeditions

Completing all four jungle areas unlocks **Baths →** on the Canopy Trail. The Aqueduct Garden leads to the Mosaic Baths and the furnace beneath them. Completing these three areas unlocks **Castle →** in the Aqueduct Garden. The Cliffside Castle leads to the Clockwork Hall, then upstairs to the Stargazer’s Tower.

Each of the six new scenes has six unique discoveries, one-to-four-peck excavation, and three finds without surface clues until sniffed. Bath ducks and pocket stars contain three cargo pieces each. The cart stays loaded inside each three-scene site; leaving the site warehouses the collection. Existing catalogue IDs and saves are preserved. Art, catalogue data and scenery live in `expeditions.js`.

Validation: `node --test tests/pyramids.test.cjs` covers the full route, all discoveries, hidden clues, packing, both stair directions, unlocks, saves, and return journeys.


Express freight lifts in the Great Tomb, Temple Below, Heart of the Temple, Under the Baths and Stargazer’s Tower return directly to the site’s outdoor scene. Click the platform or use its Lift button. Pip, Bean and the cart ride together; unfinished finds remain recoverable and existing warehouse rules apply when exiting the pyramid.


Jungle rooms have distinct architecture and atmosphere throughout their length: layered forest and river on the trail, pale sunlit terraces and a frog fountain in the courtyard, earthen walls and giant living roots in the vault, and blue ceremonial arches with golden seed murals in the heart. Ground materials and excavation debris change with each room; rain gives way to ceiling drips and finally fireflies.

# Captain Kiwi

An isolated static canvas fishing game. The ocean chart controls navigation; the close-up deck shows working cranes, kiwi crew, cargo crates, rain and a captain on the bridge. No services, accounts, or offline earnings.

## Play

- Go fishing: automatically sail to an available ground and haul a catch.
- Catch fish: haul again where you are. No timing challenge.
- Return home: sail to Featherport, automatically sell and repair on arrival.
- Optional ocean map, ship improvements, and voyage journal expand when requested.
- Arrow keys / WASD and chart taps still allow free sailing. Space starts fishing; E docks at port.
- Storms and landmarks remain part of the ocean. Existing upgrades and discoveries are preserved.
- Help and new-voyage dialogs pause simulation. New voyage requires confirmation.

Saves retain the existing `squeewi:captain-kiwi:v1` key. Old saves gain an empty discovery journal automatically. Saves are browser-local; a haul in progress is not persisted.

## Verify

`node --test tests/captain.test.mjs` covers port economy, upgrades, bonuses, capacity, discoveries, old-save migration and rescue valuation. `npm run build` copies the game to `/play/captain-kiwi/`.

Browser verified: sailing via courses, automatic hauls, hold capacity, storm damage, dialog pause, port sale/order award, repairs, crew purchase, reload persistence, landmark rewards, and 390px layout.

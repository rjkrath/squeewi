# Storybook asset set

Generated with the built-in ImageGen tool on October 9, 2026. All final assets are copied into this directory. The original procedural artwork remains as a loading fallback. These assets replace only this pirate game's visuals; saves and gameplay are unchanged.

- `storybook-atlas.png`: transparent sprites for the player's ship, rival, captain, island, chest and palm.
- `storybook-props.png`: transparent shipwright hut, stones, map bottle and dock.
- `storybook-ocean.png`: painted ocean background.
- `storybook-shore.png`: painted island clearing background.

## Prompt set

Atlas: A single transparent PNG game sprite atlas for a kiwi pirate browser adventure. Cohesive hand-painted gouache storybook sprite sheet, richly textured brushwork, soft warm light, charming round flightless kiwi birds with long slender beaks and tiny feet. Six isolated illustrations in three columns and two rows: oversized wooden pirate ship facing right with cream sails, teal pennant, captain and crew; rival ship facing left with burgundy sails; full-body kiwi captain with tricorn and teal scarf; tropical sandy island with palms and dock; open treasure chest of gold; crooked lush palm tree. Readable silhouettes, generous transparent margins, no labels, borders, watermark or overlapping cells.

Ocean: Wide landscape 3:2 background plate. Expansive tropical ocean surface from a high elevated game camera, edge to edge. Painterly gouache and watercolor texture, deep peacock teal sea, blue-green currents, delicate cream-turquoise wave brushstrokes and gentle sparkling sunlight. Calm adventurous mood. No sky, horizon, land, boats, characters, text, UI or borders; modest waves behind separate sprites.

Shore: Tropical shore background plate, landscape 3:2, elevated three-quarter view of a small sandy island clearing surrounded by teal turquoise water. Cream sand, mottled texture, tiny shells, olive moss patches toward upper center, low tropical foliage along upper edge, delicate shoreline foam. Playable clearing approximately x20–88%, y40–75%, open center and lower-middle. No trees, palms, buildings, docks, ships, chest, characters, text, icons or UI.

Props: New transparent game prop atlas using `storybook-atlas.png` as a style reference. Matching gouache texture, warm wood, teal accents and golden light. Four separate props in a 2×2 grid: wooden shipwright hut with teal roof, doorway, barrel, rope and timber; three pale irregular beach stones in a triangular grouping with clear center; corked green glass bottle containing a curled map; rustic rope-post jetty detached from land. Elevated three-quarter perspective, no water or sand around sprites, transparent gaps, no background shadows, labels or grid borders.

## Beaks and feet correction

Active character atlas: `storybook-atlas-beaks-feet.png`, edited with built-in ImageGen. All kiwis have one continuous fuzzy torso, a long beak and exactly two feet. No visible wings, arms or hands. Captains use their beaks on wheel spokes; crew use beaks and feet for ropes and tools. The original atlas remains for reference.

Edit prompt: Precise anatomy correction only on the existing transparent atlas. Remove all arms, hands, visible wings, flippers and side appendages from every crew member and standalone captain; smooth wing-shaped body patches into continuous feathers. Remove limbs reaching for wheel or rope. Captains grip or press a wheel spoke directly with their long beaks. Crew grip ropes with beaks or pin ropes with a foot. Preserve gouache style, hats, scarves, friendly faces, ships, colors, island, palms, chest, atlas dimensions and sprite positions. Preserve transparency. All work uses only beaks and feet.

## Calm water

The open sea now uses a smooth blue gradient with sparse gentle ripples. Active shore plate: `shore-calm-water.png`, edited with built-in ImageGen. Edit prompt: Change only surrounding water to normal calm clear blue, approximately #318cad, with a subtle lighter shallow band and sparse soft ripples. Preserve sandy island, foliage, land rocks, shells, framing and dimensions. Remove dramatic waves, mottled turquoise swirls, busy reflections and underwater boulders; retain thin pale shoreline foam. No new objects.

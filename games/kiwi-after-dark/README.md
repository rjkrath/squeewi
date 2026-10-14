# Kiwi After Dark

A compact, playable nocturnal beak sandbox. No build step or dependencies.

## Play

Open `index.html` in a modern browser, or serve this folder for reliable saved progress:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8765. The development preview is already running there.

## Controls

- Arrow keys: waddle. W/A/D also move up/left/right; down uses the down arrow.
- Space: tap to poke on contact, or hold to probe more firmly. A release simply relaxes the beak.
- S or the sniff button: reveal scent trails and sound/vibration hints.
- Cursor: arrow on empty ground, arrow for distant objects, gold beak only within poking range.
- Click/tap ground: waddle there. Click a distant object: walk there without a queued poke. Click again once nearby to interact. Tap a nearby object to poke; hold it for a firmer probe.
- Poke loose finds to carry them in your beak. One item fits; taking another drops the previous one nearby.
- Head home: waddle to the burrow. Arriving deposits your find. Poke the burrow to end the night.
- Optional sound toggle: synthesized beak/mushroom effects. All hints also work silently.

The lawn includes worms, musical mushrooms, a rolling rock, a hole that pokes back, leaves, a sleeping snail, human litter and optional discoveries under foliage. Bank all six lawn treasures to open the lawn's three paths together: west to Windfall Orchard, east to the Midnight Potting Shed, and south to Reedwater Hollow. Choose any area first and return freely to the lawn from each area's reciprocal edge. Carrying a find across areas keeps it in the beak; Head home follows the return path and deposits it in the burrow. There is no mandatory pond → orchard → shed sequence.

The pond, orchard and shed each have five physical interactions and three treasures. Every area keeps its explored spots and loose finds during the night. Fifteen treasures and learned lawn smells persist locally; existing saves retain their finds and open all three branches as soon as the lawn collection is complete. A new night resets encounters and reveals subsequent lawn finds; missing a first-night treasure never locks it out. The kiwi walks through edge paths, with horizontal or vertical camera glides according to the direction of travel. There is no timer, damage, flight, backpack or human tool use.

Controls and accessible path buttons sit directly below the play area. The field-notes panel and the shelf's extra descriptive text have been removed. Learned discoveries still support persistent scents and physical consequences.

## Test

```sh
node test.cjs
```

The deterministic smoke test executes the real game script with a minimal DOM/canvas adapter. It covers the original encounters and six lawn treasures, carry/deposit, immediate poke contacts, repeated and held pressure, loose-find recovery, movement, night transitions, save/reload and missed-find recovery. World checks cover incomplete-lawn boundary gates, all three simultaneous branch unlocks, arbitrary area order, west/east/south pointer and keyboard crossing, reciprocal returns, camera glides, safe home navigation, all 15 treasures and nightly reset. Renderer checks also verify painted walking/turning poses, forward pokes, ground contact and hidden discoveries.

## Files and scope

- `index.html`: interface and instructions.
- `style.css`: responsive styling; optional Google Fonts with local fallbacks.
- `game.js`: canvas art, animation, interactions, audio, and local saving.
- `test.cjs`: deterministic smoke checks; Node only needed to run tests.

The artwork is drawn directly in canvas. The MVP uses deliberately simple scripted physics and four compact areas. Desktop is the most comfortable way to play; touch supports the same point/hold loop. Only banked treasures, learned notes, and the night number survive a reload; loose finds and an unfinished night's activity reset. Browser storage settings may limit persistence. No accounts, analytics, or backend.


## Kiwi vs. the Lawn
The opening Moonlit Lawn is part of the same wandering game. Sniff/listen (S), waddle (arrows or click), and probe with Space or a nearby pointer hold. Shift scurries on foot. One beak carries one find; while carrying, investigate after banking it at home or poke empty ground to set it down.

A short hose poke only flexes the kink; a steady probe or three quick pokes unfold it and release water. The sprinkler nose toggles the rotating spray, which wets the soil and startles/fluffs a kiwi caught in its sweep. Dry crust takes two digs; damp ground gives up a worm in one. The squeaky ball is repeatable, silly, and has no prize. Leaves and existing human litter feed the burrow shelf. Familiar lawn smells become more specific after two encounters and persist under the existing save key. Water and excavations reset each night. The distant fence frames the lawn; the former freestanding gate has been removed. No buried civilization is introduced.

Validation: `node test.cjs` exercises the original four-area flow plus lawn consequences, save migration, beak occupancy, and nightly resets.


## Forward beak pokes

Pokes act on key/pointer press. The kiwi leans forward with a fixed-length beak and planted feet; release eases back to rest without an impact. On pressure-sensitive objects, a hold deepens the contact after 0.45 seconds and 0.9 seconds. Consecutive taps within 2.5 seconds build pressure; the hose opens after three quick contacts, mushrooms grow louder, and the ball hops higher. Sprinkler buttons toggle once per press. Patient soil probing completes a dig. Finds are gripped gently and carried, with no backward yank or fling. Pressure runs expire and reset each night; cancellation and blur stop the probe.


## Foreground lawn exploration

The bottom narration strip has been removed. Short local sounds, animations, nearby labels, sniff cues and field notes carry the feedback; an offscreen live status retains accessible descriptions. Idle narration no longer repeats.

Four optional lawn discoveries fill the freed foreground: a rattling pod opens under sustained or repeated pokes and a beetle scuttles into the fern; a dandelion loses its seed puff gradually; a cupped leaf flicks dew onto the kiwi; an abandoned paper cup rolls and flops with a poke and hints at fruit/market smells beyond the hedge. These use the same planted forward poke and pressure rules, teach lawn knowledge, and reset each night. Existing collection gates and routes are unchanged.


## Discoveries behind foliage

The seedpod and paper cup start fully concealed; the ball and dew leaf show only glimpses through foreground shrubs. Covered objects do not display proximity labels until sniffed or uncovered. Sniffing gives scent/sound cues without removing the cover. A beak poke bends the foliage aside and reveals the item; cover resets each night. Scenery, props, dropped finds and the kiwi share ground-depth ordering, so foreground plants can actually obscure things and the bird can walk behind them. This also applies during area transitions.


## Rounded painted turns

Direction changes use a 0.38-second pivot through right profile, three-quarter, front, three-quarter and left profile poses. Each frame uses one fully opaque pose, with the original profile artwork retained at either end. Whole-character crossfades are removed to avoid doubled eyes, beaks and translucent silhouettes. The lower torso anchors each view at the same position and height over the feet; the front pose places its two feet facing outward before settling into the opposite profile. Body volume stays constant rather than squeezing a mirrored sprite through zero width. The feet take small pivot steps, carried finds follow the beak, and a direction dead band prevents twitching during vertical travel. The canvas fallback also preserves a round body.

The three intermediate body poses are in `assets/painted/kiwi-turning.png`, created with the built-in image-generation tool using the existing lawn atlas as a reference. The full prompt is saved alongside it as `kiwi-turning-prompt.txt`. Renderer checks cover intermediate/front poses, a single opaque body in every frame, consistent torso alignment, direction settling, vertical-facing stability, rapid reversals, poking during a turn and treasures attached to the visible beak. `kiwi-solid-turn-preview.png` records consecutive frames from the actual game.


## Subtle paths and the orchard hedgehog

Edge paths use a faint narrow scatter of pigment and flattened grass instead of filled widening wedges. Distant compass lettering and constant bright fireflies are gone; destination names and a few soft fireflies appear when approached or sniffed. Route access, direction, unlocks and below-game navigation controls retain their existing behavior.

Windfall Orchard has a clearly identified sleeping hedgehog on a few leaves, painted to match the kiwi. A beak poke makes it huff and tuck into a rounder sleeping pose for 1.2 seconds, then settle down again. It remains an animal rather than a collectible. `assets/painted/orchard-hedgehog.png` contains the resting and curled poses, created with the built-in image tool; the exact prompt is saved in `orchard-hedgehog-prompt.txt`. The renderer test exercises sleeping art, the poke pose and return to sleep.


## Two-foot walking correction

The foot atlas contains a full ankle and toes, so painted feet no longer receive an extra drawn calf. Exactly two foot sprites sit under the body. Each walking cycle spends 60% in support: the planted foot remains stationary against the ground as the kiwi passes over it. The remaining 40% lifts the foot and returns it forward for the next contact. Opposite phases keep at least one foot down; travel direction determines the stride for right, left and diagonal movement. Turning, resting and forward beak probing keep the same two feet. Renderer checks verify forward swing and stable support contact in both horizontal directions.

## Painted small treasures and deliberate pickup

All fifteen collection items use `assets/painted/small-treasures.png`, a transparent 4×4 atlas made with the built-in image-generation tool. The exact prompt is saved in `small-treasures-prompt.txt`. The existing flat twig remains the lawn's resting stick; the new atlas supplies its carried and shelf views. Other finds share the same painted asset on the ground, in the beak, and on the shelf.

Poking a source uncovers a treasure beside it, resting against the grass. Discovering, waiting, approaching or holding the original probe does not pick it up. A separate poke of the loose item puts it in the kiwi's beak; a full beak leaves it on the ground. The initially loose twig is picked up directly. Unclaimed finds retain their ground positions through area travel, and repeated source pokes cannot duplicate them. Banking, collection unlocks and nightly resets keep their existing behavior. Simulation checks cover all fifteen finds and the new pickup flow; renderer checks cover stable ground contact, matching beak art, removal on pickup and the painted shelf.

## Independent painted beak pokes

The existing painted profiles and turning poses are rigged into torso/head and beak layers in memory. A tap briefly draws the head back, thrusts the painted beak forward and then recoils over 0.34 seconds. The neck/front region moves while the back gives only a small supporting lean, and the two feet stay planted. The beak aims toward the contacted object and retains its painted shape and length. Stronger taps and staged held probes give firmer thrusts; release settles back into the original idle painting. Carried treasures follow the rendered beak tip. No new guide lines or replacement character artwork are used.

Renderer checks cover right/left thrust and recoil, small torso movement, planted feet, fixed beak length, held probing, return to idle, existing turning poses and treasure pickup. The full playable-flow simulation also passes. `kiwi-beak-poke-preview.png` shows a paused contact pose from the actual painted game.


## Solid ground footprints

The kiwi walks around the burrow mound, sprinkler base, rocks, mushrooms, sleeping animals and bulky props in the other areas. Elliptical ground footprints include space for the bird's body, while flat litter, soil, hoses and concealing foliage stay walkable. Keyboard movement slides along the edge; scurrying uses short collision steps so it cannot skip through an object. Click-to-walk finds a short route around solid footprints and stops outside a clicked prop within beak reach. Rolling rocks, apples and the moving snail carry their footprint with them. The burrow's spawn sits just outside its entrance; banking finds, curling up and returning through area paths remain available.

Simulation checks cover contact from four sides, running, diagonal slides, click detours around the sprinkler and home, moving rock bounds, home deposit/sleep/respawn and solid shed props. The existing collection, area-travel, painted turns and beak-poke checks also pass.


## Nearby, deliberate interactions

Clicks outside the 80-pixel poke range only move the kiwi. Arriving, waiting or holding that original distant press never interacts or picks anything up; a fresh nearby click or Space press is required. Nearby object clicks still support held probing. The cursor shows a beak only when within reach. Finds uncovered by a source remain on the grass until explicitly picked up. Their pointer hit area covers the small item and its visible name when within reach, and Space chooses the nearest relevant target rather than prioritizing every loose find over its source. Repeated source pokes therefore leave its treasure on the ground. The loose twig is still picked up directly when deliberately poked nearby.


Poke deformation strips overlap by a small amount in screen space to seal antialiased edges. This prevents lawn-colored vertical/horizontal hairlines from showing through the painted body during withdrawal, thrust and recoil, including a blocked poke with an occupied beak. Front-facing compression is capped so strong probes cannot fold the neck strips over. Renderer checks cover both directions, all five painted views at maximum pressure, and retention of the carried find.


The on-screen beak-pressure box has been removed. Tap contact, repeated-poke pressure, held probing, beak animation and physical responses retain their existing timing and behavior.


Collected treasures remain absent after reload and on later nights. A pending beak carry and loose ground finds are saved with a single location per item; pickup removes the saved ground copy. Existing shelf saves also hide the original stick and collected ribbon, cork, spool and plant label without removing their surrounding scenery.


Wiggly soil, dry dirt and the suspicious hole render as flat ground beneath the kiwi, independently of vertical depth sorting. Raised scenery and concealing foliage keep their existing depth order. Renderer checks cover approaching both soil patches and the hole from every side and standing over their centres.


Rock pokes and their treasure reveals skip the generic particle puff. The rock still rolls and exposes a grounded find; repeat pokes keep their sound/text response without a spray.


The large prop is labelled Loose rock; its Round pebble / Bottle cap reveal rests to its left, clear of the rolled rock. Repeat tinks are hidden while either find is waiting on the ground. Existing saves at the former reveal point are moved to this clear position, while intentionally set-down finds retain their positions.


The bell rests left of the suspicious hole, clear of its interaction area. Hole pokes, bell reveal and bell pickup emit no particle spray. Earlier saved bell reveals move to this clear point. Nearby treasure names are clickable; distant clicks still only walk and reveals still require a separate pickup.


Squeaky-ball pokes keep their squeak, hop and kiwi shudder while suppressing the triple-exclamation overlay. Other surprise reactions keep their existing text.

Treasure drop-off follows the visible beak's contact with the painted home silhouette, rather than requiring the kiwi's body to approach its centre. Any part of the beak can touch the mound to bank a carried find, including while standing still or probing; the solid house collision remains. The contact check uses the current pose, jab, bob and wet scale, ignores transparent art, and is disabled outside active lawn play.

The leaf pile's button and shell now land on clear grass to its lower left, outside the pile's click target. They stay grounded until a separate pickup click. Earlier saved reveals at the original overlapping position move to the clear location on load; intentionally set-down treasures retain their positions.

Space pokes select only close objects within a narrow forward corridor (18 lawn units either side, within the existing 80-unit reach). Empty pokes have no sideways or rearward fallback and do not turn the kiwi toward an unrelated nearby object. Deliberate close pointer pokes remain available, while the dandelion's pointer target is limited to its painted flower/stem area instead of the surrounding grass.

Picking up, setting down and banking treasures emit no particle puffs. Original twig pickup also skips the generic poke puff. Beak movement, grounded placement, sounds, collection feedback and persistence remain; water encounters retain their own water effects.

Empty pokes retain their beak animation but add no floating action word or empty-poke narration.

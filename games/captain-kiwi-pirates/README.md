# Captain Kiwi: Pirate Waters

Current game: a small voyage adventure inspired by the prepare/travel/event structure of Oregon Trail and Yukon Trail. Starts at Little Beak Pirate Port. Choose treasure, revenge (recover a stolen kettle), or relaxation; name three crew members; buy food, repair timber and cannonballs. The boat sails automatically across a wide 5:2 panel toward predetermined destinations. A slim status strip and event controls below replace the former sidebar.

Events: five timed fishing casts, steering around typhoon squalls, remembering a bearing through fog, three timed cannon shots, a crew meeting with timed listening or a safe ferry transfer, and a treasure riddle. Event outcomes affect food, hull, morale, coins and ammunition. Ships can be repaired between encounters with timber. If the hull fails, a tug brings everyone home safely. Crew transfer explicitly shows a ferry collecting the kiwi and sailing away; Continue becomes available after pickup. Every kiwi has no visible arms or wings; beaks and feet operate equipment.

Current files: `voyage.js` (state/rules), `trail.js` (view and minigames), `index.html`, `style.css`. Earlier free-roaming prototype `engine.js`/`game.js` is retained but is not loaded. Painted assets and prompts remain in `assets/README.md`. `preview-voyage.jpg` is an offline render from the actual game drawing code.

Save: `squeewi:captain-kiwi-pirates:voyage:v2`. The earlier prototype save is preserved under its own key. Local-only saves, no accounts or backend. Event progress restores at the event briefing; no reward is applied twice. Saves happen on state changes, periodically, hiding and leaving. New voyage requires confirmation. Pause and tab hiding suspend progression. Keyboard arrows steer during storms, Space handles timed actions when canvas has focus; all minigames also have touch buttons.

Validation: `node --test tests/pirate-voyage.test.mjs tests/pirate-trail-controls.test.mjs` checks port budget, crew naming, all routes, supplies, safe endings, save validation and an entire UI voyage with all event types and timed ferry pickup. `npm run build` assembles `/play/captain-kiwi-pirates/`. The static build and offline render are checked; browser re-verification remains unavailable after the browser tool rejected the localhost URL in this session.

The fishing game at `/play/captain-kiwi/` is independent. No deployment or domain settings changed.

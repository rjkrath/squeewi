# Squeewi

A tiny fictional kiwi game publisher: **tiny games. many kiwis.**

The initial release is a responsive, dependency-free arcade and Kiwi Clicker. No account, database, analytics, external fonts, or cloud saves are needed.

## Try it locally

Use Node.js 22 or newer. From this folder:

```sh
npm run dev
```

Open http://localhost:4173. Stop the server with Ctrl+C. After changing files, restart the server to rebuild.

```sh
npm test
npm run build
```

`dist/` is the complete static deployment output. It is generated and excluded from Git.

## Public routes and independent games

- `/` — arcade homepage
- `/play/kiwi-clicker/` — Kiwi Clicker
- `/play/kiwi-archaeology-society/` — Kiwi Archaeology Society
- Unknown routes — a real 404 page (no catch-all game routing)

```text
site/                    Homepage, shared optional artwork/styles, 404, headers
 games/kiwi-clicker/     Standalone HTML, game UI, and pure game engine
 games.json              Slug → static source directory registry
 scripts/                Static assembly and local preview
 tests/                  Game economy and save validation tests
 .github/workflows/      Build/test checks on pushes and pull requests
```

Each game owns its HTML and JavaScript. The arcade never imports game code and there is no shared framework or client router. Kiwi Clicker uses the arcade stylesheet; future games can ship their own CSS and runtime. Local storage keys must be namespaced by game and version.

To add a game:

1. Put a static bundle with `index.html` into a new game directory. For a framework game, build it independently first and register its output directory.
2. Configure its asset/public base as `/play/<slug>/`. Relative module imports work within this folder. Client-side routing needs an explicit per-game fallback; it is not supplied globally.
3. Add a unique lowercase hyphenated slug and project-relative source to `games.json`.
4. Add its homepage card to `site/index.html`. The registry controls publishing; cards are intentionally hand edited for art direction.
5. Build and check direct navigation to its URL. Framework dependencies and their build steps should stay inside that game, with the root build calling them before assembly if needed.

The initial security headers allow scripts, styles and images from this site. If a later game needs WebAssembly, external resources or embeds, deliberately adapt `site/_headers` for that game's route.

## Kiwi Clicker

Press the button to earn pecks. Spend them on beak polish (+1 per press), interns (+1/second), spring beaks (+8/second), night-shift flocks (+50/second), and button factories (+300/second). Prices grow by 18% per purchase. The kiwi pecks when you press; native buttons support keyboard and touch. Reduced-motion preferences suppress animation.

Saves use `squeewi:kiwi-clicker:v1` in localStorage, after purchases/clicks, every five seconds and when leaving or hiding the page. Reloading restores progress and awards up to eight hours of helper production. Invalid saves reset safely; unavailable browser storage shows a session-only notice. A fresh-burrow dialog confirms reset.

Progress is specific to this browser and origin: localhost, Pages previews and squeewi.com have separate saves. Clearing site data removes progress. Use one active tab per game; simultaneous tabs do not coordinate saves. There is no competitive score verification or endgame yet.

## GitHub → Cloudflare Pages

These instructions follow Cloudflare's [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) and [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

### What you need to provide or do before external actions

- **GitHub:** choose the owning account/organization, repository name (suggested `squeewi`), and public/private visibility. Create an empty repository and upload this folder's contents at its root, or provide its URL for a later push. Authenticate directly with GitHub; do not paste passwords or tokens into chat.
- **Cloudflare:** sign into your chosen account, create a **Pages** project, and approve the GitHub integration for the selected repository. No Cloudflare credentials are needed by this project.
- **Domain:** identify the registrar for `squeewi.com`, whether DNS already uses Cloudflare, and any existing website/email DNS records. You must be able to edit registrar nameservers. Review existing DNS records before changing nameservers, especially email records.
- **Naming:** choose the Pages project name (suggested `squeewi`) and whether to add `www.squeewi.com` as well as the apex domain. The initial target is `squeewi.com`.

No repository has been created or pushed, no hosting project has been created, and no DNS records have been changed as part of this delivery.

### Deployment settings

After the code is in GitHub, in Cloudflare go to Workers & Pages → Create application → Pages → Connect to Git, select the repository, and use:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Production branch | `main` (or your chosen production branch) |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |

No secret environment variables, database bindings or separate deploy command are required. GitHub Actions runs checks; Cloudflare's Git integration performs deployments automatically. Verify the resulting `pages.dev` URL, direct game URL, purchases, refresh persistence, mobile layout and a missing-page URL before attaching the domain.

### Attach squeewi.com

Follow Cloudflare's [custom domain guide](https://developers.cloudflare.com/pages/configuration/custom-domains/). For the apex domain, add `squeewi.com` as a Cloudflare zone in your account and point the domain's registrar nameservers to the exact nameservers Cloudflare assigns. Preserve existing DNS records before the switch.

In the Pages project's Custom domains section, add `squeewi.com` and complete the guided setup. Associate the domain in Pages before manually creating a CNAME. Wait for DNS and certificate activation, then verify HTTPS and `/play/kiwi-clicker/`. If wanted, add `www.squeewi.com` separately and configure a redirect to the apex.

## Validation performed

Automated checks cover spending and price growth, manual power and automation rates, malformed save handling, save round trips, offline caps and clock reversal. The production build was generated successfully. Browser checks confirmed homepage → game navigation, 30 manual presses, buying an intern, automation, persistence after reload, reset cancellation, and a 390px mobile layout.

## Kiwi Archaeology Society integration

The desert and pyramid expedition is an independent static game under `games/kiwi-archaeology-society/`. Its relative CSS and script paths are preserved by the registry build. It uses the existing `kiwi-desert-expedition-v2` save key for compatibility, distinct from Clicker. Saves remain origin-specific. A footer link returns to the arcade; the game retains its own visual design. Fonts use local browser fallbacks to comply with the arcade’s self-only security policy. No remote fonts or new deployment dependencies are required.

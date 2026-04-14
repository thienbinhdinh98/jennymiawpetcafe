# Project Structure

## Top-level

```
jennymiawpetcafe/
├── src/                    # All source code
├── static/                 # Static assets served as-is (images, robots.txt)
├── messages/               # Translation strings (vi.json, en.json)
├── docs/                   # This documentation
├── plan.md                 # Original architecture plan
├── CLAUDE.md               # Guidance for Claude Code
├── svelte.config.js        # SvelteKit config
├── vite.config.ts          # Vite/build config
├── wrangler.jsonc          # Cloudflare Pages config
└── package.json
```

## Source (`src/`)

```
src/
├── app.html                # HTML shell — <head> preconnects, body wrapper
├── hooks.server.ts         # Server hooks — paraglide language detection
├── lib/
│   ├── config.ts           # ★ Phone number and social media links
│   ├── types.ts            # TypeScript interfaces: Cat, Location, BilingualText
│   ├── data/
│   │   ├── cats.json       # ★ All cat profiles
│   │   └── locations.json  # ★ Cafe locations (address, hours, map)
│   ├── components/
│   │   ├── Navbar.svelte
│   │   ├── Footer.svelte
│   │   ├── LanguageSwitcher.svelte
│   │   ├── CatSlider.svelte       # Horizontal swipeable cat carousel
│   │   ├── CatDetailModal.svelte  # Full-screen cat detail with prev/next peek
│   │   └── LocationCard.svelte    # Location card with embedded Google Map
│   ├── assets/
│   │   └── favicon.svg
│   └── paraglide/          # Auto-generated i18n runtime (do not edit)
└── routes/
    ├── +layout.svelte      # Global layout — wraps all pages with Navbar + Footer
    ├── +page.svelte        # Homepage (single scroll)
    ├── +page.server.ts     # Loads cats + locations data for homepage
    ├── layout.css          # Global CSS — Tailwind + theme colors + fonts
    └── gallery/
        ├── +page.svelte        # Cat gallery grid
        └── +page.server.ts     # Loads cats data for gallery
```

## Static assets (`static/`)

```
static/
├── robots.txt              # Bot rules (AI crawlers blocked)
└── cats/                   # Cat photos organized by cat ID
    ├── mimi/
    │   ├── avatar.jpg      # Square avatar shown in cards and slider
    │   ├── 1.jpg           # Extra photos shown in detail modal
    │   └── 2.jpg
    └── ...
```

## Translations (`messages/`)

```
messages/
├── vi.json     # Vietnamese UI strings (primary language)
└── en.json     # English UI strings
```

`★` marks the files you will edit most often as a cafe owner.

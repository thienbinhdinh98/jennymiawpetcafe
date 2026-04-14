# Jennymiaw Pet Cafe — Website Plan

## Overview

**Name**: Tiệm cà phê mèo Jennymiaw / Jennymiaw Pet Cafe
**Type**: SEO-focused introductory website for a cat cafe with 2 locations in Hanoi, Vietnam
**Business model**: Buffet-style — one ticket includes playing with cats + unlimited drinks & snacks

---

## Tech Stack

| Layer          | Choice                           | Why                                                        |
| -------------- | -------------------------------- | ---------------------------------------------------------- |
| Framework      | **SvelteKit**                    | Lightweight, SSR built-in, fast hydration                  |
| Language       | **TypeScript**                   | Type safety for cat data schemas, i18n keys                |
| Styling        | **Tailwind CSS v4**              | Utility-first, small bundle, mobile-first by default       |
| i18n           | **paraglide-sveltekit**          | Compile-time i18n, zero runtime overhead                   |
| Carousel       | **Embla Carousel**               | 6KB, headless, great touch gestures, Svelte-friendly       |
| Image handling | **@sveltejs/enhanced-img**       | Automatic srcset, WebP/AVIF, lazy loading                  |
| Font           | **Quicksand**                    | Rounded/playful, excellent Vietnamese diacritics            |
| Hosting        | **Cloudflare Pages (free tier)** | Global CDN, DDoS protection, edge SSR, Vietnam edge nodes  |
| Analytics      | **Cloudflare Web Analytics**     | Free, no JS cost, bot vs human breakdown                   |
| Adapter        | **@sveltejs/adapter-cloudflare** | SvelteKit → Cloudflare Pages integration                   |

---

## Color Palette

| Role       | Color     | Hex       |
| ---------- | --------- | --------- |
| Primary    | Hermes orange   | `#F37021` |
| Background | Warm off-white  | `#FFFAF5` |
| Secondary  | Soft cream      | `#FFF5E6` |
| Accent 1   | Soft pink       | `#FFD4D4` |
| Accent 2   | Mint green      | `#D4F0E7` |
| Text       | Dark warm brown | `#3D2C2C` |
| Text muted | Warm gray-brown | `#8B7355` |

---

## Project Structure

```
jennymiawpetcafe/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── CatCard.svelte         # Cat avatar card (grid + slider)
│   │   │   ├── CatSlider.svelte       # Embla-powered horizontal cat carousel
│   │   │   ├── CatDetailModal.svelte  # Full-screen modal with swipe between cats
│   │   │   ├── LocationCard.svelte    # Address, hours, embedded map
│   │   │   ├── Navbar.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── LanguageSwitcher.svelte
│   │   │   ├── SocialLinks.svelte
│   │   │   └── Hero.svelte
│   │   ├── data/
│   │   │   ├── cats.json              # All cat profiles
│   │   │   └── locations.json         # 2 Hanoi locations
│   │   └── types.ts                   # Cat, Location interfaces
│   ├── routes/
│   │   ├── +layout.svelte             # Global layout (navbar, footer, lang)
│   │   ├── +layout.server.ts          # SSR lang detection
│   │   ├── +page.svelte               # Homepage (single scroll)
│   │   └── gallery/
│   │       └── +page.svelte           # Dedicated cat gallery
│   └── app.html
├── static/
│   ├── cats/                          # Cat photos organized by id
│   │   ├── mimi/
│   │   │   ├── avatar.webp
│   │   │   ├── 1.webp
│   │   │   └── 2.webp
│   │   └── ...
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.jpg
├── messages/                          # paraglide translation source
│   ├── vi.json
│   └── en.json
├── tailwind.config.ts
├── svelte.config.js
├── vite.config.ts
└── package.json
```

---

## Pages & Sections

### Homepage (`/`) — Single Scroll

#### 1. Hero
- Full-width banner image with cats
- Cafe name: **Tiệm cà phê mèo Jennymiaw**
- Tagline (TBD)
- CTA button: scroll to locations or "Gặp các bé mèo" → gallery

#### 2. About / Concept
- Brief intro: what is the cat cafe experience
- Buffet details: one ticket = play with cats + unlimited drinks & snacks
- Cute playful icons/illustrations

#### 3. Cat Slider (featured cats)
- Embla Carousel showing ~8-10 featured cats
- Each card: avatar photo, name, breed
- Tap → opens CatDetailModal (swipeable between cats)
- "Xem tất cả" (View all) button → `/gallery`

#### 4. Locations
- 2 cards (stacked on mobile, side by side on desktop)
- Each: name, address, hours, phone
- Embedded Google Maps iframe per location

#### 5. Contact / Social
- Phone number (tap to call on mobile)
- Facebook, Instagram, Threads, Zalo icons with links
- Zalo deep link for mobile

#### 6. Footer
- Compact: cafe name, copyright

### Cat Gallery (`/gallery`)

- Grid: 2 columns on mobile, 3-4 on desktop
- Each card: avatar, name, breed
- Tap → CatDetailModal opens at that cat, swipe left/right for next/prev
- All 30-50 cats loaded at once (fine at this scale, no pagination)

### Cat Detail Modal (shared component)

- Full-screen overlay (mobile), centered modal (desktop)
- Current cat: all photos in a swipeable carousel (Embla)
- Name, breed, personality/description
- Swipe left/right on the modal itself → next/prev cat
- Close button (X) + swipe down to dismiss on mobile
- Backdrop blur on background

---

## Data Model

### `cats.json`

```jsonc
[
  {
    "id": "mimi",
    "name": "Mimi",
    "breed": "Munchkin",
    "description": {
      "vi": "Mimi rất thích nằm cuộn tròn và ngủ trên đùi khách...",
      "en": "Mimi loves curling up and sleeping on guests' laps..."
    },
    "avatar": "/cats/mimi/avatar.webp",
    "photos": ["/cats/mimi/1.webp", "/cats/mimi/2.webp"],
    "featured": true,
    "location": "location-1"
  }
]
```

**Editing workflow**: Edit `cats.json` + drop photos into `static/cats/{id}/`. Push to git → Cloudflare Pages auto-deploys.

### `locations.json`

```jsonc
[
  {
    "id": "location-1",
    "name": { "vi": "Chi nhánh 1", "en": "Branch 1" },
    "address": { "vi": "Địa chỉ...", "en": "Address..." },
    "phone": "+84...",
    "hours": { "vi": "8:00 - 22:00 hàng ngày", "en": "8:00 AM - 10:00 PM daily" },
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=..."
  }
]
```

---

## i18n Strategy

- **Primary**: Vietnamese (`vi`), **secondary**: English (`en`)
- **Routing**: Cookie/query param `?lang=en` (no `/en/` prefix — keeps Vietnamese URLs clean for SEO)
- **Default**: Detect from `Accept-Language` header on SSR, fallback to `vi`
- **UI strings**: paraglide-sveltekit (compile-time, zero runtime)
- **Cat/location data**: Bilingual directly in JSON (`description.vi`, `description.en`)
- **SEO**: `<link rel="alternate" hreflang="vi">` and `hreflang="en"` meta tags

---

## SEO Strategy

- SSR on all pages (SvelteKit + adapter-cloudflare)
- Per-page `<title>`, `<meta description>`, `og:image`
- `LocalBusiness` JSON-LD structured data for each location (address, hours, phone, geo coords)
- Auto-generated `/sitemap.xml`
- Bilingual alt text on all cat photos
- Target: Lighthouse 95+ across all metrics

---

## Security & Bot Management

- Cloudflare free tier: always-on DDoS mitigation
- Cloudflare Web Analytics: bot vs human traffic visibility
- `robots.txt`: block AI crawlers (GPTBot, CCBot), allow search engines
- Security headers via SvelteKit hooks: CSP, X-Frame-Options, X-Content-Type-Options
- No API endpoints = minimal attack surface

---

## Performance Targets

- JS bundle: < 50KB total
- LCP: < 2.0s (hero image preloaded, Cloudflare CDN edge in Vietnam)
- CLS: 0 (explicit image dimensions)
- Mobile PageSpeed: 95+

---

## Image Strategy

- Source photos in `static/cats/{id}/`
- `@sveltejs/enhanced-img` generates responsive sizes + WebP/AVIF at build
- Avatars: ~400x400 source → 200x200 on cards
- Gallery photos: ~1200px max width
- Lazy load everything below the fold
- Future migration path: Cloudflare R2 if repo size grows too large

---

## Assets Needed (from owner)

1. **Logo** — SVG preferred, PNG fallback
2. **Hero banner** — high-quality photo(s) of the cafe / cats
3. **Cat photos** — per cat: 1 square avatar + optional extra photos
4. **og-image.jpg** — preview image for Facebook/Zalo sharing
5. **Location details** — exact addresses, hours, phone numbers, Google Maps links

---

## Development Phases

### Phase 1 — Foundation
- [ ] SvelteKit project init with TypeScript
- [ ] Tailwind CSS v4 + color palette configuration
- [ ] Cloudflare Pages adapter setup
- [ ] paraglide-sveltekit i18n (vi + en)
- [ ] Base layout: Navbar, Footer, LanguageSwitcher
- [ ] TypeScript types for Cat and Location
- [ ] Sample/placeholder data in JSON files

### Phase 2 — Homepage
- [ ] Hero section with placeholder banner
- [ ] About/concept section
- [ ] CatSlider with Embla Carousel (featured cats)
- [ ] LocationCard with embedded Google Maps
- [ ] Contact/social section
- [ ] Smooth scroll navigation from navbar

### Phase 3 — Cat Gallery & Modal
- [ ] Gallery grid page (`/gallery`)
- [ ] CatDetailModal with photo carousel (Embla)
- [ ] Swipe between cats in modal
- [ ] Swipe-down to dismiss on mobile
- [ ] Shared modal usage from both homepage slider and gallery

### Phase 4 — SEO & Polish
- [ ] Meta tags + Open Graph per page
- [ ] JSON-LD structured data (LocalBusiness)
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Security headers
- [ ] Lighthouse audit + optimization pass
- [ ] Cloudflare Web Analytics script

### Phase 5 — Content & Launch
- [ ] Real cat photos (optimized, organized by id)
- [ ] Real location data + map embeds
- [ ] Vietnamese copy finalized
- [ ] English translations
- [ ] Domain purchase + Cloudflare DNS setup
- [ ] Production deploy to Cloudflare Pages

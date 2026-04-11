# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Jennymiaw Pet Cafe (Tiệm cà phê mèo Jennymiaw) — an SEO-focused introductory website for a cat cafe with 2 locations in Hanoi, Vietnam. Single scroll homepage + cat gallery page. Vietnamese primary, English secondary.

## Tech Stack

- **SvelteKit** with TypeScript, SSR via `@sveltejs/adapter-cloudflare`
- **Tailwind CSS v4** for styling
- **Embla Carousel** for cat sliders and photo swiping
- **paraglide-sveltekit** for i18n (compile-time, vi + en)
- **@sveltejs/enhanced-img** for responsive image optimization
- Hosted on **Cloudflare Pages** (free tier)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run check        # svelte-check (type checking)
npm run lint         # ESLint + Prettier check
npm run format       # Prettier format
```

## Architecture

- **Data-driven**: Cat profiles and location info live in `src/lib/data/cats.json` and `locations.json`. To add a cat, edit the JSON and add photos to `static/cats/{id}/`.
- **i18n**: UI strings via paraglide (`messages/vi.json`, `messages/en.json`). Cat/location descriptions are bilingual directly in the JSON data (`description.vi`, `description.en`). Language selection via cookie, detected from `Accept-Language` on SSR.
- **Two routes**: `/` (single scroll homepage) and `/gallery` (full cat grid). Cat detail is a shared modal component (`CatDetailModal`) used from both pages.
- **Images**: Stored in `static/cats/{id}/` (avatar.webp + numbered extras). Enhanced-img handles srcset/format conversion at build time.

## Design

- **Theme**: Cute and playful, mobile-first
- **Font**: Quicksand (Vietnamese diacritics support)
- **Colors**: Hermes orange `#F37021` primary, warm off-white `#FFFAF5` background, soft pink `#FFD4D4` and mint `#D4F0E7` accents, dark brown `#3D2C2C` text
- See `plan.md` for full color palette and design details

## Key Conventions

- Vietnamese is the default/primary language — all SEO meta should prioritize Vietnamese
- No user input forms or API endpoints — the site is purely informational
- Cat data editing happens via JSON + static files, not a CMS
- Target Lighthouse 95+ and < 50KB JS bundle

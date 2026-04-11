# Deployment Guide

## How Wrangler Works

**Wrangler** is Cloudflare's deployment tool. Here's how it works:

### Deployment Process

1. **Build locally** — `npm run build` creates optimized files in `.svelte-kit/cloudflare/`
2. **Upload** — `wrangler pages deploy .svelte-kit/cloudflare/` sends those files to Cloudflare
3. **Host on edge** — Your code runs on Cloudflare's edge servers worldwide

### Build Versions

Wrangler doesn't choose versions — **you do**. Each time you run `npm run deploy`:

- Builds fresh from your current code
- Uploads to Cloudflare
- Cloudflare assigns a unique URL like `https://beb669a5.jennymiawpetcafe.pages.dev`

The hash (e.g., `beb669a5`) is just a random identifier for that specific deployment.

### Git Integration (Optional)

Wrangler **doesn't require git** — it just uploads your local `.svelte-kit/cloudflare/` folder.

However, you can set up **production branch integration** in Cloudflare's dashboard:

- Push to `main` → auto-deploys to production
- Push to other branches → deploys to preview URLs

For manual deploys (current setup), git doesn't matter.

## Deployment Commands

### Manual Deploy

```bash
npm run deploy
```

This:
1. Builds latest code
2. Uploads to Cloudflare
3. Returns a unique preview URL

### Preview Locally

```bash
npm run preview
```

Runs the production build locally on `http://localhost:4173` to test before deploying.

### Build Only

```bash
npm run build
```

Creates `.svelte-kit/cloudflare/` without uploading.

## Your Current Setup

```
npm run deploy
↓
builds latest code → uploads to Cloudflare → unique preview URL
```

Every deploy is a fresh snapshot. Old deploys stay at their old URLs, but you have one stable "latest" alias:

**https://create-webpage.jennymiawpetcafe.pages.dev** — always points to your most recent deploy

## First Time Setup

If you need to deploy to a different Cloudflare project:

```bash
# Login to Cloudflare
npx wrangler login

# Deploy (creates project if needed)
npm run deploy
```

When prompted, choose **"Direct Upload"** (no git integration).

# Content Update Guide

This guide covers everything you need to edit as a cafe owner — no coding required.

---

## Cats

### File: `src/lib/data/cats.json`

Each cat is one object in the array. Example:

```json
{
  "id": "mimi",
  "name": "Mimi",
  "breed": "Munchkin",
  "description": {
    "vi": "Mimi rất thích nằm cuộn tròn...",
    "en": "Mimi loves curling up..."
  },
  "avatar": "/cats/mimi/avatar.jpg",
  "photos": [
    "/cats/mimi/1.jpg",
    "/cats/mimi/2.jpg"
  ],
  "featured": true,
  "location": "location-1"
}
```

### Field reference

| Field | Description |
|---|---|
| `id` | Unique slug — lowercase, no spaces (e.g. `"mimi"`, `"orange-boy"`) |
| `name` | Display name shown on cards |
| `breed` | Breed shown below name |
| `description.vi` | Vietnamese personality description |
| `description.en` | English personality description |
| `avatar` | Path to square avatar photo. Must match `/cats/{id}/avatar.jpg` |
| `photos` | List of extra photo paths. Can be empty `[]` |
| `featured` | `true` = show in homepage slider. `false` = gallery only |
| `location` | Which branch the cat lives at: `"location-1"` or `"location-2"` |

### Adding a new cat

1. Add the cat's entry to `cats.json`
2. Create folder `static/cats/{id}/`
3. Add `avatar.jpg` (square crop works best)
4. Optionally add `1.jpg`, `2.jpg`, etc. and list them in `photos`
5. Commit and deploy

### Removing a cat

Delete the entry from `cats.json` and optionally remove the photo folder from `static/cats/`.

---

## Locations

### File: `src/lib/data/locations.json`

```json
{
  "id": "location-1",
  "name": {
    "vi": "Jennymiaw Chi nhánh 1",
    "en": "Jennymiaw Branch 1"
  },
  "address": {
    "vi": "Số 12, Phố Hàng Mã, Hoàn Kiếm, Hà Nội",
    "en": "12 Hang Ma Street, Hoan Kiem, Hanoi"
  },
  "hours": {
    "vi": "8:00 - 22:00 hàng ngày",
    "en": "8:00 AM - 10:00 PM daily"
  },
  "mapsUrl": "https://maps.app.goo.gl/...",
  "mapEmbedUrl": "https://maps.google.com/maps?q=21.0255174,105.7984388&z=17&output=embed"
}
```

### Field reference

| Field | Description |
|---|---|
| `name.vi/en` | Branch display name |
| `address.vi/en` | Street address shown under the map |
| `hours.vi/en` | Opening hours |
| `mapsUrl` | Short Google Maps link — used for the "Get directions" button |
| `mapEmbedUrl` | Embed URL for the iframe map. See below for how to get it. |

### Getting the map embed URL

**Option A — from coordinates** (simplest):
```
https://maps.google.com/maps?q=LAT,LNG&z=17&output=embed
```
Replace `LAT,LNG` with your coordinates (e.g. `21.0255174,105.7984388`).

**Option B — from Google Maps**:
1. Open Google Maps and find your location
2. Click **Share** → **Embed a map**
3. Copy the `src="..."` value from the iframe code

---

## Phone number

### File: `src/lib/config.ts`

```ts
export const PHONE = '0327041340';
```

Change the number here — it automatically updates in the location cards and the footer.

---

## Social media links

### File: `src/lib/config.ts`

```ts
export const SOCIALS = [
  { name: 'Facebook', href: 'https://facebook.com/YOUR_PAGE', emoji: '📘' },
  { name: 'Instagram', href: 'https://instagram.com/YOUR_HANDLE', emoji: '📸' },
  { name: 'Threads', href: 'https://threads.net/@YOUR_HANDLE', emoji: '🧵' },
  { name: 'Zalo', href: 'https://zalo.me/YOUR_ID', emoji: '💬' }
];
```

Update the `href` values. The same list is used in both the footer and contact section.

---

## After any change

```bash
# Preview locally
npm run dev

# Deploy to Cloudflare
npm run deploy
```

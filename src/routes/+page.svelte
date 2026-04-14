<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Cat, Location } from '$lib/types';
	import CatSlider from '$lib/components/CatSlider.svelte';
	import LocationCard from '$lib/components/LocationCard.svelte';
	import CatDetailModal from '$lib/components/CatDetailModal.svelte';
	import SocialIcon from '$lib/components/SocialIcon.svelte';
	import PhotoLightbox from '$lib/components/PhotoLightbox.svelte';
	import { PHONE, PHONE_HREF, SOCIALS } from '$lib/config';

	interface CafePhoto {
		src: string;
		alt: { vi: string; en: string };
	}

	interface Props {
		data: {
			cats: Cat[];
			locations: Location[];
			cafePhotos: CafePhoto[];
			lang: string;
		};
	}

	let { data }: Props = $props();

	const featuredCats = $derived(data.cats.filter((c) => c.featured));

	let modalOpen = $state(false);
	let modalStartIndex = $state(0);

	function openModal(index: number) {
		modalStartIndex = index;
		modalOpen = true;
	}

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
</script>

<svelte:head>
	<title>Tiệm cà phê mèo Jennymiaw | Jennymiaw Pet Cafe Hà Nội</title>
	<meta
		name="description"
		content="Tiệm cà phê mèo Jennymiaw tại Hà Nội — thư giãn cùng hơn 30 bé mèo đáng yêu, thưởng thức đồ uống và snack không giới hạn."
	/>
	<meta property="og:title" content="Tiệm cà phê mèo Jennymiaw" />
	<meta
		property="og:description"
		content="Vui chơi cùng hơn 30 bé mèo, thưởng thức đồ uống & snack không giới hạn tại Hà Nội."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Hero -->
<section
	class="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-pink via-background to-mint"
>
	<div class="z-10 px-4 py-20 text-center">
		<p class="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
			Tiệm cà phê mèo
		</p>
		<h1 class="mb-4 text-5xl font-bold text-text sm:text-6xl md:text-7xl">Jennymiaw</h1>
		<p class="mx-auto mb-10 max-w-md text-lg text-text-muted">
			{m.hero_tagline()}
		</p>
		<div class="flex flex-col justify-center gap-3 sm:flex-row">
			<a
				href="#cats"
				class="rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
			>
				{m.hero_cta_cats()} 🐱
			</a>
			<a
				href="#locations"
				class="rounded-full border-2 border-primary px-8 py-3.5 font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white"
			>
				{m.hero_cta_locations()} 📍
			</a>
		</div>
	</div>
	<div class="absolute top-10 left-10 text-5xl opacity-15 select-none -rotate-15">🐾</div>
	<div class="absolute right-10 bottom-10 text-5xl opacity-15 select-none rotate-10">🐾</div>
	<div class="absolute top-1/2 left-6 text-3xl opacity-10 select-none">🐾</div>
	<div class="absolute top-1/3 right-10 text-4xl opacity-10 select-none rotate-20">🐾</div>
</section>

<!-- About -->
<section id="about" class="py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-4 text-center text-3xl font-bold text-text sm:text-4xl">{m.about_title()}</h2>
		<p class="mx-auto mb-12 max-w-2xl text-center text-text-muted">{m.about_description()}</p>
		<div class="grid gap-6 sm:grid-cols-3">
			{#each [
				{ emoji: '🎟️', title: m.about_ticket_title(), desc: m.about_ticket_desc() },
				{ emoji: '🐱', title: m.about_cats_title(), desc: m.about_cats_desc() },
				{ emoji: '☕', title: m.about_cozy_title(), desc: m.about_cozy_desc() }
			] as card}
				<div class="rounded-2xl bg-cream p-6 text-center shadow-sm transition-shadow hover:shadow-md">
					<div class="mb-3 text-4xl">{card.emoji}</div>
					<h3 class="mb-2 font-bold text-text">{card.title}</h3>
					<p class="text-sm text-text-muted">{card.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Cat Slider -->
<section id="cats" class="bg-cream py-20">
	<div class="mx-auto max-w-6xl px-6">
		<h2 class="mb-10 text-center text-3xl font-bold text-text sm:text-4xl">
			{m.cats_section_title()}
		</h2>
		<CatSlider cats={featuredCats} onCatClick={(_, i) => openModal(i)} />
		<div class="mt-10 text-center">
			<a
				href="/gallery"
				class="inline-block rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
			>
				{m.cats_view_all()} →
			</a>
		</div>
	</div>
</section>

<!-- Cafe Photos -->
<section id="cafe-photos" class="py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-4 text-center text-3xl font-bold text-text sm:text-4xl">{m.cafe_photos_title()}</h2>
		<p class="mx-auto mb-10 max-w-2xl text-center text-text-muted">{m.cafe_photos_subtitle()}</p>
		<div class="columns-2 gap-3 md:columns-3 lg:columns-4">
			{#each data.cafePhotos as photo, i}
				<button
					type="button"
					onclick={() => { lightboxIndex = i; lightboxOpen = true; }}
					class="mb-3 w-full overflow-hidden rounded-2xl bg-pink/20 break-inside-avoid cursor-pointer"
				>
					<img
						src={photo.src}
						alt={photo.alt[data.lang as 'vi' | 'en'] ?? photo.alt.vi}
						class="w-full object-cover transition-transform duration-300 hover:scale-105"
						loading="lazy"
						onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex'; }}
					/>
					<div class="hidden aspect-video items-center justify-center text-4xl text-text-muted/30">📷</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Locations -->
<section id="locations" class="py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-text sm:text-4xl">
			{m.location_section_title()}
		</h2>
		<div class="grid gap-8 md:grid-cols-2">
			{#each data.locations as location}
				<LocationCard {location} />
			{/each}
		</div>
	</div>
</section>

<!-- Contact -->
<section id="contact" class="bg-cream py-20">
	<div class="mx-auto max-w-6xl px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold text-text sm:text-4xl">{m.contact_title()}</h2>
		<p class="mx-auto mb-10 max-w-md text-text-muted">{m.contact_subtitle()}</p>

		<a
			href={PHONE_HREF}
			class="mb-10 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-white px-6 py-3 font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-md"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
			</svg>
			{PHONE}
		</a>

		<div class="flex justify-center gap-4">
			{#each SOCIALS as social}
				<a
					href={social.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={social.name}
					class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-md text-text-muted"
				>
					<SocialIcon icon={social.icon} class="h-5 w-5" />
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Cat Detail Modal -->
{#if modalOpen}
	<CatDetailModal
		cats={featuredCats}
		locations={data.locations}
		startIndex={modalStartIndex}
		onClose={() => (modalOpen = false)}
	/>
{/if}

<!-- Cafe Photo Lightbox -->
{#if lightboxOpen}
	<PhotoLightbox
		photos={data.cafePhotos}
		startIndex={lightboxIndex}
		lang={data.lang}
		onClose={() => (lightboxOpen = false)}
	/>
{/if}

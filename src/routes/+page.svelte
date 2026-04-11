<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Cat, Location } from '$lib/types';

	interface Props {
		data: {
			cats: Cat[];
			locations: Location[];
			lang: string;
		};
	}

	let { data }: Props = $props();

	const featuredCats = $derived(data.cats.filter((c) => c.featured));
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
	class="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-pink via-background to-mint"
>
	<div class="z-10 px-4 py-20 text-center">
		<p class="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
			Tiệm cà phê mèo
		</p>
		<h1 class="mb-4 text-4xl font-bold text-text sm:text-5xl md:text-6xl">Jennymiaw</h1>
		<p class="mx-auto mb-8 max-w-md text-lg text-text-muted">
			{m.hero_tagline()}
		</p>
		<div class="flex flex-col justify-center gap-3 sm:flex-row">
			<a
				href="/gallery"
				class="rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
			>
				{m.hero_cta_cats()}
			</a>
			<a
				href="#locations"
				class="rounded-full border-2 border-primary px-8 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
			>
				{m.hero_cta_locations()}
			</a>
		</div>
	</div>
	<!-- Decorative paw prints -->
	<div class="absolute top-10 left-10 text-4xl opacity-20 select-none">🐾</div>
	<div class="absolute right-10 bottom-10 text-4xl opacity-20 select-none">🐾</div>
	<div class="absolute top-1/2 left-4 text-2xl opacity-10 select-none">🐾</div>
	<div class="absolute top-1/3 right-8 text-3xl opacity-10 select-none">🐾</div>
</section>

<!-- About -->
<section id="about" class="py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-4 text-center text-3xl font-bold text-text">{m.about_title()}</h2>
		<p class="mx-auto mb-12 max-w-2xl text-center text-text-muted">{m.about_description()}</p>

		<div class="grid gap-6 sm:grid-cols-3">
			{#each [
				{ emoji: '🎟️', title: m.about_ticket_title(), desc: m.about_ticket_desc() },
				{ emoji: '🐱', title: m.about_cats_title(), desc: m.about_cats_desc() },
				{ emoji: '☕', title: m.about_cozy_title(), desc: m.about_cozy_desc() }
			] as card}
				<div
					class="rounded-2xl bg-cream p-6 text-center shadow-sm transition-shadow hover:shadow-md"
				>
					<div class="mb-3 text-4xl">{card.emoji}</div>
					<h3 class="mb-2 font-bold text-text">{card.title}</h3>
					<p class="text-sm text-text-muted">{card.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Cats (placeholder — CatSlider will go here in Phase 2) -->
<section id="cats" class="bg-cream py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-text">{m.cats_section_title()}</h2>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{#each featuredCats as cat}
				<div class="overflow-hidden rounded-2xl bg-white shadow-sm">
					<div class="flex aspect-square items-center justify-center bg-pink/30 text-6xl">🐱</div>
					<div class="p-3">
						<p class="font-bold text-text">{cat.name}</p>
						<p class="text-xs text-text-muted">{cat.breed}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 text-center">
			<a
				href="/gallery"
				class="inline-block rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
			>
				{m.cats_view_all()}
			</a>
		</div>
	</div>
</section>

<!-- Locations -->
<section id="locations" class="py-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-10 text-center text-3xl font-bold text-text">{m.location_section_title()}</h2>

		<div class="grid gap-8 md:grid-cols-2">
			{#each data.locations as location}
				<div class="overflow-hidden rounded-2xl bg-cream shadow-sm">
					<!-- Map embed placeholder -->
					<div class="flex h-48 items-center justify-center bg-mint/30 text-4xl">🗺️</div>
					<div class="p-6">
						<h3 class="mb-1 text-lg font-bold text-text">
							{location.name[data.lang as 'vi' | 'en'] ?? location.name.vi}
						</h3>
						<p class="mb-1 text-sm text-text-muted">
							📍 {location.address[data.lang as 'vi' | 'en'] ?? location.address.vi}
						</p>
						<p class="mb-1 text-sm text-text-muted">
							🕐 {location.hours[data.lang as 'vi' | 'en'] ?? location.hours.vi}
						</p>
						<p class="text-sm text-text-muted">📞 {location.phone}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Contact / Social -->
<section id="contact" class="bg-cream py-20">
	<div class="mx-auto max-w-xl px-4 text-center">
		<h2 class="mb-3 text-3xl font-bold text-text">{m.contact_title()}</h2>
		<p class="mb-8 text-text-muted">{m.contact_subtitle()}</p>
		<div class="flex justify-center gap-4 text-3xl">
			<a
				href="https://facebook.com/jennymiawpetcafe"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Facebook"
				class="transition-transform hover:scale-110">📘</a
			>
			<a
				href="https://instagram.com/jennymiawpetcafe"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"
				class="transition-transform hover:scale-110">📸</a
			>
			<a
				href="https://threads.net/@jennymiawpetcafe"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Threads"
				class="transition-transform hover:scale-110">🧵</a
			>
			<a
				href="https://zalo.me/jennymiaw"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Zalo"
				class="transition-transform hover:scale-110">💬</a
			>
		</div>
	</div>
</section>

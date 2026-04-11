<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Cat, Location } from '$lib/types';
	import CatSlider from '$lib/components/CatSlider.svelte';
	import LocationCard from '$lib/components/LocationCard.svelte';
	import CatDetailModal from '$lib/components/CatDetailModal.svelte';
	import { PHONE, PHONE_HREF, SOCIALS } from '$lib/config';

	interface Props {
		data: {
			cats: Cat[];
			locations: Location[];
			lang: string;
		};
	}

	let { data }: Props = $props();

	const featuredCats = $derived(data.cats.filter((c) => c.featured));

	// Modal state
	let modalOpen = $state(false);
	let modalStartIndex = $state(0);
	let modalCats = $state<Cat[]>([]);

	function openModal(cats: Cat[], index: number) {
		modalCats = cats;
		modalStartIndex = index;
		modalOpen = true;
	}
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
				href="/gallery"
				class="rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg"
			>
				{m.hero_cta_cats()} 🐱
			</a>
			<a
				href="#locations"
				class="rounded-full border-2 border-primary px-8 py-3.5 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:-translate-y-0.5"
			>
				{m.hero_cta_locations()} 📍
			</a>
		</div>
	</div>

	<!-- Decorative paw prints -->
	<div class="absolute top-10 left-10 text-5xl opacity-15 select-none rotate-[-15deg]">🐾</div>
	<div class="absolute right-10 bottom-10 text-5xl opacity-15 select-none rotate-[10deg]">🐾</div>
	<div class="absolute top-1/2 left-6 text-3xl opacity-10 select-none">🐾</div>
	<div class="absolute top-1/3 right-10 text-4xl opacity-10 select-none rotate-[20deg]">🐾</div>
	<div class="absolute bottom-24 left-1/4 text-2xl opacity-10 select-none">🐾</div>
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

		<CatSlider
			cats={featuredCats}
			onCatClick={(cat, i) => openModal(featuredCats, i)}
		/>

		<div class="mt-10 text-center">
			<a
				href="/gallery"
				class="inline-block rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg"
			>
				{m.cats_view_all()} →
			</a>
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

<!-- Contact / Social -->
<section id="contact" class="bg-cream py-20">
	<div class="mx-auto max-w-xl px-4 text-center">
		<h2 class="mb-3 text-3xl font-bold text-text sm:text-4xl">{m.contact_title()}</h2>
		<p class="mb-8 text-text-muted">{m.contact_subtitle()}</p>

		<div class="flex justify-center gap-5">
			{#each SOCIALS as social}
				<a
					href={social.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={social.name}
					class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
				>
					{social.emoji}
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Cat Detail Modal -->
{#if modalOpen}
	<CatDetailModal
		cats={modalCats}
		startIndex={modalStartIndex}
		onClose={() => (modalOpen = false)}
	/>
{/if}

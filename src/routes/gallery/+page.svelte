<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Cat, Location } from '$lib/types';
	import CatDetailModal from '$lib/components/CatDetailModal.svelte';

	interface Props {
		data: {
			cats: Cat[];
			locations: Location[];
			lang: string;
		};
	}

	let { data }: Props = $props();

	let modalOpen = $state(false);
	let modalStartIndex = $state(0);

	function openModal(index: number) {
		modalStartIndex = index;
		modalOpen = true;
	}
</script>

<svelte:head>
	<title>Các bé mèo | Tiệm cà phê mèo Jennymiaw</title>
	<meta
		name="description"
		content="Gặp gỡ hơn 30 bé mèo đáng yêu tại Tiệm cà phê mèo Jennymiaw Hà Nội."
	/>
</svelte:head>

<section class="py-16">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 text-center">
			<h1 class="mb-3 text-4xl font-bold text-text">{m.gallery_title()}</h1>
			<p class="text-text-muted">{m.gallery_subtitle()}</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.cats as cat, i}
				<button
					type="button"
					onclick={() => openModal(i)}
					class="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
				>
					<div class="relative aspect-square overflow-hidden bg-pink/30">
						{#if cat.avatar}
							<img
								src={cat.avatar}
								alt={cat.name}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center text-5xl">🐱</div>
						{/if}
					</div>
					<div class="p-3">
						<p class="font-bold text-text">{cat.name}</p>
						<p class="text-xs text-text-muted">{cat.breed}</p>
						<p class="mt-1 line-clamp-2 text-xs text-text-muted">
							{cat.description[data.lang as 'vi' | 'en'] ?? cat.description.vi}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if modalOpen}
	<CatDetailModal
		cats={data.cats}
		locations={data.locations}
		startIndex={modalStartIndex}
		onClose={() => (modalOpen = false)}
	/>
{/if}

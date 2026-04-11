<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { Cat } from '$lib/types';

	interface Props {
		data: {
			cats: Cat[];
			lang: string;
		};
	}

	let { data }: Props = $props();
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

		<!-- Cat grid — CatDetailModal will be wired up in Phase 3 -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.cats as cat}
				<button
					type="button"
					class="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-shadow hover:shadow-md"
					onclick={() => {
						/* open modal — Phase 3 */
					}}
				>
					<div
						class="flex aspect-square items-center justify-center bg-pink/30 text-6xl transition-transform group-hover:scale-105"
					>
						🐱
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

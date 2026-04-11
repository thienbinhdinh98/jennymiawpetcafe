<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { EmblaCarouselType } from 'embla-carousel';
	import type { Cat } from '$lib/types';

	interface Props {
		cats: Cat[];
		onCatClick: (cat: Cat, index: number) => void;
	}

	let { cats, onCatClick }: Props = $props();

	let viewportEl: HTMLDivElement = $state()!;
	let embla: EmblaCarouselType | null = null;
	let canScrollPrev = $state(false);
	let canScrollNext = $state(false);
	let isCentered = $state(false);

	function updateButtons() {
		if (!embla) return;
		canScrollPrev = embla.canScrollPrev();
		canScrollNext = embla.canScrollNext();
	}

	onMount(async () => {
		const { default: EmblaCarousel } = await import('embla-carousel');
		embla = EmblaCarousel(viewportEl, {
			loop: false,
			align: 'start',
			dragFree: true,
			slidesToScroll: 1
		});
		embla.on('select', updateButtons);
		embla.on('reInit', updateButtons);
		embla.on('init', () => {
			// If all slides fit without scrolling, destroy Embla and center instead
			if (!embla!.canScrollNext()) {
				embla!.destroy();
				embla = null;
				isCentered = true;
			} else {
				updateButtons();
			}
		});
	});

	onDestroy(() => {
		embla?.destroy();
	});
</script>

{#snippet catCard(cat: Cat, i: number)}
	<button
		type="button"
		onclick={() => onCatClick(cat, i)}
		class="group w-40 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:w-48"
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
		</div>
	</button>
{/snippet}

{#if isCentered}
	<div class="flex flex-wrap justify-center gap-4 px-1 py-2">
		{#each cats as cat, i}
			{@render catCard(cat, i)}
		{/each}
	</div>
{:else}
	<div class="relative">
		{#if canScrollPrev}
			<button
				onclick={() => embla?.scrollPrev()}
				aria-label="Trước"
				class="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		{/if}

		<div bind:this={viewportEl} class="overflow-hidden">
			<div class="flex gap-4 px-1 py-2">
				{#each cats as cat, i}
					{@render catCard(cat, i)}
				{/each}
			</div>
		</div>

		{#if canScrollNext}
			<button
				onclick={() => embla?.scrollNext()}
				aria-label="Tiếp"
				class="absolute top-1/2 right-0 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { EmblaCarouselType } from 'embla-carousel';
	import type { Cat } from '$lib/types';
	import { getLocale } from '$lib/paraglide/runtime';

	interface Props {
		cats: Cat[];
		startIndex: number;
		onClose: () => void;
	}

	let { cats, startIndex, onClose }: Props = $props();

	const lang = getLocale() as 'vi' | 'en';

	// svelte-ignore state_referenced_locally
	let currentIndex = $state(startIndex);

	const currentCat = $derived(cats[currentIndex]);
	const prevCat = $derived(currentIndex > 0 ? cats[currentIndex - 1] : null);
	const nextCat = $derived(currentIndex < cats.length - 1 ? cats[currentIndex + 1] : null);
	const allPhotos = $derived(
		currentCat.avatar ? [currentCat.avatar, ...currentCat.photos] : currentCat.photos
	);

	function go(index: number) {
		if (index >= 0 && index < cats.length) currentIndex = index;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') go(currentIndex - 1);
		if (e.key === 'ArrowRight') go(currentIndex + 1);
	}

	let photoViewportEl: HTMLDivElement | undefined = $state();
	let photoEmbla: EmblaCarouselType | null = $state(null);

	async function initPhotoEmbla() {
		photoEmbla?.destroy();
		if (!photoViewportEl) return;
		const { default: EmblaCarousel } = await import('embla-carousel');
		photoEmbla = EmblaCarousel(photoViewportEl, { loop: false });
	}

	$effect(() => {
		currentIndex;
		setTimeout(initPhotoEmbla, 0);
	});

	onDestroy(() => photoEmbla?.destroy());
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
	onclick={(e) => e.target === e.currentTarget && onClose()}
>
	<!-- Close -->
	<button
		onclick={onClose}
		aria-label="Đóng"
		class="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>

	<!-- 3-slot row: prev | current | next -->
	<div class="relative flex w-full items-center justify-center">

		<!-- Prev cat (left, shadowed) -->
		{#if prevCat}
			<button
				onclick={() => go(currentIndex - 1)}
				aria-label="Mèo trước"
				class="absolute left-0 z-10 w-[22vw] max-w-[110px] opacity-50 transition-opacity hover:opacity-70 sm:left-4"
			>
				<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
					<div class="aspect-square overflow-hidden bg-pink/30">
						{#if prevCat.avatar}
							<img src={prevCat.avatar} alt={prevCat.name} class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full items-center justify-center text-4xl">🐱</div>
						{/if}
					</div>
					<div class="p-2">
						<p class="truncate text-xs font-bold text-text">{prevCat.name}</p>
					</div>
				</div>
				<div class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-transparent to-black/60"></div>
			</button>
		{/if}

		<!-- Current cat (center, focused) -->
		<div class="z-20 w-[80vw] max-w-[360px]">
			<div class="flex max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-background shadow-2xl">

				<!-- Photos -->
				<div class="relative shrink-0 bg-pink/20">
					{#if allPhotos.length > 0}
						<div bind:this={photoViewportEl} class="overflow-hidden">
							<div class="flex">
								{#each allPhotos as photo}
									<div class="min-w-0 shrink-0 basis-full">
										<img src={photo} alt={currentCat.name} class="h-56 w-full object-cover sm:h-64" />
									</div>
								{/each}
							</div>
						</div>
						{#if allPhotos.length > 1}
							<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
								{#each allPhotos as _, i}
									<button
										onclick={() => photoEmbla?.scrollTo(i)}
										class="h-1.5 rounded-full transition-all {i === (photoEmbla?.selectedScrollSnap() ?? 0) ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}"
										aria-label="Ảnh {i + 1}"
									></button>
								{/each}
							</div>
						{/if}
					{:else}
						<div class="flex h-56 items-center justify-center text-7xl sm:h-64">🐱</div>
					{/if}
				</div>

				<!-- Info -->
				<div class="flex-1 overflow-y-auto p-5">
					<h2 class="text-xl font-bold text-text">{currentCat.name}</h2>
					<p class="mb-2 text-sm font-semibold text-primary">{currentCat.breed}</p>
					<p class="text-sm leading-relaxed text-text-muted">
						{currentCat.description[lang] ?? currentCat.description.vi}
					</p>
				</div>

				<!-- Counter -->
				<div class="shrink-0 border-t border-pink/30 px-5 py-2.5 text-center">
					<span class="text-xs text-text-muted">{currentIndex + 1} / {cats.length}</span>
				</div>
			</div>
		</div>

		<!-- Next cat (right, shadowed) -->
		{#if nextCat}
			<button
				onclick={() => go(currentIndex + 1)}
				aria-label="Mèo tiếp theo"
				class="absolute right-0 z-10 w-[22vw] max-w-[110px] opacity-50 transition-opacity hover:opacity-70 sm:right-4"
			>
				<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
					<div class="aspect-square overflow-hidden bg-pink/30">
						{#if nextCat.avatar}
							<img src={nextCat.avatar} alt={nextCat.name} class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full items-center justify-center text-4xl">🐱</div>
						{/if}
					</div>
					<div class="p-2">
						<p class="truncate text-xs font-bold text-text">{nextCat.name}</p>
					</div>
				</div>
				<div class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-l from-transparent via-transparent to-black/60"></div>
			</button>
		{/if}

	</div>
</div>

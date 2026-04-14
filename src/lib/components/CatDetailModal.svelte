<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import type { EmblaCarouselType } from 'embla-carousel';
	import type { Cat, Location } from '$lib/types';
	import { getLocale } from '$lib/paraglide/runtime';

	interface Props {
		cats: Cat[];
		locations?: Location[];
		startIndex: number;
		onClose: () => void;
	}

	let { cats, locations = [], startIndex, onClose }: Props = $props();

	const lang = getLocale() as 'vi' | 'en';

	// svelte-ignore state_referenced_locally
	let currentIndex = $state(startIndex);

	const currentCat = $derived(cats[currentIndex]);
	const prevCat = $derived(currentIndex > 0 ? cats[currentIndex - 1] : null);
	const nextCat = $derived(currentIndex < cats.length - 1 ? cats[currentIndex + 1] : null);
	const allPhotos = $derived(
		currentCat.avatar ? [currentCat.avatar, ...currentCat.photos] : currentCat.photos
	);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') navigateTo(currentIndex - 1);
		if (e.key === 'ArrowRight') navigateTo(currentIndex + 1);
	}

	// Lock background scroll — also block touchmove on backdrop (passive: false needed
	// because Svelte template handlers are passive and e.preventDefault() is ignored)
	let backdropEl: HTMLDivElement | undefined = $state();
	let infoEl: HTMLDivElement | undefined = $state();

	onMount(() => { document.body.style.overflow = 'hidden'; });
	onDestroy(() => { document.body.style.overflow = ''; photoEmbla?.destroy(); });

	$effect(() => {
		if (!backdropEl) return;
		const blockScroll = (e: TouchEvent) => {
			// Allow native scroll inside the info/description area
			if (infoEl && infoEl.contains(e.target as Node)) return;
			e.preventDefault();
		};
		backdropEl.addEventListener('touchmove', blockScroll, { passive: false });
		return () => backdropEl!.removeEventListener('touchmove', blockScroll);
	});

	// Photo carousel (arrows + dots, drag disabled so horizontal swipe navigates cats)
	let photoViewportEl: HTMLDivElement | undefined = $state();
	let photoEmbla: EmblaCarouselType | null = $state(null);
	let photoIndex = $state(0);

	async function initPhotoEmbla() {
		photoEmbla?.destroy();
		photoIndex = 0;
		if (!photoViewportEl) return;
		const { default: EmblaCarousel } = await import('embla-carousel');
		photoEmbla = EmblaCarousel(photoViewportEl, { loop: false, watchDrag: false });
		photoEmbla.on('select', () => { photoIndex = photoEmbla!.selectedScrollSnap(); });
	}

	$effect(() => {
		currentIndex;
		setTimeout(initPhotoEmbla, 0);
	});

	// Unified swipe — horizontal = navigate cats, vertical = dismiss
	let dragX = $state(0);     // follows finger during drag (center card only)
	let animOffsetX = $state(0); // shared offset applied to ALL cards during navigation
	let transitioning = $state(false);
	let swipeDir = $state<'h' | null>(null);
	let touchStartX = 0;
	let touchStartY = 0;
	let busy = false;
	let filmstripEl: HTMLDivElement | undefined = $state();

	// Width: each thumb 48px + 8px gap, 16px padding, capped at 10 cats
	const filmCount = $derived(Math.min(cats.length, 10));
	const filmstripWidth = $derived(filmCount * 56 + 8);

	$effect(() => {
		currentIndex;
		if (!filmstripEl) return;
		const active = filmstripEl.querySelector('[data-active="true"]') as HTMLElement | null;
		active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	});

	function onTouchStart(e: TouchEvent) {
		if (busy) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		dragX = 0;
		swipeDir = null;
		transitioning = false;
	}

	function onTouchMove(e: TouchEvent) {
		if (busy) return;
		const dx = e.touches[0].clientX - touchStartX;
		const dy = e.touches[0].clientY - touchStartY;
		if (!swipeDir) {
			if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
			// Only commit to horizontal swipe; ignore vertical
			if (Math.abs(dy) >= Math.abs(dx)) return;
			swipeDir = 'h';
		}
		e.preventDefault();
		dragX = dx;
	}

	async function navigateTo(targetIndex: number) {
		if (busy || targetIndex === currentIndex) return;
		if (targetIndex < 0 || targetIndex >= cats.length) {
			transitioning = true; dragX = 0; return;
		}
		busy = true;
		dragX = 0;

		const W = window.innerWidth;
		const isMobile = W < 640;
		const goingNext = targetIndex > currentIndex;
		const dir = goingNext ? -1 : 1;

		// On desktop: slide by the distance between card centers so cards swap places.
		// On mobile: no side cards, just slide center card off screen.
		const delta = isMobile ? W : (0.365 * W + 16);

		// Slide all cards together
		transitioning = true;
		animOffsetX = dir * delta;
		await new Promise(r => setTimeout(r, 230));

		// Snap new cards into natural positions instantly
		transitioning = false;
		currentIndex = targetIndex;
		animOffsetX = 0;

		setTimeout(() => { busy = false; }, 50);
	}

	function onTouchEnd() {
		if (busy) return;
		const THRESHOLD = 60;
		if (swipeDir === 'h') {
			if (dragX < -THRESHOLD && nextCat) navigateTo(currentIndex + 1);
			else if (dragX > THRESHOLD && prevCat) navigateTo(currentIndex - 1);
			else { transitioning = true; dragX = 0; animOffsetX = 0; }
		}
		swipeDir = null;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={backdropEl}
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

	<!-- Left arrow -->
	{#if prevCat}
		<button
			onclick={() => navigateTo(currentIndex - 1)}
			aria-label="Mèo trước"
			class="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40 sm:left-4"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	{/if}

	<!-- Right arrow -->
	{#if nextCat}
		<button
			onclick={() => navigateTo(currentIndex + 1)}
			aria-label="Mèo tiếp theo"
			class="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40 sm:right-4"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}

	<!-- Filmstrip — absolute at bottom, width fits cats (max 10) -->
	<div
		bind:this={filmstripEl}
		class="scrollbar-hide absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 backdrop-blur-sm"
		style="width: min({filmstripWidth}px, calc(100vw - 1rem))"
	>
		{#each cats as cat, i}
			<button
				onclick={() => navigateTo(i)}
				data-active={i === currentIndex ? 'true' : 'false'}
				aria-label={cat.name}
				class="relative shrink-0 overflow-hidden rounded-lg transition-all {i === currentIndex ? 'scale-110 opacity-100 ring-2 ring-white ring-offset-1' : 'opacity-50 hover:opacity-80'}"
				style="width: 48px; height: 48px;"
			>
				{#if cat.avatar}
					<img src={cat.avatar} alt={cat.name} class="h-full w-full object-cover" />
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-white/20 text-lg">🐱</div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- 3-slot row: prev | center | next -->
	<div class="flex w-full items-center justify-center gap-3 px-14 sm:gap-4 sm:px-16">

		<!-- Prev cat — desktop only -->
		{#if prevCat}
			<button
				onclick={() => navigateTo(currentIndex - 1)}
				aria-label="Mèo trước"
				aria-hidden="true"
				tabindex="-1"
				class="relative hidden shrink-0 opacity-50 hover:opacity-75 sm:block sm:w-[18vw]"
			style="transform: translateX({animOffsetX}px); transition: {transitioning ? 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none'}"
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
		{:else}
			<div class="hidden shrink-0 sm:block sm:w-[18vw]"></div>
		{/if}

		<!-- Center column: card only -->
		<div class="z-20 flex w-full flex-col items-center sm:w-[55vw] sm:shrink-0">

			<!-- Card -->
			<div
				class="w-full flex max-h-[72vh] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl sm:rounded-3xl sm:h-[55vw] sm:max-h-[88vh]"
				style="transform: translateX({dragX + animOffsetX}px); opacity: {Math.max(0, 1 - Math.abs(dragX) / 400)}; transition: {transitioning ? 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s ease' : 'none'}"
				ontouchstart={onTouchStart}
				ontouchmove={onTouchMove}
				ontouchend={onTouchEnd}
			>
				<!-- Photos -->
				<div class="relative shrink-0 bg-pink/20 sm:shrink sm:basis-[60%] sm:min-h-0">
					{#if allPhotos.length > 0}
						<div bind:this={photoViewportEl} class="overflow-hidden h-full">
							<div class="flex h-full">
								{#each allPhotos as photo}
									<div class="min-w-0 shrink-0 basis-full flex items-center justify-center h-64 sm:h-full">
										<img
											src={photo}
											alt={currentCat.name}
											class="max-h-full max-w-full object-contain"
											onerror={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.style.display = 'none';
												(img.nextElementSibling as HTMLElement).style.display = 'flex';
											}}
										/>
										<div class="hidden h-full w-full items-center justify-center text-5xl text-text-muted/30">📷</div>
									</div>
								{/each}
							</div>
						</div>
						{#if allPhotos.length > 1}
							<!-- Prev photo arrow -->
							{#if photoIndex > 0}
								<button
									onclick={() => photoEmbla?.scrollPrev()}
									aria-label="Ảnh trước"
									class="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
							{/if}
							<!-- Next photo arrow -->
							{#if photoIndex < allPhotos.length - 1}
								<button
									onclick={() => photoEmbla?.scrollNext()}
									aria-label="Ảnh tiếp theo"
									class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
									</svg>
								</button>
							{/if}
							<!-- Dots -->
							<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
								{#each allPhotos as _, i}
									<button
										onclick={() => photoEmbla?.scrollTo(i)}
										class="h-1.5 rounded-full transition-all {i === photoIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}"
										aria-label="Ảnh {i + 1}"
									></button>
								{/each}
							</div>
						{/if}
					{:else}
						<div class="flex h-64 items-center justify-center text-7xl sm:h-full">🐱</div>
					{/if}
				</div>

				<!-- Info -->
				<div bind:this={infoEl} class="flex-1 min-h-0 overflow-y-auto p-5 sm:basis-[40%] sm:flex-none">
					<h2 class="text-xl font-bold text-text">{currentCat.name}</h2>
					<p class="mb-1 text-sm font-semibold text-primary">{currentCat.breed}</p>
					{#if currentCat.location}
						{@const loc = locations.find(l => l.id === currentCat.location)}
						{#if loc}
							<p class="mb-3 flex items-center gap-1 text-xs text-text-muted">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								{loc.name[lang] ?? loc.name.vi}
							</p>
						{/if}
					{/if}
					<p class="text-sm leading-relaxed text-text-muted">
						{currentCat.description[lang] ?? currentCat.description.vi}
					</p>
				</div>
			</div>

		</div>

		<!-- Next cat — desktop only -->
		{#if nextCat}
			<button
				onclick={() => navigateTo(currentIndex + 1)}
				aria-label="Mèo tiếp theo"
				aria-hidden="true"
				tabindex="-1"
				class="relative hidden shrink-0 opacity-50 hover:opacity-75 sm:block sm:w-[18vw]"
			style="transform: translateX({animOffsetX}px); transition: {transitioning ? 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none'}"
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
		{:else}
			<div class="hidden shrink-0 sm:block sm:w-[18vw]"></div>
		{/if}

	</div>
</div>

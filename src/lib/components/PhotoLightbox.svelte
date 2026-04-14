<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';

	interface Photo {
		src: string;
		alt: { vi: string; en: string };
	}

	interface Props {
		photos: Photo[];
		startIndex: number;
		lang: string;
		onClose: () => void;
	}

	let { photos, startIndex, lang, onClose }: Props = $props();

	// svelte-ignore state_referenced_locally
	let currentIndex = $state(startIndex);

	onMount(() => { document.body.style.overflow = 'hidden'; });
	onDestroy(() => { document.body.style.overflow = ''; });

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') navigateTo(currentIndex - 1);
		if (e.key === 'ArrowRight') navigateTo(currentIndex + 1);
	}

	// Filmstrip
	let filmstripEl: HTMLDivElement | undefined = $state();
	$effect(() => {
		currentIndex;
		if (!filmstripEl) return;
		const active = filmstripEl.querySelector('[data-active="true"]') as HTMLElement | null;
		active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	});
	const filmCount = $derived(Math.min(photos.length, 10));
	const filmstripWidth = $derived(filmCount * 56 + 8);

	// Navigation with conveyor animation
	let animOffsetX = $state(0);
	let transitioning = $state(false);
	let busy = false;

	async function navigateTo(targetIndex: number) {
		if (busy || targetIndex === currentIndex) return;
		if (targetIndex < 0 || targetIndex >= photos.length) return;
		busy = true;
		dragX = 0;
		dragY = 0;

		const W = window.innerWidth;
		const goingNext = targetIndex > currentIndex;
		const dir = goingNext ? -1 : 1;

		transitioning = true;
		animOffsetX = dir * W;
		await new Promise(r => setTimeout(r, 220));

		transitioning = false;
		currentIndex = targetIndex;
		animOffsetX = 0;

		setTimeout(() => { busy = false; }, 50);
	}

	// Swipe
	let dragX = $state(0);
	let dragY = $state(0);
	let swipeDir = $state<'h' | 'v' | null>(null);
	let touchStartX = 0;
	let touchStartY = 0;

	function onTouchStart(e: TouchEvent) {
		if (busy) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		dragX = 0; dragY = 0; swipeDir = null;
		transitioning = false;
	}

	function onTouchMove(e: TouchEvent) {
		if (busy) return;
		const dx = e.touches[0].clientX - touchStartX;
		const dy = e.touches[0].clientY - touchStartY;
		if (!swipeDir) {
			if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
			swipeDir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
		}
		e.preventDefault();
		if (swipeDir === 'h') dragX = dx;
		else dragY = dy;
	}

	function onTouchEnd() {
		if (busy) return;
		const THRESHOLD = 60;
		if (swipeDir === 'h') {
			if (dragX < -THRESHOLD && currentIndex < photos.length - 1) navigateTo(currentIndex + 1);
			else if (dragX > THRESHOLD && currentIndex > 0) navigateTo(currentIndex - 1);
			else { transitioning = true; dragX = 0; }
		} else if (swipeDir === 'v') {
			if (Math.abs(dragY) > 200) onClose();
			else { transitioning = true; dragY = 0; }
		}
		swipeDir = null;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
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
	{#if currentIndex > 0}
		<button
			onclick={() => navigateTo(currentIndex - 1)}
			aria-label="Ảnh trước"
			class="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40 sm:left-4"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	{/if}

	<!-- Right arrow -->
	{#if currentIndex < photos.length - 1}
		<button
			onclick={() => navigateTo(currentIndex + 1)}
			aria-label="Ảnh tiếp theo"
			class="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40 sm:right-4"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}

	<!-- Photo -->
	<div
		class="relative max-h-[80vh] max-w-[90vw] sm:max-w-[80vw] pointer-events-none"
		style="transform: translate({dragX + animOffsetX}px, {dragY}px); opacity: {Math.max(0, 1 - (Math.abs(dragX) + Math.abs(dragY)) / 400)}; transition: {transitioning ? 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s ease' : 'none'}"
	>
		<img
			src={photos[currentIndex].src}
			alt={photos[currentIndex].alt[lang as 'vi' | 'en'] ?? photos[currentIndex].alt.vi}
			class="max-h-[80vh] max-w-[90vw] rounded-xl object-contain sm:max-w-[80vw]"
		/>
	</div>

	<!-- Filmstrip -->
	<div
		bind:this={filmstripEl}
		class="scrollbar-hide absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 backdrop-blur-sm"
		style="width: min({filmstripWidth}px, calc(100vw - 1rem))"
	>
		{#each photos as photo, i}
			<button
				onclick={() => navigateTo(i)}
				data-active={i === currentIndex ? 'true' : 'false'}
				aria-label="Ảnh {i + 1}"
				class="relative shrink-0 overflow-hidden rounded-lg transition-all {i === currentIndex ? 'scale-110 opacity-100 ring-2 ring-white ring-offset-1' : 'opacity-50 hover:opacity-80'}"
				style="width: 48px; height: 48px;"
			>
				<img src={photo.src} alt={photo.alt[lang as 'vi' | 'en'] ?? photo.alt.vi} class="h-full w-full object-cover" />
			</button>
		{/each}
	</div>
</div>

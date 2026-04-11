<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/#about', label: () => m.nav_home() },
		{ href: '/gallery', label: () => m.nav_gallery() },
		{ href: '/#locations', label: () => m.nav_locations() },
		{ href: '/#contact', label: () => m.nav_contact() }
	];
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 border-b border-pink/50 bg-background/90 backdrop-blur-sm"
>
	<nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2 font-bold text-primary">
			<span class="text-xl">🐱</span>
			<span class="text-sm leading-tight sm:text-base">
				Jennymiaw<br class="hidden sm:block" />
				<span class="text-xs font-medium text-text-muted sm:text-sm">Pet Cafe</span>
			</span>
		</a>

		<!-- Desktop nav -->
		<div class="hidden items-center gap-6 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-semibold text-text-muted transition-colors hover:text-primary"
				>
					{link.label()}
				</a>
			{/each}
			<LanguageSwitcher />
		</div>

		<!-- Mobile: lang switcher + hamburger -->
		<div class="flex items-center gap-3 md:hidden">
			<LanguageSwitcher />
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-cream"
				aria-label="Menu"
			>
				<span
					class="block h-0.5 w-5 bg-text transition-transform"
					class:rotate-45={mobileOpen}
					class:translate-y-2={mobileOpen}
				></span>
				<span
					class="block h-0.5 w-5 bg-text transition-opacity"
					class:opacity-0={mobileOpen}
				></span>
				<span
					class="block h-0.5 w-5 bg-text transition-transform"
					class:-rotate-45={mobileOpen}
					class:-translate-y-2={mobileOpen}
				></span>
			</button>
		</div>
	</nav>

	<!-- Mobile dropdown -->
	{#if mobileOpen}
		<div class="border-t border-pink/50 bg-background px-4 py-4 md:hidden">
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="block py-2.5 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
				>
					{link.label()}
				</a>
			{/each}
		</div>
	{/if}
</header>

<!-- Spacer for fixed header -->
<div class="h-16"></div>

<script lang="ts">
	import type { Location } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PHONE, PHONE_HREF } from '$lib/config';

	interface Props {
		location: Location;
	}

	let { location }: Props = $props();

	const lang = getLocale() as 'vi' | 'en';
</script>

<div class="overflow-hidden rounded-2xl bg-cream shadow-sm">
	<div class="relative h-52 w-full">
		<iframe
			src={location.mapEmbedUrl}
			width="100%"
			height="100%"
			style="border:0;"
			allowfullscreen
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			title={location.name[lang] ?? location.name.vi}
			class="absolute inset-0 h-full w-full"
		></iframe>
	</div>

	<div class="p-5">
		<h3 class="mb-3 text-lg font-bold text-text">{location.name[lang] ?? location.name.vi}</h3>

		<div class="space-y-2 text-sm text-text-muted">
			<div class="flex items-start gap-2">
				<span class="mt-0.5 shrink-0">📍</span>
				<span>{location.address[lang] ?? location.address.vi}</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="shrink-0">🕐</span>
				<span>{location.hours[lang] ?? location.hours.vi}</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="shrink-0">📞</span>
				<a href={PHONE_HREF} class="hover:text-primary">{PHONE}</a>
			</div>
		</div>

		<a
			href={location.mapsUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
		>
			{m.location_directions()}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</a>
	</div>
</div>

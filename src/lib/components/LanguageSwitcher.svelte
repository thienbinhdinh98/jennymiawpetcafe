<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { localizeHref, locales, getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
</script>

{#each locales as locale}
	{#if locale !== getLocale()}
		<a
			href={localizeHref(page.url.pathname, { locale }) as Pathname}
			class="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
		>
			{m.lang_switch()}
		</a>
	{/if}
{/each}

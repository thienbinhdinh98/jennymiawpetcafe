<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
</script>

{#each locales as locale}
	{#if locale !== getLocale()}
		<button
			onclick={() => setLocale(locale)}
			class="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
		>
			{m.lang_switch()}
		</button>
	{/if}
{/each}

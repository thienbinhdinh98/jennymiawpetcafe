<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { SOCIALS } from '$lib/config';
</script>

<footer class="border-t border-pink/50 bg-cream">
	<div class="mx-auto max-w-6xl px-4 py-10">
		<div class="flex flex-col items-center gap-6 text-center">
			<div>
				<p class="text-lg font-bold text-primary">Tiệm cà phê mèo Jennymiaw</p>
				<p class="text-sm text-text-muted">Jennymiaw Pet Cafe</p>
			</div>

			<div class="flex gap-4">
				{#each SOCIALS as social}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.name}
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-md"
					>
						{social.emoji}
					</a>
				{/each}
			</div>

			<p class="text-xs text-text-muted">
				© {new Date().getFullYear()} Jennymiaw Pet Cafe. {m.footer_rights()}.
			</p>
		</div>
	</div>
</footer>

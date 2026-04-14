<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<footer class="border-t border-pink/50 bg-cream">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<div class="flex flex-col items-center gap-3 text-center">
			<div>
				<p class="text-lg font-bold text-primary">Tiệm cà phê mèo Jennymiaw</p>
				<p class="text-sm text-text-muted">Jennymiaw Pet Cafe</p>
			</div>
			<p class="text-xs text-text-muted">
				© {new Date().getFullYear()} Jennymiaw Pet Cafe. {m.footer_rights()}.
			</p>
		</div>
	</div>
</footer>

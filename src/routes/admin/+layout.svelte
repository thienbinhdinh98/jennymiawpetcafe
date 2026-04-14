<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-background">
	<header class="border-b border-pink/50 bg-cream px-6 py-4">
		<a href="/admin" class="text-lg font-bold text-primary">🐱 Jennymiaw Admin</a>
	</header>
	<main class="mx-auto max-w-5xl px-4 py-8">
		{@render children()}
	</main>
</div>

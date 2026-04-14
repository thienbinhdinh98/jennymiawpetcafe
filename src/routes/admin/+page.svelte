<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold text-text">Danh sách mèo</h1>
	<a
		href="/admin/cat/new"
		class="rounded-full bg-primary px-5 py-2 font-semibold text-white transition-colors hover:bg-primary-dark"
	>
		+ Thêm mèo mới
	</a>
</div>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each data.cats as cat}
		<div class="overflow-hidden rounded-2xl bg-white shadow-sm">
			<div class="aspect-square overflow-hidden bg-pink/20">
				{#if cat.avatar}
					<img src={cat.avatar} alt={cat.name} class="h-full w-full object-cover" />
				{:else}
					<div class="flex h-full w-full items-center justify-center text-5xl">🐱</div>
				{/if}
			</div>
			<div class="p-4">
				<p class="font-bold text-text">{cat.name}</p>
				<p class="text-sm text-text-muted">{cat.breed}</p>
				{#if cat.featured}
					<span class="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Trang chủ</span>
				{/if}
				<div class="mt-3 flex gap-2">
					<a
						href="/admin/cat/{cat.id}"
						class="flex-1 rounded-lg bg-cream px-3 py-1.5 text-center text-sm font-semibold text-text transition-colors hover:bg-pink/30"
					>
						Chỉnh sửa
					</a>
					<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm(`Xoá ${cat.name}?`)) e.preventDefault(); }}>
						<input type="hidden" name="id" value={cat.id} />
						<button
							type="submit"
							class="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100"
						>
							Xoá
						</button>
					</form>
				</div>
			</div>
		</div>
	{/each}
</div>

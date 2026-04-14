<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	// svelte-ignore state_referenced_locally
	const cat = $state(data.cat as Record<string, any> | null);
	const isNew = !cat;

	let avatarPreview = $state<string | null>(cat?.avatar ?? null);
	let avatarPath = $state<string>(cat?.avatar ?? '');
	let photos = $state<string[]>(cat?.photos ?? []);

	// Upload state
	let uploading = $state(false);
	let uploadProgress = $state(0);
	let uploadLabel = $state('');
	let avatarPickerOpen = $state(false);
	let avatarInputEl = $state<HTMLInputElement | null>(null);
	let photosInputEl = $state<HTMLInputElement | null>(null);

	function openAvatarPicker() {
		avatarPickerOpen = true;
		avatarInputEl!.value = '';
		avatarInputEl!.click();
		// Reset "Đang mở..." if user cancels the picker (window regains focus)
		const onFocus = () => { avatarPickerOpen = false; window.removeEventListener('focus', onFocus); };
		window.addEventListener('focus', onFocus);
	}

	function uploadFile(file: File, onProgress: (p: number) => void, type: 'avatar' | 'photo' = 'photo'): Promise<string> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const fd = new FormData();
			fd.append('file', file);
			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
			};
			xhr.onload = () => {
				if (xhr.status === 200) resolve(JSON.parse(xhr.responseText).path);
				else reject(new Error('Upload thất bại'));
			};
			xhr.onerror = () => reject(new Error('Upload thất bại'));
			xhr.open('POST', `/admin/upload?type=${type}`);
			xhr.send(fd);
		});
	}

	async function handleAvatarChange(e: Event) {
		avatarPickerOpen = false;
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		uploadLabel = 'Đang tải ảnh đại diện...';
		uploadProgress = 0;
		try {
			avatarPath = await uploadFile(file, (p) => (uploadProgress = p), 'avatar');
			avatarPreview = avatarPath;
		} finally {
			uploading = false;
			uploadProgress = 0;
		}
	}

	function openPhotosPicker() {
		photosInputEl!.value = '';
		photosInputEl!.click();
	}

	async function handlePhotosChange(e: Event) {
		const files = Array.from((e.target as HTMLInputElement).files ?? []);
		if (!files.length) return;
		uploading = true;
		uploadProgress = 0;
		for (let i = 0; i < files.length; i++) {
			uploadLabel = `Đang tải ${i + 1}/${files.length}: ${files[i].name}`;
			try {
				const path = await uploadFile(files[i], (p) => {
					uploadProgress = ((i + p / 100) / files.length) * 100;
				});
				photos = [...photos, path];
			} catch {
				// skip failed files
			}
		}
		uploading = false;
		uploadProgress = 0;
		(e.target as HTMLInputElement).value = '';
	}
</script>

<div class="mb-6 flex items-center gap-3">
	<a href="/admin" class="text-text-muted hover:text-primary">← Quay lại</a>
	<h1 class="text-2xl font-bold text-text">{isNew ? 'Thêm mèo mới' : `Chỉnh sửa: ${cat?.name}`}</h1>
</div>

<form method="POST" action="?/save" class="space-y-6">
	{#if form?.error}
		<p class="rounded-xl bg-red-50 p-3 text-sm text-red-600">{form.error}</p>
	{/if}

	<!-- Basic info -->
	<div class="rounded-2xl bg-white p-6 shadow-sm space-y-4">
		<h2 class="font-bold text-text">Thông tin cơ bản</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label class="mb-1 block text-sm font-semibold text-text" for="name">Tên *</label>
				<input id="name" name="name" type="text" required value={cat?.name ?? ''} class="w-full rounded-xl border border-pink/50 bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-semibold text-text" for="breed">Giống</label>
				<input id="breed" name="breed" type="text" value={cat?.breed ?? ''} class="w-full rounded-xl border border-pink/50 bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none" />
			</div>
		</div>
		<div>
			<label class="mb-1 block text-sm font-semibold text-text" for="desc_vi">Mô tả (Tiếng Việt)</label>
			<textarea id="desc_vi" name="desc_vi" rows="3" class="w-full rounded-xl border border-pink/50 bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none">{cat?.description?.vi ?? ''}</textarea>
		</div>
		<div>
			<label class="mb-1 block text-sm font-semibold text-text" for="desc_en">Mô tả (English)</label>
			<textarea id="desc_en" name="desc_en" rows="3" class="w-full rounded-xl border border-pink/50 bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none">{cat?.description?.en ?? ''}</textarea>
		</div>
		<div class="flex flex-wrap gap-6">
			<div>
				<label class="mb-1 block text-sm font-semibold text-text" for="location">Chi nhánh</label>
				<select id="location" name="location" class="rounded-xl border border-pink/50 bg-background px-4 py-2.5 text-text focus:border-primary focus:outline-none">
					<option value="location-1" selected={cat?.location === 'location-1'}>Chi nhánh 1 — 1144 Đường Láng</option>
					<option value="location-2" selected={cat?.location === 'location-2'}>Chi nhánh 2 — 86 Nguyễn Ngọc Nại</option>
				</select>
			</div>
			<div class="flex items-end pb-1">
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" name="featured" checked={cat?.featured ?? false} class="h-4 w-4 accent-primary" />
					<span class="text-sm font-semibold text-text">Hiển thị trên trang chủ</span>
				</label>
			</div>
		</div>
	</div>

	<!-- Avatar -->
	<div class="rounded-2xl bg-white p-6 shadow-sm space-y-3">
		<h2 class="font-bold text-text">Ảnh đại diện</h2>
		{#if avatarPreview}
			<img src={avatarPreview} alt="avatar" class="h-32 w-32 rounded-xl object-cover" />
		{/if}
		<input type="hidden" name="existing_avatar" value={avatarPath} />
		<input bind:this={avatarInputEl} type="file" accept="image/*" class="sr-only" onchange={handleAvatarChange} />
		<button
			type="button"
			onclick={openAvatarPicker}
			class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white {avatarPickerOpen ? 'opacity-60' : ''}"
		>
			📷 {avatarPickerOpen ? 'Đang mở...' : avatarPreview ? 'Thay ảnh đại diện' : 'Chọn ảnh đại diện'}
		</button>
	</div>

	<!-- Extra photos -->
	<div class="rounded-2xl bg-white p-6 shadow-sm space-y-3">
		<h2 class="font-bold text-text">Ảnh bổ sung</h2>
		{#if photos.length > 0}
			<div class="flex flex-wrap gap-3">
				{#each photos as photo, i}
					<div class="relative">
						<img src={photo} alt="photo {i + 1}" class="h-24 w-24 rounded-xl object-cover" />
						<input type="hidden" name="existing_photos" value={photo} />
						<button
							type="button"
							onclick={() => { photos = photos.filter((_, j) => j !== i); }}
							class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
						>×</button>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Upload progress -->
		{#if uploading}
			<div class="space-y-1">
				<p class="text-xs text-text-muted">{uploadLabel}</p>
				<div class="h-2 w-full overflow-hidden rounded-full bg-pink/30">
					<div
						class="h-full rounded-full bg-primary transition-all duration-200"
						style="width: {uploadProgress}%"
					></div>
				</div>
			</div>
		{/if}

		<input bind:this={photosInputEl} type="file" accept="image/*" multiple class="sr-only" onchange={handlePhotosChange} />
		<button
			type="button"
			onclick={openPhotosPicker}
			disabled={uploading}
			class="inline-flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
		>
			🖼️ Thêm ảnh
		</button>
	</div>

	<div class="flex flex-wrap gap-3">
		<button
			type="submit"
			disabled={uploading}
			class="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
		>
			Lưu
		</button>
		{#if isNew}
			<button
				type="submit"
				formaction="?/saveNext"
				disabled={uploading}
				class="rounded-xl border border-primary px-6 py-2.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
			>
				Lưu & Thêm mới
			</button>
		{:else if data.nextCatId}
			<button
				type="submit"
				formaction="?/saveNext"
				disabled={uploading}
				class="rounded-xl border border-primary px-6 py-2.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
			>
				Lưu & Tiếp →
			</button>
		{/if}
		<a href="/admin" class="rounded-xl bg-cream px-6 py-2.5 font-semibold text-text transition-colors hover:bg-pink/30">
			Huỷ
		</a>
	</div>
</form>

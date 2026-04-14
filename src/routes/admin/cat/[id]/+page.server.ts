import { redirect, fail } from '@sveltejs/kit';
import { getCat, listCats, saveCat, savePhoto, slugify } from '$lib/server/fs-admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') return { cat: null, nextCatId: null };
	const cat = await getCat(params.id);
	if (!cat) redirect(302, '/admin');
	const cats = await listCats();
	const idx = cats.findIndex((c: { id: string }) => c.id === params.id);
	const nextCatId = cats[idx + 1]?.id ?? null;
	return { cat, nextCatId };
};

async function buildCatData(request: Request, params: { id: string }) {
	const data = await request.formData();
	const name = (data.get('name') as string)?.trim();
	if (!name) return { error: 'Tên không được để trống.' };

	const id = params.id === 'new' ? slugify(name) || `cat-${Date.now()}` : params.id;
	const existingAvatar = data.get('existing_avatar') as string;
	let avatar = existingAvatar || null;

	const existingPhotos = (data.getAll('existing_photos') as string[]).filter(Boolean);
	const photos = [...existingPhotos];

	const catData = {
		name,
		breed: (data.get('breed') as string)?.trim() ?? '',
		description: {
			vi: (data.get('desc_vi') as string)?.trim() ?? '',
			en: (data.get('desc_en') as string)?.trim() ?? ''
		},
		avatar,
		photos,
		featured: data.get('featured') === 'on',
		location: (data.get('location') as string) ?? 'location-1'
	};

	return { id, catData };
}

export const actions: Actions = {
	save: async ({ request, params }) => {
		const result = await buildCatData(request, params);
		if ('error' in result) return fail(400, { error: result.error });
		await saveCat(result.id, result.catData);
		redirect(302, '/admin');
	},

	saveNext: async ({ request, params }) => {
		const result = await buildCatData(request, params);
		if ('error' in result) return fail(400, { error: result.error });
		await saveCat(result.id, result.catData);
		if (params.id === 'new') {
			redirect(302, '/admin/cat/new');
		}
		const cats = await listCats();
		const idx = cats.findIndex((c: { id: string }) => c.id === result.id);
		const nextId = cats[idx + 1]?.id;
		redirect(302, nextId ? `/admin/cat/${nextId}` : '/admin');
	}
};

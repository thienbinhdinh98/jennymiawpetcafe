import { redirect } from '@sveltejs/kit';
import { listCats, deleteCat } from '$lib/server/fs-admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const cats = await listCats();
		return { cats };
	} catch (e) {
		console.error('[admin] listCats failed:', e);
		return { cats: [] };
	}
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		if (id) await deleteCat(id);
		redirect(302, '/admin');
	}
};

import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { savePhoto } from '$lib/server/fs-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	if (!dev) error(404, 'Not found');
	const data = await request.formData();
	const file = data.get('file') as File;
	if (!file || file.size === 0) error(400, 'No file provided');
	const type = url.searchParams.get('type') === 'avatar' ? 'avatar' : 'photo';
	const path = await savePhoto(file, type);
	return json({ path });
};

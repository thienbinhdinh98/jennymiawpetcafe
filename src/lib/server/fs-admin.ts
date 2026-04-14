import { readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

const CATS_DIR = join(process.cwd(), 'src/lib/data/cats');
const PHOTOS_DIR = join(process.cwd(), 'static/cats');

export async function listCats() {
	const files = await readdir(CATS_DIR);
	const cats = await Promise.all(
		files.filter((f) => f.endsWith('.json')).map(async (f) => {
			const id = f.replace('.json', '');
			const data = JSON.parse(await readFile(join(CATS_DIR, f), 'utf-8'));
			return { id, ...data };
		})
	);
	return cats.sort((a: { name: string }, b: { name: string }) =>
		a.name.localeCompare(b.name, 'vi')
	);
}

export async function getCat(id: string) {
	try {
		const data = JSON.parse(await readFile(join(CATS_DIR, `${id}.json`), 'utf-8'));
		return { id, ...data };
	} catch {
		return null;
	}
}

export async function saveCat(id: string, data: object) {
	await writeFile(join(CATS_DIR, `${id}.json`), JSON.stringify(data, null, 2));
}

export async function deleteCat(id: string) {
	await unlink(join(CATS_DIR, `${id}.json`));
}

export async function savePhoto(file: File, type: 'avatar' | 'photo' = 'photo'): Promise<string> {
	await mkdir(PHOTOS_DIR, { recursive: true });
	const filename = `${randomUUID()}.webp`;
	const buffer = Buffer.from(await file.arrayBuffer());
	const pipeline = sharp(buffer).rotate(); // auto-rotate from EXIF
	if (type === 'avatar') {
		pipeline.resize(400, 400, { fit: 'cover', position: 'centre' });
	} else {
		pipeline.resize(1200, undefined, { fit: 'inside', withoutEnlargement: true });
	}
	pipeline.webp({ quality: 85 });
	await writeFile(join(PHOTOS_DIR, filename), await pipeline.toBuffer());
	return `/cats/${filename}`;
}

export function slugify(name: string): string {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/u, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

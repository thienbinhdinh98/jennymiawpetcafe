import { readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const REPO_ROOT = process.cwd();
const CATS_DIR = join(REPO_ROOT, 'src/lib/data/cats');
const PHOTOS_DIR = join(REPO_ROOT, 'static/cats');

// Only these paths are staged, so unrelated working-tree changes are never committed.
const TRACKED_PATHS = ['src/lib/data/cats', 'static/cats'];

// Serialize git operations so rapid saves (e.g. "Save & Next") can't interleave.
let gitQueue: Promise<unknown> = Promise.resolve();

async function runGitPush(message: string) {
	const git = (args: string[]) => execFileAsync('git', args, { cwd: REPO_ROOT });
	await git(['add', '--', ...TRACKED_PATHS]);
	// Nothing staged → nothing to do (e.g. a no-op re-save).
	const { stdout } = await git(['diff', '--cached', '--name-only']);
	if (!stdout.trim()) return;
	await git(['commit', '-m', message]);
	try {
		await git(['push']);
	} catch {
		// Remote moved (someone/something else pushed) → rebase and retry once.
		await git(['pull', '--rebase']);
		await git(['push']);
	}
}

/**
 * Commit the cat data/photo dirs and push to GitHub, which triggers the
 * Cloudflare Pages rebuild. Fire-and-forget: queued and non-blocking so the
 * admin request returns immediately; failures are logged, not surfaced.
 */
export function autoPush(message: string) {
	gitQueue = gitQueue
		.then(() => runGitPush(message))
		.catch((e) => console.error('[admin] auto-push failed:', e));
	return gitQueue;
}

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
	autoPush(`content: save cat ${id} (via admin)`);
}

export async function deleteCat(id: string) {
	await unlink(join(CATS_DIR, `${id}.json`));
	autoPush(`content: delete cat ${id} (via admin)`);
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

import type { Cat } from '$lib/types';

// Each file in src/lib/data/cats/ is one cat — filename (without .json) becomes the id
const catModules = import.meta.glob<{ default: Omit<Cat, 'id'> }>(
	'/src/lib/data/cats/*.json',
	{ eager: true }
);

export const cats: Cat[] = Object.entries(catModules)
	.map(([path, mod]) => {
		const id = path.split('/').pop()!.replace('.json', '');
		return { id, ...mod.default };
	})
	.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

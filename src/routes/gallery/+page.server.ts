import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import catsData from '$lib/data/cats.json';

export const load: PageServerLoad = () => {
	return {
		cats: catsData,
		lang: getLocale()
	};
};

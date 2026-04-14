import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import { cats } from '$lib/server/data';
import locationsData from '$lib/data/locations.json';

export const load: PageServerLoad = () => {
	return {
		cats,
		locations: locationsData,
		lang: getLocale()
	};
};

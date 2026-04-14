import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import { cats } from '$lib/server/data';
import locationsData from '$lib/data/locations.json';
import cafePhotosData from '$lib/data/cafe-photos.json';

export const load: PageServerLoad = () => {
	return {
		cats,
		locations: locationsData,
		cafePhotos: cafePhotosData,
		lang: getLocale()
	};
};

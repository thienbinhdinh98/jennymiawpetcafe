import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import catsData from '$lib/data/cats.json';
import locationsData from '$lib/data/locations.json';
import cafePhotosData from '$lib/data/cafe-photos.json';

export const load: PageServerLoad = () => {
	return {
		cats: catsData,
		locations: locationsData,
		cafePhotos: cafePhotosData,
		lang: getLocale()
	};
};

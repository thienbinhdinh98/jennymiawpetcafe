export interface BilingualText {
	vi: string;
	en: string;
}

export interface Cat {
	id: string;
	name: string;
	breed: string;
	description: BilingualText;
	avatar: string;
	photos: string[];
	featured: boolean;
	/** When true, the cat is kept in the data but not shown on the public site. */
	hidden?: boolean;
	location: string;
}

export interface Location {
	id: string;
	name: BilingualText;
	address: BilingualText;
	hours: BilingualText;
	mapsUrl: string;
	mapEmbedUrl: string;
}

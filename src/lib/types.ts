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
	location: string;
}

export interface Location {
	id: string;
	name: BilingualText;
	address: BilingualText;
	phone: string;
	hours: BilingualText;
	mapEmbedUrl: string;
}

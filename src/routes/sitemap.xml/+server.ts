import type { RequestHandler } from '@sveltejs/kit';

const SITE_URL = 'https://jennymiaw-catcafe.vn';

const pages = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/gallery', priority: '0.8', changefreq: 'weekly' },
];

export const GET: RequestHandler = () => {
	const urls = pages
		.map(
			({ path, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};

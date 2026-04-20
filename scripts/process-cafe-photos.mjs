import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const INPUT_DIR = 'static/cafe/raw';
const OUTPUT_DIR = 'static/cafe';

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(INPUT_DIR))
	.filter((f) => /\.(jpe?g|png|webp|heic|avif)$/i.test(f))
	.sort();

if (files.length === 0) {
	console.log(`No images found in ${INPUT_DIR}`);
	process.exit(0);
}

console.log(`Processing ${files.length} photos...`);

for (let i = 0; i < files.length; i++) {
	const input = join(INPUT_DIR, files[i]);
	const output = join(OUTPUT_DIR, `${i + 1}.webp`);
	await sharp(input)
		.rotate()
		.resize(1200, undefined, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 85 })
		.toFile(output);
	console.log(`  ${files[i]} → ${i + 1}.webp`);
}

console.log(`Done. Update cafe-photos.json if you have more/fewer than 8 photos.`);

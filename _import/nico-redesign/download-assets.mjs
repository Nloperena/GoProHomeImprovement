import fs from 'fs';
import path from 'path';

const assets = [
	{ target: 'public/logo.png', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/2019/02/SiteLogo.png?lossy=1&strip=1&webp=1' },
	{ target: 'public/logo-footer.png', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/2019/02/FooterLogo.png?lossy=1&strip=1&webp=1' },
	{ target: 'public/favicon.ico', url: 'https://goprohomeimprovements.com/favicon.ico' },
	{ target: 'public/images/hero/hero-1.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/slider-qm8p9c70ai5mkc08l76kuufwugqa2m363wyg8erhbs.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/hero/hero-2.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/IMG_6439-qm8p9c70ai5mkc08l76kuufwugqa2m363wyg8erhbs.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/drywall.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/betterbook_581212088ee56-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/movie-room.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/IMG_1547-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/tv-mount.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/WallMount-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/murals.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/IMG_7799-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/wallpaper.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/WallPaper-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/trim-molding.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/IMG_0138-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/demolition.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/Demolition1-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/power-washing.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/PowerWashingNew-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/services/painting.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/IMG_7777-qm8p9c6hck54icgumrvq7vqalrymseutrb4p5h029s.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/work/power-washing.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/OurWork1-qm8p9c6ki56yjy2mu0co5pt54t41ms8qkwwi71vcfw.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/work/movie-room.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/OurWork2-qm8p9c6ki56yjy2mu0co5pt54t41ms8qkwwi71vcfw.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/work/murals.jpg', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/bfi_thumb/OurWork3-qm8p9c6ki56yjy2mu0co5pt54t41ms8qkwwi71vcfw.jpg?lossy=1&strip=1&webp=1' },
	{ target: 'public/images/about/van.png', url: 'https://b1243227.smushcdn.com/1243227/wp-content/uploads/2019/02/VAN.png?lossy=1&strip=1&webp=1' }
];

async function download(url, dest) {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url} - ${res.status}`);
	const buffer = await res.arrayBuffer();
	fs.writeFileSync(dest, Buffer.from(buffer));
}

async function run() {
	for (const { target, url } of assets) {
		console.log(`Downloading ${target}...`);
		try {
			await download(url, path.join(process.cwd(), target));
			console.log(`Done ${target}`);
		} catch (e) {
			console.error(`Error ${target}:`, e.message);
		}
	}
}

run();
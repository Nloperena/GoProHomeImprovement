// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const redirectEntries = {
	'/our-work': '/projects/',
	'/service/power-washing/': '/services/pressure-washing-central-florida/',
	'/service/interior-exterior-painting/': '/services/painting-orlando/',
	'/service/demolition-work/': '/services/demolition/',
	'/service/trim-crown-molding/': '/services/trim-crown-molding/',
	'/service/wallpaper/': '/services/wallpaper-installation/',
	'/service/murals/': '/services/custom-murals/',
	'/service/wall-mount-tv-installations/': '/services/tv-mounting/',
	'/service/movie-room-designs-installations/': '/services/home-theater-design/',
	'/service/drywall-texture-install/': '/services/drywall-texture/',
};

/** @satisfies {import('astro').AstroConfig['redirects']} */
const redirects = Object.fromEntries(
	Object.entries(redirectEntries).map(([from, to]) => [
		from,
		{ status: 301, destination: to },
	]),
);

// https://astro.build/config
export default defineConfig({
	site: 'https://goprohomeimprovements.com',
	adapter: vercel(),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [sitemap()],

	redirects,
});

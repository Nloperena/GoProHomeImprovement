import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: 'https://goprohomeimprovements.com',
  output: 'static',
  redirects: {
    '/about/': '/about',
    '/our-work/': '/work',
    '/contact/': '/estimate',
    '/contact': '/estimate',
    '/service/power-washing/': '/services/power-washing',
    '/service/power-washing': '/services/power-washing',
    '/service/interior-exterior-painting/': '/services/interior-exterior-painting',
    '/service/interior-exterior-painting': '/services/interior-exterior-painting',
    '/service/demolition-work/': '/services/demolition',
    '/service/demolition-work': '/services/demolition',
    '/service/trim-crown-molding/': '/services/trim-crown-molding',
    '/service/trim-crown-molding': '/services/trim-crown-molding',
    '/service/wallpaper/': '/services/wallpaper',
    '/service/wallpaper': '/services/wallpaper',
    '/service/murals/': '/services/murals',
    '/service/murals': '/services/murals',
    '/service/wall-mount-tv-installations/': '/services/tv-mounting',
    '/service/wall-mount-tv-installations': '/services/tv-mounting',
    '/service/movie-room-designs-installations/': '/services/movie-rooms',
    '/service/movie-room-designs-installations': '/services/movie-rooms',
    '/service/drywall-texture-install/': '/services/drywall',
    '/service/drywall-texture-install': '/services/drywall',
  },
});

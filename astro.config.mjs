import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  site: 'https://goprohomeimprovements.com',
  output: 'hybrid',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/quote': '/estimate',
    '/quote/': '/estimate',
  },
});

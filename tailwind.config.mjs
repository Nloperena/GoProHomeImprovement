/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'gopro-orange': '#F15723',
        'gopro-charcoal': '#383A3C',
        'gopro-black': '#0F0F0F',
        'gopro-gray': '#6B7280',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Arial Narrow', 'Impact', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

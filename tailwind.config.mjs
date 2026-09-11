/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'gopro-orange': '#FF5C28',
        'gopro-charcoal': '#2B2B2B',
        'gopro-black': '#1A1A1A',
        'gopro-gray': '#6B7280',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Oswald', 'Impact', 'sans-serif'],
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

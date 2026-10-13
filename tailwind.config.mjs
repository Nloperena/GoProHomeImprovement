/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'gopro-orange': '#8C3B16',
        'gopro-copper': '#C4622D',
        'gopro-charcoal': '#1C1814',
        'gopro-black': '#100E0C',
        'gopro-plaster': '#F3EEE6',
        'gopro-paper': '#F8F5EF',
        'gopro-stone': '#E6DFD4',
        'gopro-ink': '#1A1612',
        'gopro-gray': '#4A433C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

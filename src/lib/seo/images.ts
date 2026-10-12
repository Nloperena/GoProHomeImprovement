/** Pixel sizes of files in public/images. Used for Open Graph image tags. */
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  '/images/bedroom-paint.jpg': { width: 1920, height: 1440 },
  '/images/crew-branded-shirt.jpg': { width: 1920, height: 1440 },
  '/images/demolition.jpg': { width: 365, height: 288 },
  '/images/drywall.jpg': { width: 600, height: 400 },
  '/images/finished-shower.jpg': { width: 2048, height: 1152 },
  '/images/footer-logo.png': { width: 290, height: 81 },
  '/images/harry-potter-room.jpg': { width: 624, height: 454 },
  '/images/logo.png': { width: 290, height: 97 },
  '/images/movie-room.jpg': { width: 1920, height: 1440 },
  '/images/nemo-mural.jpg': { width: 1920, height: 1440 },
  '/images/plank-tv-wall.jpg': { width: 1920, height: 1440 },
  '/images/power-washing.jpg': { width: 498, height: 402 },
  '/images/slider.jpg': { width: 1920, height: 835 },
  '/images/star-wars-theater.jpg': { width: 1920, height: 1440 },
  '/images/trim-navy-wall.jpg': { width: 1920, height: 1440 },
  '/images/van.png': { width: 498, height: 402 },
  '/images/wall-mount.jpg': { width: 498, height: 402 },
  '/images/wallpaper.jpg': { width: 498, height: 402 },
  '/images/wood-accent-wall.jpg': { width: 624, height: 454 },
  '/images/wood-floor.jpg': { width: 2048, height: 1536 },
};

export function imageDetails(src: string): { width: number; height: number; type: string } | undefined {
  const pathname = src.startsWith('http') ? new URL(src).pathname : src;
  const size = IMAGE_SIZES[pathname];
  if (!size) return undefined;
  const type = pathname.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return { ...size, type };
}

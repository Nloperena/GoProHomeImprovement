import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

describe('review visibility and layout', () => {
  const motion = source('src/scripts/home-motion.ts');
  const reveal = source('src/scripts/reveal-motion.ts');
  const css = [source('src/styles/global.css'), source('src/styles/reviews.css')].join('\n');
  const list = source('src/components/home/ReviewList.astro');
  const page = source('src/pages/reviews.astro');

  it('only hides .reveal when js is present, and never depends on GSAP to stay readable', () => {
    expect(source('src/layouts/BaseLayout.astro')).toContain("document.documentElement.classList.add('js')");
    expect(css).toContain('html.js .reveal:not(.is-in)');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(motion).not.toMatch(/gsap\.set\(\s*reveals,\s*\{\s*opacity:\s*0/);
    expect(reveal).toContain('ScrollTrigger.batch');
    expect(reveal).toContain('once: true');
    expect(reveal).toContain('ScrollTrigger.refresh');
    expect(source('src/pages/index.astro')).toContain('.catch(showReveals)');
  });

  it('clamps long reviews behind a Read more toggle and contains photo strips', () => {
    expect(list).toContain('data-review-more');
    expect(list).toContain('Read more');
    expect(list).toContain('review-photos');
    expect(list).toContain("Photo from ${review.author}'s Google review");
    expect(css).toContain('-webkit-line-clamp: 6');
    expect(css).toContain('overflow-x: auto');
    expect(css).toContain('overscroll-behavior-x: contain');
    expect(css).toContain('min-width: 0');
  });

  it('renders the same mapped reviews on the reviews page', () => {
    expect(page).toContain('ReviewList');
    expect(page).toContain('revealWithScroll');
    expect(page).toContain('What Kissimmee &amp; St. Cloud Homeowners Say About Mike');
  });
});

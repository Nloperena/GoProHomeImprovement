import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

describe('homepage contract', () => {
  const page = [
    'src/pages/index.astro',
    'src/components/home/HomeHero.astro',
    'src/components/home/ProofBand.astro',
    'src/components/home/BeforeAfter.astro',
    'src/components/home/ServiceGrid.astro',
    'src/components/home/PressureWash.astro',
    'src/components/home/Reviews.astro',
    'src/components/home/OwnerSplit.astro',
    'src/components/home/ProcessSteps.astro',
    'src/components/home/AreasBand.astro',
    'src/components/home/EstimateTicket.astro',
  ].map(source).join('\n');

  it('uses the requested title, description, and a single hero h1', () => {
    const index = source('src/pages/index.astro');
    expect(index).toContain('House Painting & Pressure Washing in Kissimmee, FL | Go Pro Home Improvements');
    expect(index).toContain('Owner-run since 2014, 5.0 on Google. Free estimates: (407) 244-6873.');
    expect(page.match(/<h1/g)).toHaveLength(1);
    expect(page).toContain('House Painting,');
    expect(page).toContain('Pressure Washing &amp;');
    expect(page).toContain('Handyman Work');
    expect(page).toContain('in Kissimmee, FL');
  });

  it('drops the wet-edge palette and the owner-on-every-job line', () => {
    expect(page.toLowerCase()).not.toContain('#e23b12');
    expect(page.toLowerCase()).not.toContain('#e7e0d2');
    expect(page).not.toContain('Owner on every job');
    expect(page).toContain('Owner-Run Since 2014');
    expect(page).not.toContain('AggregateRating');
  });

  it('posts the estimate form to the existing endpoint', () => {
    expect(source('src/components/home/EstimateTicket.astro')).toContain("fetch('/api/estimate'");
  });
});

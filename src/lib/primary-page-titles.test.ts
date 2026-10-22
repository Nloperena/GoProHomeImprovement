import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

describe('money-term title/H1 cannibalization', () => {
  it('gives each tracked term a unique primary title and hub H1', () => {
    expect(source('src/pages/services/drywall-repair-kissimmee.astro')).toContain(
      'title="Drywall Repair in Kissimmee, FL | Go Pro"'
    );
    expect(source('src/pages/services/drywall.astro')).toContain(
      'title="Drywall Repair & Installation | Central Florida"'
    );
    expect(source('src/pages/services/drywall.astro')).toContain(
      'Drywall Repair & Installation in Central Florida'
    );
    expect(source('src/pages/guides/drywall-repair-cost-kissimmee.astro')).toContain(
      'title="How Much Does Drywall Repair Cost in Kissimmee?"'
    );
    expect(source('src/pages/guides/drywall-repair-cost-kissimmee.astro')).toContain(
      'drywall repair in Kissimmee'
    );
    expect(source('src/pages/areas/kissimmee.astro')).toContain(
      'title="Kissimmee Home Improvement | Painting & Drywall | Go Pro"'
    );
    expect(source('src/pages/services/interior-exterior-painting.astro')).toContain(
      'title="Interior & Exterior Painting | Central Florida"'
    );
    expect(source('src/pages/services/movie-rooms.astro')).toContain(
      'title="Home Theater Installation | Central Florida | Go Pro"'
    );
    expect(source('src/pages/services/power-washing.astro')).toContain(
      'title="Power Washing in Central Florida | Go Pro"'
    );
  });

  it('does not replace 15+ years experience claims on edited service pages', () => {
    expect(source('src/pages/services/painting-kissimmee.astro')).toContain('over 15 years');
    expect(source('src/pages/services/power-washing.astro')).toContain('15+ years');
    expect(source('src/pages/areas/kissimmee.astro')).toContain('15+ years serving Osceola County');
  });
});

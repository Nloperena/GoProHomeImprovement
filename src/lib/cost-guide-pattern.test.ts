import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

describe('painting and pressure-washing cost guides', () => {
  const painting = source('src/pages/guides/how-much-does-painting-cost-kissimmee.astro');
  const pressure = source('src/pages/guides/pressure-washing-cost-kissimmee.astro');
  const drywall = source('src/pages/guides/drywall-repair-cost-kissimmee.astro');

  it('keep existing URLs and follow the drywall cost-line + related-services pattern', () => {
    expect(drywall).toContain('<strong>Cost:</strong>');
    expect(painting).toContain('<strong>Cost:</strong> $300-$900 per room');
    expect(pressure).toContain('<strong>Cost:</strong> $100-$400');
    expect(painting).toContain('painting in Kissimmee');
    expect(pressure).toContain('power washing in Kissimmee');
    expect(painting).toContain('/services/painting-kissimmee');
    expect(pressure).toContain('/services/power-washing-kissimmee');
  });

  it('keeps current prices and marks conflicts for Mike', () => {
    expect(painting).toContain('$300-$500');
    expect(painting).toContain('Mike to confirm');
    expect(pressure).toContain('$100-$175');
    expect(pressure).toContain('$175-$275');
    expect(pressure).toContain('Mike to confirm');
  });
});

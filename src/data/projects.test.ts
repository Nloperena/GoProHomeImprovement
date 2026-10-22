import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { trailerProject } from './projects';
import { reviews } from './reviews';

function source(path: string) {
  return readFileSync(resolve(path), 'utf8');
}

describe('trailer project page', () => {
  const page = source('src/pages/projects/trailer-remodel-st-cloud-lake-toho.astro');
  const victoria = reviews.find((review) => review.author === 'Victoria Cruz');

  it('uses only the Victoria Cruz review and her job photos', () => {
    expect(trailerProject.review).toBe(victoria);
    expect(trailerProject.photos).toEqual(victoria?.photos);
    expect(page).toContain('{review.text}');
    expect(page).toContain('Lake Toho fish camp');
    expect(page).toContain('/images/reviews/trailer-960.webp');
    expect(page).toContain('/images/reviews/trailer-tv-960.webp');
    expect(page).toContain('/images/reviews/trailer-sofa-960.webp');
  });

  it('does not invent a years-in-business claim or extra job photos', () => {
    expect(page).not.toMatch(/15\+ years|since 2014|over 15 years/i);
    expect(page).not.toContain('/images/reviews/bath');
    expect(page).not.toContain('/images/generated/');
  });

  it('links services, breadcrumbs, structured data, and /estimate', () => {
    expect(page).toContain('/services/painting-st-cloud');
    expect(page).toContain('/services/demolition-st-cloud');
    expect(page).toContain('/estimate');
    expect(page).toContain('BreadcrumbList');
    expect(page).toContain('@type": "Review"');
  });
});

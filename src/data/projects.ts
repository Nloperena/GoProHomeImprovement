import { reviews } from './reviews';

const victoria = reviews.find((review) => review.author === 'Victoria Cruz');

if (!victoria) {
  throw new Error('Trailer project requires Victoria Cruz review.');
}

/** Lake Toho trailer shots only (same job as body imgs). Not victoria-cruz-1..3 bathroom. */
const trailerPhotos = [
  '/images/reviews/trailer-960.webp',
  '/images/reviews/trailer-tv-960.webp',
  '/images/reviews/trailer-sofa-960.webp',
] as const;

/** Facts taken only from Victoria Cruz's Google review and her attached trailer job photos. */
export const trailerProject = {
  slug: 'trailer-remodel-st-cloud-lake-toho',
  path: '/projects/trailer-remodel-st-cloud-lake-toho/',
  title: 'Trailer Remodel in St. Cloud at Lake Toho Fish Camp',
  location: 'St. Cloud, Lake Toho fish camp',
  review: victoria,
  photos: trailerPhotos,
  relatedServices: [
    { name: 'Painting in St. Cloud', url: '/services/painting-st-cloud' },
    { name: 'Demolition in St. Cloud', url: '/services/demolition-st-cloud' },
    { name: 'Interior & Exterior Painting', url: '/services/interior-exterior-painting' },
  ],
} as const;

export const projects = [trailerProject] as const;

/**
 * Verified reviews only. Leave both exports empty until Nico supplies
 * Google reviews that can be quoted on the site.
 * Do not invent names, quotes, star ratings, or a review count.
 * AggregateRating schema is omitted while `reviewSummary` is null.
 */
export interface PublishedReview {
  author: string;
  body: string;
  /** 1–5, as shown on the source profile. */
  rating: number;
  /** ISO date (YYYY-MM-DD) when the review was published. */
  datePublished?: string;
}

export interface ReviewSummary {
  ratingValue: number;
  reviewCount: number;
}

export const reviews: PublishedReview[] = [];

export const reviewSummary: ReviewSummary | null = null;

/** Existing Google Business Profile link already used on /reviews. */
export const GOOGLE_REVIEW_URL = 'https://share.google/mxf7aR650uFCQUTab';

export function publishedReviews(): PublishedReview[] {
  return reviews.filter(
    (review) =>
      review.author.trim().length > 0 &&
      review.body.trim().length > 0 &&
      review.rating >= 1 &&
      review.rating <= 5,
  );
}

export function publishedSummary(): ReviewSummary | null {
  if (!reviewSummary) return null;
  if (reviewSummary.reviewCount < 1) return null;
  if (reviewSummary.ratingValue < 1 || reviewSummary.ratingValue > 5) return null;
  return reviewSummary;
}

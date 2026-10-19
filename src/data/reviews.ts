export interface Review {
  name: string;
  quote: string;
  place?: string;
}

/**
 * Real homeowner reviews only. Leave this empty until quotes are supplied.
 * Do not add ratings, counts, or placeholder quotes.
 */
export const reviews: Review[] = [];

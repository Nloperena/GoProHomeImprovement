export interface Review {
  author: string;
  rating: number;
  text: string;
  /** Year and month only, YYYY-MM. The day was not provided. */
  date: string;
  source: string;
  /** Optional photo paths. Omitted or empty means the review has no pictures yet. */
  photos?: string[];
}

export const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/1BKoCYktMNgEymU27';

/** Display label for the homepage stamp. Not structured data. */
export const GOOGLE_RATING_LABEL = '5.0 on Google';

/** Process-step copy that was stored on Nicholas Loperena's review by mistake. */
const PROCESS_LEAK = /call and you get mike/i;

/**
 * Verbatim review text, or null when the stored string is empty or is process copy.
 * Callers show photos and stars without inventing a replacement paragraph.
 */
export function reviewBody(text: string | undefined | null): string | null {
  const trimmed = text?.trim() ?? '';
  if (!trimmed || PROCESS_LEAK.test(trimmed)) return null;
  return trimmed;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatReviewMonth(date: string): string {
  const [year, month] = date.split('-');
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : date;
}

export const reviews: Review[] = [
  {
    author: 'JR Wysocki',
    rating: 5,
    source: 'Google',
    date: '2026-10',
    text: 'Happy to give Mike with GoPro a positive review. Have used his services several times. We contracted with him to do a full exterior paint. He did a lot of careful prep beforehand and it turned out great. Also have used his service to renovate a bathroom. He replaced all the tile, faucet/sink cabinet, and all fixtures, and again we were very pleased. Very random but he also helped us create large painted letters for a stage prop for a party. Have found him to be very professional, he is able to take care of a wide array of projects, and the work is done well and very reasonably priced. Will definitely use his services again.',
  },
  {
    author: 'Shirley De Jesus',
    rating: 5,
    source: 'Google',
    date: '2026-10',
    text: "We have used his services several times, and we couldn't be happier! He painted both the interior and exterior of our home and has also completed various handyman projects for us. His work is always excellent, and he takes pride in what he does. He is professional, reliable, pays attention to detail, and makes sure everything is done right. It's wonderful to have someone you can trust to do quality work. We have always been extremely satisfied and would highly recommend him!",
  },
  {
    author: 'Jose Vega',
    rating: 5,
    source: 'Google',
    date: '2026-10',
    text: 'Mike has installed garage ceiling storage racks. Govee outdoor lights. Installed transfer switch for home generator. TV and audio cable inside wall and resurfaced cracks in stucco of my home and repainted. Honest and All work done as agreed. My go to guy.',
  },
  {
    author: 'Brian Braddock',
    rating: 5,
    source: 'Google',
    date: '2026-09',
    text: 'Mike and his crew completed a brand new rental unit for me behind my house . They handled every aspect of the job from planning to construction to even the smallest details. They do amazing work and completed the job very quickly . If anyone is looking for a professional company for remodelling or renovation these are your guys. I highly recommend them.',
  },
  {
    author: 'Victoria Cruz',
    rating: 5,
    source: 'Google',
    date: '2026-10',
    photos: [
      '/images/reviews/trailer-960.webp',
      '/images/reviews/trailer-tv-960.webp',
      '/images/reviews/trailer-sofa-960.webp',
    ],
    text: 'GoPro remodeled our whole bathroom here in Lakeside Kissimmee. He did amazing work and now our guest bathroom and home has beautiful new floors and tiles. He also remodeled our trailer in the st. Cloud at the lake toho fish camp. He took out all the rugs, and cabinets we did not want and freed up a lot of space. He even replaced a rotted panel in our trailer on of our slides for a cheaper cost since we used him for both our home and home away from home. I checked it and it was sealed very well. He turned all the ugly brown cabinets to a beautiful white in our trailer and we have really nice brown wood flooring. The trailer looks super nice and looks like something you would buy brand new.',
  },
  {
    author: 'Nicholas Loperena',
    rating: 5,
    source: 'Google',
    date: '2026-09',
    text: "Mike, with GoPro has always done amazing work for FurniturePackagesUSA for over a decade and a half. He's remodeled hundreds of homes in the vacation rental space for us. I know when GoPro is on the job, it is going to be done correctly, so we really never have to sweat all the hurdles that come from other contractors. It's a pain in the butt to baby sit a contractor but I trust Mike with GoPro 100% of the time to get the job correctly. GoPro has been super reliable, and they don't cut corners. Mike is honest man, you'd be missing out by not calling him for you home or STR!",
  },
];

/**
 * Review-folder photos that could not be verified to a Google writer.
 * Keep them in the work showcase; do not attach them to a review card.
 */
export const UNVERIFIED_REVIEW_PHOTOS = [
  '/images/reviews/bb8-960.webp',
  '/images/reviews/moana-960.webp',
  '/images/reviews/bath-960.webp',
  '/images/reviews/shower-960.webp',
  '/images/reviews/vanity-960.webp',
  '/images/reviews/pool-960.webp',
  '/images/reviews/gazebo-960.webp',
] as const;


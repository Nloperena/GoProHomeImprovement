export interface HomeService {
  num: string;
  name: string;
  text: string;
  href: string;
  swatch: string;
  image: string;
  width: number;
  height: number;
  alt: string;
}

export interface HomeProject {
  num: string;
  title: string;
  detail: string;
  href: string;
  link: string;
  image: string;
  small: string;
  width: number;
  height: number;
  alt: string;
  tape: string;
}

export const services: HomeService[] = [
  {
    num: '01',
    name: 'Interior & exterior painting',
    text: 'Sprayed walls, ceilings, doors, and the outside of the house.',
    href: '/services/interior-exterior-painting',
    swatch: '#8d928f',
    image: '/images/home/paint-800.webp',
    width: 800,
    height: 600,
    alt: 'Bedroom with wide horizontal stripes in gray and warm silver paint',
  },
  {
    num: '02',
    name: 'Power washing',
    text: 'Wash-downs for the surfaces around the house.',
    href: '/services/power-washing',
    swatch: '#3e4a42',
    image: '/images/home/wash-480.webp',
    width: 480,
    height: 387,
    alt: 'Pressure washing a cobblestone surface',
  },
  {
    num: '03',
    name: 'Drywall',
    text: 'Hang, patch, tape, and finish so paint has a true surface.',
    href: '/services/drywall',
    swatch: '#d8d2c6',
    image: '/images/home/drywall-480.webp',
    width: 480,
    height: 320,
    alt: 'Unfinished room with drywall hung and joint compound on the seams',
  },
  {
    num: '04',
    name: 'Trim & crown molding',
    text: 'Crown, base, and built-up trim, cut and painted.',
    href: '/services/trim-crown-molding',
    swatch: '#1e3a5f',
    image: '/images/home/trim-960.webp',
    width: 960,
    height: 720,
    alt: 'Living room with a navy wall, white wainscot, and a trimmed television niche',
  },
  {
    num: '05',
    name: 'Wallpaper',
    text: 'Hung straight, including the feature wall behind a television.',
    href: '/services/wallpaper',
    swatch: '#6e6a66',
    image: '/images/home/wallpaper-480.webp',
    width: 480,
    height: 387,
    alt: 'Gray horizontal plank accent wall with a mounted television',
  },
  {
    num: '06',
    name: 'Murals',
    text: 'Airbrushed walls, drawn for the room they live in.',
    href: '/services/murals',
    swatch: '#2f6f8f',
    image: '/images/reviews/bb8-480.webp',
    width: 480,
    height: 360,
    alt: 'Bunk room with a night-sky ceiling and a BB-8 bunk structure',
  },
  {
    num: '07',
    name: 'TV mounting',
    text: 'The set on the wall, with the cables dealt with.',
    href: '/services/tv-mounting',
    swatch: '#2c2c2c',
    image: '/images/home/tvwall-800.webp',
    width: 800,
    height: 600,
    alt: 'Wall-mounted television centered on a gray wood-look plank wall',
  },
  {
    num: '08',
    name: 'Movie rooms',
    text: 'The room around the screen: paint, walls, and the install.',
    href: '/services/movie-rooms',
    swatch: '#161616',
    image: '/images/home/theater-800.webp',
    width: 800,
    height: 600,
    alt: 'Home theater with black walls, a popcorn mural, and rows of black recliners',
  },
  {
    num: '09',
    name: 'Demolition',
    text: 'The careful tear-out that comes before the new finish.',
    href: '/services/demolition',
    swatch: '#8c4a32',
    image: '/images/home/demo-400.webp',
    width: 400,
    height: 316,
    alt: 'A worker in a mask and goggles removing plaster from a wall',
  },
];

export const projects: HomeProject[] = [
  {
    num: '01',
    title: 'A room for Moana.',
    detail: 'Bunks, a painted wave, and the characters on the wall between the windows.',
    href: '/services/murals',
    link: 'Murals',
    image: '/images/reviews/moana-1400.webp',
    small: '/images/reviews/moana-960.webp',
    width: 1400,
    height: 1050,
    alt: 'Bunk room with a painted wave wall, palm trees, and Moana characters',
    tape: 'Themed bunks',
  },
  {
    num: '02',
    title: 'Navy wall, white trim.',
    detail: 'A trimmed television niche, wainscot, and a sprayed navy field above it.',
    href: '/services/trim-crown-molding',
    link: 'Trim & crown molding',
    image: '/images/home/trim-1600.webp',
    small: '/images/home/trim-960.webp',
    width: 1600,
    height: 1200,
    alt: 'Living room with a navy wall, white wainscot, and a white trimmed television niche',
    tape: 'Trim & paint',
  },
  {
    num: '03',
    title: 'The pool, and the patio.',
    detail: 'Pavers, a wood cover over the seating, and the water beside it.',
    href: '/work',
    link: 'All the work',
    image: '/images/reviews/pool-1400.webp',
    small: '/images/reviews/pool-960.webp',
    width: 1400,
    height: 1050,
    alt: 'Backyard pool beside a covered patio with a wood frame and outdoor seating',
    tape: 'Pool patio',
  },
  {
    num: '04',
    title: 'White cabinets, dark floor.',
    detail: 'A trailer interior: cabinets painted white, and wood-look flooring laid in.',
    href: '/projects/trailer-remodel-st-cloud-lake-toho/',
    link: 'Trailer remodel',
    image: '/images/reviews/trailer-1400.webp',
    small: '/images/reviews/trailer-960.webp',
    width: 1400,
    height: 1050,
    alt: 'Trailer interior with white cabinets, a kitchen, and dark wood-look flooring',
    tape: 'Trailer',
  },
];

export const moreProjects: HomeProject[] = [
  {
    num: '05',
    title: 'Mosaic shower',
    detail: 'Gray wall tile, a mosaic niche, and a mosaic shower floor.',
    href: '/work',
    link: 'All the work',
    image: '/images/reviews/shower-960.webp',
    small: '/images/reviews/shower-480.webp',
    width: 960,
    height: 1280,
    alt: 'Shower with large gray tile, a mosaic niche, and a mosaic floor',
    tape: 'Shower',
  },
  {
    num: '06',
    title: 'Gazebo by the pool',
    detail: 'A wood gazebo, grill, and pavers at the edge of the water.',
    href: '/work',
    link: 'All the work',
    image: '/images/reviews/gazebo-960.webp',
    small: '/images/reviews/gazebo-480.webp',
    width: 960,
    height: 1280,
    alt: 'Wood gazebo with a grill and seating beside a pool',
    tape: 'Gazebo',
  },
  {
    num: '07',
    title: 'Underwater mural',
    detail: 'Airbrush across the wall above the beds.',
    href: '/services/murals',
    link: 'Murals',
    image: '/images/home/mural-800.webp',
    small: '/images/home/mural-800.webp',
    width: 800,
    height: 600,
    alt: 'Bedroom with an underwater mural painted across the wall',
    tape: 'Airbrush',
  },
  {
    num: '08',
    title: 'Popcorn theater',
    detail: 'Black walls, a popcorn mural, and the seats facing the screen.',
    href: '/services/movie-rooms',
    link: 'Movie rooms',
    image: '/images/home/theater-800.webp',
    small: '/images/home/theater-800.webp',
    width: 800,
    height: 600,
    alt: 'Home theater with a popcorn mural, black walls, and rows of recliners',
    tape: 'Movie room',
  },
];

export const areas = [
  { href: '/areas/kissimmee', label: 'Kissimmee' },
  { href: '/areas/orlando', label: 'Orlando' },
  { href: '/areas/st-cloud', label: 'St. Cloud' },
  { href: '/areas/celebration', label: 'Celebration' },
  { href: '/areas/poinciana', label: 'Poinciana' },
  { href: '/areas/central-florida', label: 'Central Florida' },
];

export const company = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/guides', label: 'Guides' },
  { href: '/services', label: 'All services' },
  { href: '/estimate', label: 'Estimate page' },
];

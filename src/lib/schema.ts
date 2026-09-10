const BUSINESS_NAME = 'Go Pro Home Improvements';
const PHONE = '+1-407-244-6873';

/** LocalBusiness JSON-LD for global injection in Base layout (expand in content phase). */
export function localBusinessSchema(siteUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness' as const,
		name: BUSINESS_NAME,
		url: siteUrl,
		telephone: PHONE,
		email: 'gopro4good@gmail.com',
		areaServed: {
			'@type': 'State' as const,
			name: 'Florida',
		},
	};
}

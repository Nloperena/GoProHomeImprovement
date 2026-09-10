const SITE_NAME = 'Go Pro Home Improvements';

export function absoluteUrl(path: string, site: URL | string | undefined): string {
	const base = typeof site === 'string' ? site : site?.origin ?? 'https://goprohomeimprovements.com';
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return new URL(normalized, base).href;
}

export function defaultTitle(pageTitle: string): string {
	return `${pageTitle} | ${SITE_NAME}`;
}

export { SITE_NAME };

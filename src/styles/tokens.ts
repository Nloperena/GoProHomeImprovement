/** Design tokens — brand colors (see `docs/00-cursor-prompt.md`) */
export const colors = {
	ink: '#0F1419',
	paper: '#FAF9F6',
	orange: '#E85D1F',
	orangeDeep: '#C94A15',
	slate: '#5A6470',
	line: '#E5E2DC',
	cream: '#F3EFE6',
} as const;

export const layout = {
	maxWidth: 1200,
	sectionPadY: { desktop: 96, mobile: 64 },
	gutter: 24,
} as const;

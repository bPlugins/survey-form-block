/**
 * Curated inline SVG set used for question icons and success states.
 *
 * Deliberately self-contained: the block never loads an external icon font, so
 * icons cost nothing extra at runtime and inherit `currentColor`.
 */

const svg = (paths, viewBox = '0 0 24 24') => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
		{paths}
	</svg>
);

export const SVB_ICONS = {
	user: svg(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
	mail: svg(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>),
	phone: svg(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />),
	link: svg(<><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>),
	home: svg(<><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 21v-8h6v8" /></>),
	building: svg(<><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" /></>),
	calendar: svg(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
	clock: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
	star: svg(<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.8l6.5-.9Z" />),
	heart: svg(<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z" />),
	thumbsUp: svg(<><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /><path d="M7 11 12 2a3 3 0 0 1 3 3v4h4.5a2.5 2.5 0 0 1 2.4 3.1l-1.7 7A2.5 2.5 0 0 1 17.8 21H7Z" /></>),
	chat: svg(<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />),
	check: svg(<><circle cx="12" cy="12" r="9" /><path d="m8.5 12.2 2.4 2.4 4.6-4.8" /></>),
	edit: svg(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
	list: svg(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />),
	tag: svg(<><path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><path d="M7.5 7.5h.01" /></>),
	gift: svg(<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5" /></>),
	cart: svg(<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" /></>),
	globe: svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>),
	shield: svg(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>),
	lightbulb: svg(<><path d="M9 18h6M10 22h4" /><path d="M12 2a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2h5c0-.8.4-1.5 1-2A6 6 0 0 0 12 2Z" /></>),
	target: svg(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>),
	chart: svg(<path d="M3 21h18M7 21V10M12 21V4M17 21v-7" />),
	award: svg(<><circle cx="12" cy="9" r="6" /><path d="m8.2 14.3-1.4 7.2 5.2-2.6 5.2 2.6-1.4-7.2" /></>),
	book: svg(<><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 19.5Z" /></>),
	camera: svg(<><path d="M3 8a2 2 0 0 1 2-2h2.2l1.4-2h6.8l1.4 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><circle cx="12" cy="12.5" r="3.5" /></>),
	music: svg(<><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M9 18V5l12-2v13" /></>),
	sparkle: svg(<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9ZM19 3v4M21 5h-4" />),
	party: svg(<><path d="m3 21 5-14 10 10Z" /><path d="M14 4.5c1-1 2.5-1 3.5 0M18 8c1.3-1.3 3-.6 3.5.5M15.5 10.5 21 5" /></>),
	rocket: svg(<><path d="M9 15c-3 1-4 4-4 6 2 0 5-1 6-4" /><path d="M15 9a10 10 0 0 1 6-6 10 10 0 0 1-6 12l-3 1-4-4 1-3a10 10 0 0 1 6-6Z" /><circle cx="15.5" cy="8.5" r="1.4" /></>)
};

export const ICON_OPTIONS = [
	{ value: '', label: 'None' },
	...Object.keys(SVB_ICONS).map(key => ({
		value: key,
		label: key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
	}))
];

/** Icons offered for the success state. */
export const SUCCESS_ICON_OPTIONS = [
	{ value: 'none', label: 'None' },
	{ value: 'check', label: 'Check' },
	{ value: 'heart', label: 'Heart' },
	{ value: 'star', label: 'Star' },
	{ value: 'thumbsUp', label: 'Thumbs Up' },
	{ value: 'party', label: 'Celebrate' },
	{ value: 'sparkle', label: 'Sparkle' },
	{ value: 'rocket', label: 'Rocket' }
];

export const getIcon = name => SVB_ICONS[name] || null;

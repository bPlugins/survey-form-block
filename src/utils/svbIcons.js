/**
 * Curated inline SVG set used for success states and question icons.
 *
 * Deliberately self-contained: the block never loads an external icon font, so
 * icons cost nothing extra at runtime and inherit `currentColor`.
 *
 * The free build carries the success-state icons. Question icons are a
 * premium feature: their names are listed here for the upgrade prompt, and
 * their drawings ship in the premium build (src/pro/icons.js), supplied
 * through the `svb.icon` filter.
 */

import { applyFilters } from '@wordpress/hooks';

const svg = (paths, viewBox = '0 0 24 24') => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
		{paths}
	</svg>
);

export const SVB_ICONS = {
	star: svg(<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.8l6.5-.9Z" />),
	heart: svg(<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z" />),
	thumbsUp: svg(<><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /><path d="M7 11 12 2a3 3 0 0 1 3 3v4h4.5a2.5 2.5 0 0 1 2.4 3.1l-1.7 7A2.5 2.5 0 0 1 17.8 21H7Z" /></>),
	check: svg(<><circle cx="12" cy="12" r="9" /><path d="m8.5 12.2 2.4 2.4 4.6-4.8" /></>),
	sparkle: svg(<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9ZM19 3v4M21 5h-4" />),
	party: svg(<><path d="m3 21 5-14 10 10Z" /><path d="M14 4.5c1-1 2.5-1 3.5 0M18 8c1.3-1.3 3-.6 3.5.5M15.5 10.5 21 5" /></>),
	rocket: svg(<><path d="M9 15c-3 1-4 4-4 6 2 0 5-1 6-4" /><path d="M15 9a10 10 0 0 1 6-6 10 10 0 0 1-6 12l-3 1-4-4 1-3a10 10 0 0 1 6-6Z" /><circle cx="15.5" cy="8.5" r="1.4" /></>)
};

/** Every question icon name, in picker order. */
export const QUESTION_ICON_NAMES = ['user', 'mail', 'phone', 'link', 'home', 'building', 'calendar', 'clock', 'star', 'heart', 'thumbsUp', 'chat', 'check', 'edit', 'list', 'tag', 'gift', 'cart', 'globe', 'shield', 'lightbulb', 'target', 'chart', 'award', 'book', 'camera', 'music', 'sparkle', 'party', 'rocket'];

export const ICON_OPTIONS = [
	{ value: '', label: 'None' },
	...QUESTION_ICON_NAMES.map(key => ({
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

export const getIcon = name => SVB_ICONS[name] || applyFilters('svb.icon', null, name);

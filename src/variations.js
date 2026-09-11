/**
 * Block variations.
 *
 * Gives the inserter a few beautiful starting points without changing the
 * defaults of the base block - an existing survey that never touched a style
 * panel keeps rendering exactly as it did.
 *
 * Only free themes are offered here; a premium theme inserted on a free site
 * would advertise a look the site cannot fully render.
 */

import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import { THEMES, defaultDesign } from './utils/design';
import { blockIcon } from './utils/icons';

const attributeDefault = key => metadata.attributes[key]?.default;

/** Merges a theme's payload onto the block defaults. */
const themeAttributes = themeName => {
	const theme = THEMES.find(t => t.name === themeName);
	const { form = {}, labelS = {}, input = {}, button = {}, radioCheckLabelColor, design = {} } = theme?.apply || {};

	const mergedDesign = { ...defaultDesign, ...design, theme: themeName };

	Object.keys(design).forEach(key => {
		if (design[key] && 'object' === typeof design[key] && !Array.isArray(design[key])) {
			mergedDesign[key] = { ...defaultDesign[key], ...design[key] };
		}
	});

	return {
		form: { ...attributeDefault('form'), ...form },
		labelS: { ...attributeDefault('labelS'), ...labelS },
		input: { ...attributeDefault('input'), ...input },
		button: { ...attributeDefault('button'), ...button },
		radioCheckLabelColor: radioCheckLabelColor ?? attributeDefault('radioCheckLabelColor'),
		design: mergedDesign
	};
};

const VARIATION_THEMES = [
	{
		name: 'modern-minimal',
		title: __('Survey Form – Modern Minimal', 'survey-form-block'),
		description: __('Airy white survey with quiet borders and a blue accent.', 'survey-form-block')
	},
	{
		name: 'soft-card',
		title: __('Survey Form – Soft Card', 'survey-form-block'),
		description: __('Each question on its own softly elevated card.', 'survey-form-block')
	},
	{
		name: 'clean-professional',
		title: __('Survey Form – Clean Professional', 'survey-form-block'),
		description: __('Crisp business styling with a calm teal accent.', 'survey-form-block')
	}
];

const variations = VARIATION_THEMES.map(({ name, title, description }) => ({
	name,
	title,
	description,
	icon: blockIcon,
	scope: ['inserter'],
	attributes: themeAttributes(name),
	isActive: (blockAttributes) => blockAttributes?.design?.theme === name
}));

export default variations;

/**
 * Survey Form Block - Design System
 *
 * Central definition of every visual preset used by the block: themes, layouts,
 * input styles, button variants, animations, progress indicators and success
 * states. Everything here is data only, so the editor UI, the editor preview and
 * the frontend renderer all stay in sync from a single source of truth.
 *
 * Backward compatibility: the `classic` value of every option reproduces the
 * pre-1.1 rendering exactly, and `defaultDesign` is built entirely out of those
 * classic values. Blocks saved before this release simply inherit it.
 */

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

export const DEFAULT_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

/* -------------------------------------------------------------------------- */
/* Themes                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Each theme carries two payloads:
 *
 * - `vars`   CSS custom properties scoped to the block instance. They drive the
 *            structural styling (shadows, radii, focus rings, decorations) that
 *            has no dedicated control of its own.
 * - `apply`  Concrete values written into the *existing* block attributes when
 *            the theme is picked, so every colour stays editable afterwards in
 *            the panels users already know.
 */
export const THEMES = [
	{
		name: 'classic',
		label: __('Classic', 'survey-form-block'),
		pro: false,
		swatch: { bg: '#f9f9f9', accent: '#4527a4', text: '#111111', border: '#000000' },
		description: __('The original Survey Form Block look.', 'survey-form-block'),
		vars: {},
		apply: {
			form: {
				bgColor: '#F9F9F991',
				padding: { top: '8px', right: '12px', bottom: '8px', left: '12px' },
				border: { width: '0px', style: 'solid', color: '#0575e6', side: 'all', radius: '5px' },
				titleColor: '#000',
				descriptionColor: '#000',
				successMsgColor: 'green'
			},
			labelS: { color: '#000' },
			input: {
				color: '#000',
				padding: { top: '8px', right: '12px', bottom: '8px', left: '12px' },
				border: { width: '0px', style: 'solid', color: '#0575e6', side: 'all', radius: '3px' }
			},
			radioCheckLabelColor: '#000',
			button: { colors: { color: '#fff', bg: '#4527a4' }, padding: { top: '11px', right: '0px', bottom: '11px', left: '0px' } },
			design: {
				layout: 'classic',
				inputStyle: 'classic',
				button: { variant: 'classic', radius: '', hoverEffect: 'none' },
				card: { enable: false },
				background: { enable: false }
			}
		}
	},
	{
		name: 'modern-minimal',
		label: __('Modern Minimal', 'survey-form-block'),
		pro: false,
		swatch: { bg: '#ffffff', accent: '#2563eb', text: '#0f172a', border: '#e2e8f0' },
		description: __('Airy white surface, quiet borders, confident blue accent.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#2563eb',
			'--svb-accent-alt': '#3b82f6',
			'--svb-accent-soft': 'rgba(37, 99, 235, 0.10)',
			'--svb-heading': '#0f172a',
			'--svb-muted': '#64748b',
			'--svb-divider': '#e2e8f0',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#2563eb',
			'--svb-input-focus-ring': 'rgba(37, 99, 235, 0.18)',
			'--svb-placeholder': '#94a3b8',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#e2e8f0',
			'--svb-card-radius': '10px',
			'--svb-card-shadow': 'none',
			'--svb-card-hover-shadow': '0 6px 18px rgba(15, 23, 42, 0.06)',
			'--svb-form-shadow': 'none',
			'--svb-btn-shadow': 'none',
			'--svb-progress-track': '#e2e8f0'
		},
		apply: {
			form: {
				bgColor: '#ffffff',
				padding: { top: '28px', right: '28px', bottom: '28px', left: '28px' },
				border: { width: '1px', style: 'solid', color: '#e2e8f0', side: 'all', radius: '12px' },
				titleColor: '#0f172a',
				descriptionColor: '#64748b',
				successMsgColor: '#16a34a'
			},
			labelS: { color: '#0f172a' },
			input: {
				color: '#0f172a',
				padding: { top: '11px', right: '14px', bottom: '11px', left: '14px' },
				border: { width: '1px', style: 'solid', color: '#e2e8f0', side: 'all', radius: '8px' }
			},
			radioCheckLabelColor: '#334155',
			button: { colors: { color: '#ffffff', bg: '#2563eb' }, padding: { top: '13px', right: '26px', bottom: '13px', left: '26px' } },
			design: {
				layout: 'minimal',
				inputStyle: 'outlined',
				button: { variant: 'filled', radius: '8px', hoverEffect: 'none' },
				card: { enable: false },
				background: { enable: false }
			}
		}
	},
	{
		name: 'soft-card',
		label: __('Soft Card', 'survey-form-block'),
		pro: false,
		swatch: { bg: '#f8fafc', accent: '#6366f1', text: '#1e293b', border: '#e9ecf5' },
		description: __('Every question sits on its own softly elevated card.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#6366f1',
			'--svb-accent-alt': '#818cf8',
			'--svb-accent-soft': 'rgba(99, 102, 241, 0.10)',
			'--svb-heading': '#1e293b',
			'--svb-muted': '#64748b',
			'--svb-divider': '#e9ecf5',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#6366f1',
			'--svb-input-focus-ring': 'rgba(99, 102, 241, 0.18)',
			'--svb-placeholder': '#a3aec2',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#eef1f8',
			'--svb-card-radius': '14px',
			'--svb-card-shadow': '0 2px 10px rgba(30, 41, 59, 0.06)',
			'--svb-card-hover-shadow': '0 10px 26px rgba(30, 41, 59, 0.10)',
			'--svb-form-shadow': '0 1px 2px rgba(30, 41, 59, 0.04)',
			'--svb-btn-shadow': '0 6px 16px rgba(99, 102, 241, 0.26)',
			'--svb-progress-track': '#e6e9f4'
		},
		apply: {
			form: {
				bgColor: '#f8fafc',
				padding: { top: '26px', right: '24px', bottom: '26px', left: '24px' },
				border: { width: '0px', style: 'solid', color: '#e9ecf5', side: 'all', radius: '18px' },
				titleColor: '#1e293b',
				descriptionColor: '#64748b',
				successMsgColor: '#0f9d58'
			},
			labelS: { color: '#1e293b' },
			input: {
				color: '#1e293b',
				padding: { top: '11px', right: '14px', bottom: '11px', left: '14px' },
				border: { width: '1px', style: 'solid', color: '#e4e8f2', side: 'all', radius: '10px' }
			},
			radioCheckLabelColor: '#475569',
			button: { colors: { color: '#ffffff', bg: '#6366f1' }, padding: { top: '14px', right: '28px', bottom: '14px', left: '28px' } },
			design: {
				layout: 'card',
				inputStyle: 'outlined',
				button: { variant: 'filled', radius: '10px', hoverEffect: 'lift' },
				card: { enable: true },
				background: { enable: false }
			}
		}
	},
	{
		name: 'clean-professional',
		label: __('Clean Professional', 'survey-form-block'),
		pro: false,
		swatch: { bg: '#ffffff', accent: '#0f766e', text: '#111827', border: '#d8dee9' },
		description: __('Crisp business styling with a calm teal accent.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#0f766e',
			'--svb-accent-alt': '#14b8a6',
			'--svb-accent-soft': 'rgba(15, 118, 110, 0.10)',
			'--svb-heading': '#111827',
			'--svb-muted': '#6b7280',
			'--svb-divider': '#e5e7eb',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#0f766e',
			'--svb-input-focus-ring': 'rgba(15, 118, 110, 0.16)',
			'--svb-placeholder': '#9ca3af',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#e5e7eb',
			'--svb-card-radius': '6px',
			'--svb-card-shadow': 'none',
			'--svb-card-hover-shadow': 'none',
			'--svb-form-shadow': 'none',
			'--svb-btn-shadow': 'none',
			'--svb-progress-track': '#e5e7eb'
		},
		apply: {
			form: {
				bgColor: '#ffffff',
				padding: { top: '30px', right: '30px', bottom: '30px', left: '30px' },
				border: { width: '1px', style: 'solid', color: '#d8dee9', side: 'all', radius: '6px' },
				titleColor: '#111827',
				descriptionColor: '#6b7280',
				successMsgColor: '#0f766e'
			},
			labelS: { color: '#111827' },
			input: {
				color: '#111827',
				padding: { top: '10px', right: '13px', bottom: '10px', left: '13px' },
				border: { width: '1px', style: 'solid', color: '#cbd5e1', side: 'all', radius: '5px' }
			},
			radioCheckLabelColor: '#374151',
			button: { colors: { color: '#ffffff', bg: '#0f766e' }, padding: { top: '12px', right: '26px', bottom: '12px', left: '26px' } },
			design: {
				layout: 'classic',
				inputStyle: 'outlined',
				button: { variant: 'filled', radius: '5px', hoverEffect: 'none' },
				card: { enable: false },
				background: { enable: false }
			}
		}
	},

	/* ----------------------------- Premium themes ----------------------------- */

	// Listed here by name and swatch only, for the upgrade prompt. Their variable
	// layer and attribute payload ship in the premium build (src/pro/themes.js)
	// and are merged in through the svb.design.themes filter; see getThemes().

	{
		name: 'glassmorphism',
		label: __('Glassmorphism', 'survey-form-block'),
		pro: true,
		swatch: { bg: 'linear-gradient(135deg,#c7d2fe,#a5f3fc)', accent: '#7c3aed', text: '#1e1b4b', border: 'rgba(255,255,255,.7)' },
		description: __('Frosted translucent panel floating over a colour wash.', 'survey-form-block')
	},
	{
		name: 'bold-gradient',
		label: __('Bold Gradient', 'survey-form-block'),
		pro: true,
		swatch: { bg: 'linear-gradient(135deg,#6366f1,#ec4899)', accent: '#ffffff', text: '#ffffff', border: 'rgba(255,255,255,.35)' },
		description: __('Landing-page energy: saturated gradient with white type.', 'survey-form-block')
	},
	{
		name: 'midnight',
		label: __('Midnight Dark', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#0f172a', accent: '#38bdf8', text: '#e2e8f0', border: '#1e293b' },
		description: __('Deep slate dark mode with a luminous sky accent.', 'survey-form-block')
	},
	{
		name: 'elegant',
		label: __('Elegant', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#fbf8f3', accent: '#8a6a3d', text: '#3f3222', border: '#e6dcc9' },
		description: __('Warm editorial cream with a refined gold rule.', 'survey-form-block')
	},
	{
		name: 'neumorphic',
		label: __('Neumorphic', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#e8ecf1', accent: '#5b7cfa', text: '#3d4658', border: '#dbe1e9' },
		description: __('Soft extruded surfaces, no hard borders.', 'survey-form-block')
	},
	{
		name: 'sunset',
		label: __('Sunset Warm', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#fff7ed', accent: '#ea580c', text: '#431407', border: '#fed7aa' },
		description: __('Friendly warm palette for feedback and NPS surveys.', 'survey-form-block')
	},
	{
		name: 'ocean',
		label: __('Ocean Cool', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#f0f9ff', accent: '#0ea5e9', text: '#0c4a6e', border: '#bae6fd' },
		description: __('Fresh aquatic tones, generous rounding, calm contrast.', 'survey-form-block')
	}
];

/**
 * Every theme, with the premium definitions merged in when the premium build
 * is loaded. Read through this rather than `THEMES` wherever a theme's `vars`
 * or `apply` payload matters.
 *
 * @return {Array} Theme definitions.
 */
export const getThemes = () => applyFilters('svb.design.themes', THEMES);

/* -------------------------------------------------------------------------- */
/* Option lists                                                                */
/* -------------------------------------------------------------------------- */

export const LAYOUTS = [
	{ value: 'classic', label: __('Classic', 'survey-form-block'), pro: false, hint: __('Original stacked questions.', 'survey-form-block') },
	{ value: 'card', label: __('Card', 'survey-form-block'), pro: false, hint: __('Each question in its own card.', 'survey-form-block') },
	{ value: 'minimal', label: __('Minimal', 'survey-form-block'), pro: false, hint: __('Roomy spacing, hairline separators.', 'survey-form-block') },
	{ value: 'floating', label: __('Floating', 'survey-form-block'), pro: true, hint: __('Elevated cards that lift on focus.', 'survey-form-block') },
	{ value: 'split', label: __('Split', 'survey-form-block'), pro: true, hint: __('Heading column beside the questions.', 'survey-form-block') },
	{ value: 'fullwidth', label: __('Full Width', 'survey-form-block'), pro: true, hint: __('Landing-page scale and spacing.', 'survey-form-block') }
];

export const INPUT_STYLES = [
	{ value: 'classic', label: __('Classic', 'survey-form-block'), pro: false },
	{ value: 'outlined', label: __('Outlined', 'survey-form-block'), pro: false },
	{ value: 'filled', label: __('Filled', 'survey-form-block'), pro: true },
	{ value: 'underline', label: __('Underline', 'survey-form-block'), pro: true },
	{ value: 'rounded', label: __('Rounded', 'survey-form-block'), pro: true },
	{ value: 'floating', label: __('Floating Label', 'survey-form-block'), pro: true }
];

export const BUTTON_VARIANTS = [
	{ value: 'classic', label: __('Classic', 'survey-form-block'), pro: false },
	{ value: 'filled', label: __('Filled', 'survey-form-block'), pro: false },
	{ value: 'outline', label: __('Outline', 'survey-form-block'), pro: false },
	{ value: 'gradient', label: __('Gradient', 'survey-form-block'), pro: true },
	{ value: 'soft', label: __('Soft', 'survey-form-block'), pro: true },
	{ value: 'minimal', label: __('Minimal', 'survey-form-block'), pro: true }
];

export const BUTTON_HOVERS = [
	{ value: 'none', label: __('None', 'survey-form-block'), pro: false },
	{ value: 'lift', label: __('Lift', 'survey-form-block'), pro: false },
	{ value: 'scale', label: __('Scale', 'survey-form-block'), pro: true },
	{ value: 'glow', label: __('Glow', 'survey-form-block'), pro: true },
	{ value: 'slide', label: __('Slide Fill', 'survey-form-block'), pro: true }
];

export const BUTTON_WIDTHS = [
	{ value: 'full', label: __('Full', 'survey-form-block') },
	{ value: 'auto', label: __('Auto', 'survey-form-block') }
];

export const ALIGNMENTS = [
	{ value: 'left', label: __('Left', 'survey-form-block') },
	{ value: 'center', label: __('Center', 'survey-form-block') },
	{ value: 'right', label: __('Right', 'survey-form-block') }
];

export const ANIMATIONS = [
	{ value: 'none', label: __('None', 'survey-form-block'), pro: false },
	{ value: 'fade', label: __('Fade In', 'survey-form-block'), pro: false },
	{ value: 'slide-up', label: __('Slide Up', 'survey-form-block'), pro: true },
	{ value: 'slide-left', label: __('Slide Left', 'survey-form-block'), pro: true },
	{ value: 'scale', label: __('Scale In', 'survey-form-block'), pro: true },
	{ value: 'reveal', label: __('Reveal', 'survey-form-block'), pro: true }
];

export const CARD_HOVERS = [
	{ value: 'none', label: __('None', 'survey-form-block') },
	{ value: 'lift', label: __('Lift', 'survey-form-block') },
	{ value: 'glow', label: __('Accent Glow', 'survey-form-block') },
	{ value: 'border', label: __('Accent Border', 'survey-form-block') }
];

export const PROGRESS_STYLES = [
	{ value: 'linear', label: __('Linear', 'survey-form-block'), pro: false },
	{ value: 'gradient', label: __('Gradient', 'survey-form-block'), pro: true },
	{ value: 'segmented', label: __('Segmented', 'survey-form-block'), pro: true },
	{ value: 'circular', label: __('Circular', 'survey-form-block'), pro: true },
	{ value: 'steps', label: __('Step Dots', 'survey-form-block'), pro: true }
];

export const PROGRESS_POSITIONS = [
	{ value: 'top', label: __('Top', 'survey-form-block') },
	{ value: 'bottom', label: __('Bottom', 'survey-form-block') }
];

export const SUCCESS_STYLES = [
	{ value: 'inline', label: __('Inline', 'survey-form-block'), pro: false },
	{ value: 'card', label: __('Card', 'survey-form-block'), pro: false },
	{ value: 'banner', label: __('Banner', 'survey-form-block'), pro: true },
	{ value: 'replace', label: __('Replace Form', 'survey-form-block'), pro: true }
];

export const SUCCESS_ANIMATIONS = [
	{ value: 'none', label: __('None', 'survey-form-block'), pro: false },
	{ value: 'fade', label: __('Fade', 'survey-form-block'), pro: false },
	{ value: 'pop', label: __('Pop', 'survey-form-block'), pro: true },
	{ value: 'scale', label: __('Scale', 'survey-form-block'), pro: true },
	{ value: 'slide', label: __('Slide Up', 'survey-form-block'), pro: true }
];

export const REQUIRED_MARKS = [
	{ value: 'asterisk', label: __('Asterisk', 'survey-form-block') },
	{ value: 'badge', label: __('“Required” badge', 'survey-form-block') },
	{ value: 'none', label: __('Hidden', 'survey-form-block') }
];

export const DIVIDER_STYLES = [
	{ value: 'solid', label: __('Solid', 'survey-form-block'), pro: false },
	{ value: 'dashed', label: __('Dashed', 'survey-form-block'), pro: true },
	{ value: 'dotted', label: __('Dotted', 'survey-form-block'), pro: true },
	{ value: 'gradient', label: __('Gradient', 'survey-form-block'), pro: true },
	{ value: 'none', label: __('None', 'survey-form-block'), pro: false }
];

export const BG_TYPES = [
	{ value: 'solid', label: __('Solid', 'survey-form-block'), pro: false },
	{ value: 'gradient', label: __('Gradient', 'survey-form-block'), pro: true },
	{ value: 'image', label: __('Image', 'survey-form-block'), pro: true }
];

/* -------------------------------------------------------------------------- */
/* Defaults & helpers                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The design defaults deliberately mirror the pre-existing rendering so that a
 * survey created before this release is pixel-identical after upgrading.
 */
export const defaultDesign = {
	theme: 'classic',
	layout: 'classic',
	inputStyle: 'classic',
	maxWidth: '',
	gap: { desktop: '', tablet: '', mobile: '' },
	stackBreakpoint: 768,

	card: {
		enable: false,
		bgType: 'solid',
		bg: '',
		gradient: DEFAULT_GRADIENT,
		border: { width: '', style: 'solid', color: '', side: 'all', radius: '' },
		shadow: [],
		padding: { top: '', right: '', bottom: '', left: '' },
		hoverEffect: 'none'
	},

	input: {
		bg: '',
		radius: '',
		focusColor: '',
		focusRing: true,
		placeholderColor: '',
		accentColor: ''
	},

	button: {
		variant: 'classic',
		label: '',
		width: 'full',
		align: 'left',
		radius: '',
		gradient: DEFAULT_GRADIENT,
		hoverEffect: 'none',
		hoverColors: { color: '', bg: '' },
		transition: 250
	},

	background: {
		enable: false,
		type: 'solid',
		color: '',
		gradient: DEFAULT_GRADIENT,
		image: {},
		position: 'center center',
		size: 'cover',
		repeat: 'no-repeat',
		attachment: 'scroll',
		overlayColor: '',
		blur: 0
	},

	animation: { type: 'none', duration: 500, stagger: 60 },

	progress: {
		enable: false,
		style: 'linear',
		position: 'top',
		height: '6px',
		color: '',
		trackColor: '',
		gradient: DEFAULT_GRADIENT,
		showLabel: true
	},

	success: {
		style: 'inline',
		icon: 'check',
		animation: 'fade',
		title: '',
		iconColor: '',
		bg: '',
		duration: 2000
	},

	label: { requiredMark: 'asterisk', requiredText: 'Required', requiredColor: '', helpColor: '' },

	divider: { style: 'solid', color: '', thickness: '2px', headingColor: '', descriptionColor: '' }
};

/**
 * Merges a stored design object over the defaults, one level deep for the nested
 * sections. Older saved blocks may be missing whole sections (or individual keys
 * added by a later release), so every consumer goes through this.
 *
 * @param {Object} design Stored design attribute (may be partial or undefined).
 * @return {Object} A complete design object.
 */
export const getDesign = (design = {}) => {
	const merged = { ...defaultDesign, ...(design || {}) };

	Object.keys(defaultDesign).forEach(key => {
		const def = defaultDesign[key];

		if (def && 'object' === typeof def && !Array.isArray(def)) {
			merged[key] = { ...def, ...(design?.[key] || {}) };
		}
	});

	return merged;
};

/**
 * Builds the attribute payload for a one-click theme change. Only styling
 * attributes are touched - field data, typography, titles, help text and the
 * success message wording are all carried over untouched.
 *
 * @param {string} themeName Theme identifier.
 * @param {Object} attributes Current block attributes.
 * @return {Object} Partial attributes ready for `setAttributes`.
 */
export const applyTheme = (themeName, attributes) => {
	const theme = getThemes().find(t => t.name === themeName);

	// A premium stub has no payload; nothing to apply without the premium build.
	if (!theme?.apply) {
		return {};
	}

	const { form = {}, labelS = {}, input = {}, button = {}, radioCheckLabelColor, design = {} } = theme.apply || {};
	const currentDesign = getDesign(attributes.design);

	const nextDesign = { ...currentDesign, ...design, theme: themeName };

	// Keep the nested design sections merged rather than replaced.
	Object.keys(design).forEach(key => {
		if (design[key] && 'object' === typeof design[key] && !Array.isArray(design[key])) {
			nextDesign[key] = { ...currentDesign[key], ...design[key] };
		}
	});

	return {
		form: { ...attributes.form, ...form },
		labelS: { ...attributes.labelS, ...labelS },
		input: { ...attributes.input, ...input },
		button: { ...attributes.button, ...button },
		radioCheckLabelColor: radioCheckLabelColor ?? attributes.radioCheckLabelColor,
		design: nextDesign
	};
};

/**
 * @param {Array} list One of the option lists above.
 * @param {string} value Option value.
 * @return {boolean} Whether the option requires Pro.
 */
export const isProOption = (list, value) => Boolean(list.find(o => o.value === value)?.pro);

/**
 * Falls a Pro-only value back to its free equivalent. Used on the frontend and
 * in the editor preview so that a site which lost its licence still renders a
 * valid design instead of an unstyled one.
 *
 * @param {Array} list One of the option lists above.
 * @param {string} value Stored value.
 * @param {boolean} isPremium Whether Pro is active.
 * @param {string} fallback Free value to use instead.
 * @return {string} A safe value.
 */
export const safeOption = (list, value, isPremium, fallback) => (
	!isPremium && isProOption(list, value) ? fallback : value
);

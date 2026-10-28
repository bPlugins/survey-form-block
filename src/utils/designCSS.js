/**
 * Survey Form Block - Design CSS generator
 *
 * Turns the `design` attribute into a scoped stylesheet. The same function runs
 * in the editor preview and on the frontend, so what an author sees is what a
 * visitor gets.
 *
 * The output is appended *after* the legacy rules in `Style.js`, which means a
 * deliberate design choice (a button variant, an input style, a layout) wins over
 * the older per-property controls, while every property the design system does
 * not touch keeps flowing from the original controls untouched.
 *
 * Free and premium: this file holds only the free presets. Each premium preset
 * is produced by the premium build (src/pro/css.js) through an
 * `svb.design.css.<slot>` filter, called at the exact point the rule used to sit
 * so the cascade order is unchanged. Without the premium build every slot
 * yields an empty string, and `resolveDesign()` has already mapped any premium
 * value to its free equivalent.
 */

import { applyFilters } from '@wordpress/hooks';

import { getBorderCSS, getBoxCSS, getMultiShadowCSS } from '../../../bpl-tools/utils/getCSS';
import { getDesign, getThemes, safeOption, LAYOUTS, INPUT_STYLES, BUTTON_VARIANTS, BUTTON_HOVERS, ANIMATIONS, PROGRESS_STYLES, SUCCESS_STYLES, SUCCESS_ANIMATIONS, DIVIDER_STYLES } from './design';

/** Every text-like control the block can render. */
export const TEXT_INPUTS = [
	'input[type=text]',
	'input[type=email]',
	'input[type=number]',
	'input[type=tel]',
	'input[type=url]',
	'input[type=date]',
	'input[type=password]',
	'input[type=search]',
	'textarea',
	'select'
];

const TABLET = '@media only screen and (max-width: 1024px)';

const px = val => (val || 0 === val) && !isNaN(val) ? `${val}px` : val;

/**
 * Helpers handed to premium CSS slots, so the premium build does not need its
 * own copy of them.
 */
const tools = { px, getBorderCSS, getBoxCSS, getMultiShadowCSS };

/**
 * Premium CSS for one slot, or an empty string in the free build.
 *
 * @param {string} slot    Slot name.
 * @param {Object} context Selectors and values the slot needs.
 * @return {string} CSS.
 */
const proSlot = (slot, context) => applyFilters(`svb.design.css.${slot}`, '', { ...context, tools });

/**
 * Card styling shared by the Card layout and the premium Floating layout.
 *
 * @param {string} item Field item selector.
 * @return {string} CSS.
 */
const cardSurfaceCSS = item => `
			${item} .fieldMainArea {
				background: var(--svb-card-bg, #ffffff);
				border: 1px solid var(--svb-card-border-color, #e6e8ec);
				border-radius: var(--svb-card-radius, 12px);
				box-shadow: var(--svb-card-shadow, none);
				padding: var(--svb-card-padding, 16px 18px);
				transition: box-shadow var(--svb-transition, .25s) ease, transform var(--svb-transition, .25s) ease, border-color var(--svb-transition, .25s) ease;
			}
			${item} .svbSectionDivider { padding: 0; background: none; border: none; box-shadow: none; }
		`;


/**
 * Resolves the effective, licence-safe design values.
 *
 * When Pro is not active every Pro-only choice falls back to its closest free
 * equivalent instead of rendering nothing. A site whose licence lapsed keeps a
 * valid design and no saved attribute is ever discarded.
 *
 * @param {Object} design Raw design attribute.
 * @param {boolean} isPremium Whether Pro is active.
 * @return {Object} Design object with safe values.
 */
export const resolveDesign = (design, isPremium = false) => {
	const d = getDesign(design);

	if (isPremium) {
		return d;
	}

	const themeIsPro = Boolean(getThemes().find(t => t.name === d.theme)?.pro);

	return {
		...d,
		// A Pro theme's colours already live in the normal attributes, so only the
		// decorative variable layer is withheld.
		theme: themeIsPro ? 'classic' : d.theme,
		layout: safeOption(LAYOUTS, d.layout, false, 'card'),
		inputStyle: safeOption(INPUT_STYLES, d.inputStyle, false, 'outlined'),
		card: { ...d.card, hoverEffect: 'none' },
		button: {
			...d.button,
			variant: safeOption(BUTTON_VARIANTS, d.button.variant, false, 'filled'),
			hoverEffect: safeOption(BUTTON_HOVERS, d.button.hoverEffect, false, 'lift')
		},
		background: { ...d.background, enable: false },
		animation: { ...d.animation, type: safeOption(ANIMATIONS, d.animation.type, false, 'fade') },
		progress: { ...d.progress, style: safeOption(PROGRESS_STYLES, d.progress.style, false, 'linear') },
		success: {
			...d.success,
			style: safeOption(SUCCESS_STYLES, d.success.style, false, 'card'),
			animation: safeOption(SUCCESS_ANIMATIONS, d.success.animation, false, 'fade')
		},
		divider: { ...d.divider, style: safeOption(DIVIDER_STYLES, d.divider.style, false, 'solid') }
	};
};

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

const themeVarsCSS = (root, design, isPremium) => {
	const theme = getThemes().find(t => t.name === design.theme);

	if (!theme || !Object.keys(theme.vars || {}).length) {
		return '';
	}

	// Decorative variables are the visible part of a premium theme.
	if (theme.pro && !isPremium) {
		return '';
	}

	const vars = Object.entries(theme.vars).map(([k, v]) => `${k}: ${v};`).join('');

	// Dark themes also flip the UA colour scheme, so native checkboxes, radios,
	// select popups and scrollbars stop rendering as white blocks on a dark card.
	const scheme = theme.colorScheme ? `color-scheme: ${theme.colorScheme};` : '';

	return `${root} { ${vars}${scheme} }`;
};

const layoutCSS = (root, design) => {
	const { layout, gap, stackBreakpoint, maxWidth } = design;
	const form = `${root} form`;
	const item = `${root} .svbMainArea .mainFieldArea .fieldItem`;

	let css = `
		${form} { box-shadow: var(--svb-form-shadow, none); }
		${item} { margin-bottom: var(--svb-gap, 16px); }
	`;

	if (maxWidth) {
		css += `${form} { max-width: ${px(maxWidth)}; margin-left: auto; margin-right: auto; }`;
	}

	// Responsive vertical rhythm between questions.
	['desktop', 'tablet', 'mobile'].forEach(device => {
		const val = gap?.[device];

		if (!val) {
			return;
		}

		const rule = `${root} { --svb-gap: ${px(val)}; }`;

		css += 'desktop' === device ? rule
			: 'tablet' === device ? `${TABLET} { ${rule} }`
				: `@media only screen and (max-width: 640px) { ${rule} }`;
	});

	if ('card' === layout) {
		css += cardSurfaceCSS(item);
	}

	if ('minimal' === layout) {
		css += `
			${item} .fieldMainArea { padding-bottom: var(--svb-gap, 18px); border-bottom: 1px solid var(--svb-divider, #e5e7eb); }
			${item}:last-of-type .fieldMainArea { border-bottom: 0; padding-bottom: 0; }
			${item} .svbSectionDivider { border-bottom: 0; }
		`;
	}

	// Floating, Split and Full Width.
	css += proSlot('layout', { root, design, form, item, cardSurfaceCSS });

	// Column stacking breakpoint, overriding the hard-coded 768px baseline.
	const bp = parseInt(stackBreakpoint) || 768;

	if (768 !== bp) {
		css += `
			@media (max-width: ${bp}px) {
				${item}.w66, ${item}.w50, ${item}.w33, ${item}.w25 { flex-basis: 100%; }
			}
			@media (min-width: ${bp + 1}px) {
				${item}.w66 { flex-basis: calc(66.666% - 5px); }
				${item}.w50 { flex-basis: calc(50% - 7.5px); }
				${item}.w33 { flex-basis: calc(33.333% - 10px); }
				${item}.w25 { flex-basis: calc(25% - 11.25px); }
			}
		`;
	}

	return css;
};

/** The question card designer is premium in full. */
const cardCSS = (root, design, isPremium) => proSlot('card', { root, design, isPremium });

const inputCSS = (root, design, isPremium) => {
	const { inputStyle, input } = design;
	const area = `${root} .svbMainArea .fieldItem .fieldArea`;
	const sel = TEXT_INPUTS.map(s => `${area} ${s}`).join(', ');
	const focusSel = TEXT_INPUTS.map(s => `${area} ${s}:focus`).join(', ');
	const hoverSel = TEXT_INPUTS.map(s => `${area} ${s}:hover:not(:focus)`).join(', ');
	const placeholderSel = TEXT_INPUTS.map(s => `${area} ${s}::placeholder`).join(', ');

	// A custom focus colour is a premium control.
	const focus = applyFilters('svb.design.inputFocus', 'var(--svb-input-focus, #4527a4)', { design, isPremium });
	const ring = false === input?.focusRing ? '' : `box-shadow: 0 0 0 3px var(--svb-input-focus-ring, rgba(69, 39, 164, .15));`;
	const context = { root, design, input, isPremium, area, sel, focusSel, hoverSel, placeholderSel, focus };

	let css = `
		${sel} { transition: border-color var(--svb-transition, .2s) ease, box-shadow var(--svb-transition, .2s) ease, background-color var(--svb-transition, .2s) ease; }
		${hoverSel} { border-color: var(--svb-input-hover, var(--svb-input-focus, #4527a4)); }
		${focusSel} { outline: none; border-color: ${focus}; ${ring} }
		${root} .svbMainArea .fieldItem .fieldArea input[type=checkbox],
		${root} .svbMainArea .fieldItem .fieldArea input[type=radio],
		${root} .svbMainArea .fieldItem .fieldArea input[type=range] { accent-color: var(--svb-accent, #4527a4); }
	`;

	// Placeholder colour, field background and corner radius are premium controls.
	css += applyFilters('svb.design.css.inputPlaceholder', `${placeholderSel} { color: var(--svb-placeholder, inherit); }`, { ...context, tools });
	css += proSlot('inputExtras', context);

	switch (inputStyle) {
		case 'outlined':
			css += `
				${sel} { background-color: var(--svb-input-bg, transparent); border-width: 1px; border-style: solid; }
				${focusSel} { border-width: 1px; }
			`;
			break;

		default:
			// Filled, Underline, Rounded and Floating Label.
			css += proSlot('inputStyle', context);
			break;
	}

	return css;
};

const buttonCSS = (root, design, isPremium) => {
	const { button } = design;
	const btn = `${root} .subBtn`;
	const area = `${root} .subBtnArea`;
	const speed = `${parseInt(button.transition) || 250}ms`;
	const context = { root, design, button, isPremium, btn, area, speed };

	let css = `
		${root} { --svb-transition: ${speed}; }
		${btn} {
			display: inline-flex; align-items: center; justify-content: center; gap: 8px;
			cursor: pointer; text-align: center; font-family: inherit;
			transition: background-color ${speed} ease, color ${speed} ease, border-color ${speed} ease, box-shadow ${speed} ease, transform ${speed} ease;
			position: relative; overflow: hidden;
		}
		${btn}:focus-visible { outline: 2px solid var(--svb-input-focus, #4527a4); outline-offset: 3px; }
		${btn}[disabled] { opacity: .6; cursor: not-allowed; }
	`;

	css += 'auto' === button.width
		? `${area} { display: flex; justify-content: ${'center' === button.align ? 'center' : 'right' === button.align ? 'flex-end' : 'flex-start'}; } ${btn} { width: auto; }`
		: `${btn} { width: 100%; }`;

	if (button.radius) {
		css += `${btn} { border-radius: ${px(button.radius)}; }`;
	}

	switch (button.variant) {
		case 'filled':
			css += `${btn} { border: none; box-shadow: var(--svb-btn-shadow, none); }`;
			break;

		case 'outline':
			css += `
				${btn} { background: transparent; border: 2px solid currentColor; color: var(--svb-btn-outline-color, var(--svb-accent, #4527a4)); box-shadow: none; }
				${btn}:hover { background: var(--svb-accent, #4527a4); color: var(--svb-btn-outline-hover, #ffffff); }
			`;
			break;

		default:
			// Gradient, Soft and Minimal.
			css += proSlot('buttonVariant', context);
			break;
	}

	// Hover colours are a premium control.
	css += proSlot('buttonHoverColors', context);

	switch (button.hoverEffect) {
		case 'lift':
			css += `${btn}:hover { transform: translateY(-2px); box-shadow: var(--svb-btn-hover-shadow, 0 10px 22px rgba(15, 23, 42, .18)); }`;
			break;

		default:
			// Scale, Glow and Slide Fill.
			css += proSlot('buttonHover', context);
			break;
	}

	return css;
};

/** The survey backdrop is premium in full. */
const backgroundCSS = (root, design, isPremium) => proSlot('background', { root, design, isPremium });

const animationCSS = (root, design) => {
	const { animation } = design;

	if (!animation || 'none' === animation.type) {
		return '';
	}

	const duration = parseInt(animation.duration) || 500;
	const stagger = parseInt(animation.stagger) || 0;
	const item = `${root} .svbMainArea .mainFieldArea .fieldItem`;

	return `
		${item} {
			animation-name: svbAnim-${animation.type};
			animation-duration: ${duration}ms;
			animation-timing-function: cubic-bezier(.22, .61, .36, 1);
			animation-fill-mode: both;
			animation-delay: calc(var(--svb-i, 0) * ${stagger}ms);
		}
		@media (prefers-reduced-motion: reduce) {
			${item} { animation: none !important; }
		}
	`;
};

const progressCSS = (root, design, isPremium) => {
	const { progress } = design;

	if (!progress?.enable) {
		return '';
	}

	const wrap = `${root} .svbProgressArea`;
	// The gradient fill is a premium progress style.
	const fill = applyFilters('svb.design.progressFill', progress.color || 'var(--svb-accent, #4527a4)', { design, isPremium });
	const track = progress.trackColor || 'var(--svb-progress-track, rgba(15, 23, 42, .10))';
	const height = px(progress.height) || '6px';

	return `
		${wrap} { --svb-progress-fill: ${fill}; --svb-progress-track: ${track}; --svb-progress-height: ${height}; }
		${wrap} .svbProgressLabel { color: var(--svb-muted, inherit); }
	` + proSlot('progress', { root, design, isPremium, wrap });
};

const successCSS = (root, design, isPremium) => {
	const { success } = design;
	const wrap = `${root} .successArea`;

	let css = `${wrap} .svbSuccessIcon { color: ${success.iconColor || 'var(--svb-success-color, currentColor)'}; }`;

	// A panel background is a premium control.
	css += proSlot('successBg', { root, design, isPremium, wrap });

	if ('none' !== success.animation) {
		const anim = `svbSuccess-${success.animation}`;
		css += `
			${wrap} { animation: ${anim} .45s cubic-bezier(.22, .61, .36, 1) both; }
			@media (prefers-reduced-motion: reduce) { ${wrap} { animation: none; } }
		`;
	}

	return css;
};

const detailCSS = (root, design, isPremium) => {
	const { divider, label } = design;
	const section = `${root} .svbSectionDivider`;
	let css = '';

	if (divider?.headingColor) {
		css += `${section} .svbSectionHeader { color: ${divider.headingColor}; }`;
	}

	if (divider?.descriptionColor) {
		css += `${section} .svbSectionDescription { color: ${divider.descriptionColor}; }`;
	}

	const line = `${section} .svbSectionLine`;
	const color = divider?.color || 'var(--svb-divider, #e5e7eb)';
	const thickness = px(divider?.thickness) || '2px';

	if ('none' === divider?.style) {
		css += `${line} { display: none; }`;
	} else {
		// The gradient rule is a premium divider style.
		css += proSlot('dividerLine', { root, design, isPremium, line, thickness }) || `${line} { border-top: ${thickness} ${divider?.style || 'solid'} ${color}; }`;
	}

	// The asterisk is an SVG with a baked-in red fill and the badge carries its
	// own palette, so both need overriding explicitly.
	if (label?.requiredColor) {
		css += `${root} .svbMainArea .fieldItem .labelArea .svbRequiredStar svg { fill: ${label.requiredColor}; }`;
		css += `${root} .svbMainArea .fieldItem .labelArea .svbRequiredBadge { color: ${label.requiredColor}; background: color-mix(in srgb, ${label.requiredColor} 12%, transparent); }`;
	}

	if (label?.helpColor) {
		css += `${root} .svbMainArea .fieldItem .labelArea .help svg { fill: ${label.helpColor}; }`;
	}

	return css;
};

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * @param {Object} attributes Full block attributes.
 * @param {string} id Instance wrapper id (without `#`).
 * @param {boolean} isPremium Whether Pro is active.
 * @return {string} Scoped CSS for the design system.
 */
export const getDesignCSS = (attributes, id, isPremium = false) => {
	const design = resolveDesign(attributes?.design, isPremium);
	const root = `#${id}`;

	return [
		themeVarsCSS(root, design, isPremium),
		layoutCSS(root, design),
		cardCSS(root, design, isPremium),
		inputCSS(root, design, isPremium),
		buttonCSS(root, design, isPremium),
		backgroundCSS(root, design, isPremium),
		animationCSS(root, design),
		progressCSS(root, design, isPremium),
		successCSS(root, design, isPremium),
		detailCSS(root, design, isPremium)
	].filter(Boolean).join('\n');
};

/**
 * Class names applied to the `<form>` element so the static stylesheet can hook
 * into the current design without needing generated CSS for every rule.
 *
 * @param {Object} design Resolved design object.
 * @return {string} Space separated class list.
 */
export const getDesignClasses = design => [
	`svbTheme-${design.theme}`,
	`svbLayout-${design.layout}`,
	`svbInput-${design.inputStyle}`,
	`svbBtn-${design.button.variant}`,
	design.card?.enable ? 'svbHasCards' : '',
	design.background?.enable ? 'svbHasBackdrop' : ''
].filter(Boolean).join(' ');

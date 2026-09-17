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
 */

import { getBorderCSS, getBoxCSS, getMultiShadowCSS } from '../../../bpl-tools/utils/getCSS';
import { getDesign, safeOption, THEMES, LAYOUTS, INPUT_STYLES, BUTTON_VARIANTS, BUTTON_HOVERS, ANIMATIONS, PROGRESS_STYLES, SUCCESS_STYLES, SUCCESS_ANIMATIONS, DIVIDER_STYLES } from './design';

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

	const themeIsPro = Boolean(THEMES.find(t => t.name === d.theme)?.pro);

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
	const theme = THEMES.find(t => t.name === design.theme);

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

	if ('card' === layout || 'floating' === layout) {
		css += `
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
	}

	if ('floating' === layout) {
		css += `
			${item} .fieldMainArea { box-shadow: var(--svb-card-shadow, 0 4px 14px rgba(15, 23, 42, 0.07)); }
			${item} .fieldMainArea:hover,
			${item} .fieldMainArea:focus-within {
				transform: translateY(-3px);
				box-shadow: var(--svb-card-hover-shadow, 0 14px 32px rgba(15, 23, 42, 0.14));
				border-color: var(--svb-accent, currentColor);
			}
		`;
	}

	if ('minimal' === layout) {
		css += `
			${item} .fieldMainArea { padding-bottom: var(--svb-gap, 18px); border-bottom: 1px solid var(--svb-divider, #e5e7eb); }
			${item}:last-of-type .fieldMainArea { border-bottom: 0; padding-bottom: 0; }
			${item} .svbSectionDivider { border-bottom: 0; }
		`;
	}

	if ('split' === layout) {
		css += `
			@media only screen and (min-width: 900px) {
				${form} { display: grid; grid-template-columns: minmax(220px, 34%) 1fr; column-gap: 44px; align-items: start; }
				${form} .titleArea { grid-column: 1; grid-row: 1; }
				${form} .descriptionArea { grid-column: 1; grid-row: 2; align-self: start; }
				${form} .svbProgressArea { grid-column: 1; grid-row: 3; }
				${form} .mainFieldArea { grid-column: 2; grid-row: 1 / span 4; }
				${form} .svb_required_notice { grid-column: 2; }
				${form} .titleArea .title { margin-top: 0; }
			}
		`;
	}

	if ('fullwidth' === layout) {
		css += `
			${form} { text-align: initial; }
			${root} .svbMainArea .titleArea .title { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); }
			${root} .svbMainArea .descriptionArea .description { font-size: clamp(1rem, .95rem + .3vw, 1.15rem); }
			${item} { margin-bottom: var(--svb-gap, 22px); }
		`;
	}

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

const cardCSS = (root, design, isPremium) => {
	const { card } = design;

	if (!card?.enable || !isPremium) {
		return '';
	}

	const target = `${root} .svbMainArea .mainFieldArea .fieldItem .fieldMainArea`;
	const bg = 'gradient' === card.bgType ? card.gradient : card.bg;
	const shadow = card.shadow?.length ? getMultiShadowCSS(card.shadow) : '';
	const padding = getBoxCSS(card.padding);
	const border = getBorderCSS(card.border);

	let css = `
		${target} {
			${bg ? `background: ${bg};` : 'background: var(--svb-card-bg, #ffffff);'}
			${border?.trim() ? border : 'border: 1px solid var(--svb-card-border-color, #e6e8ec);'}
			${padding ? `padding: ${padding};` : 'padding: var(--svb-card-padding, 16px 18px);'}
			${shadow ? `box-shadow: ${shadow};` : ''}
			transition: box-shadow var(--svb-transition, .25s) ease, transform var(--svb-transition, .25s) ease, border-color var(--svb-transition, .25s) ease;
		}
		${target} .svbSectionDivider { margin-top: 0; }
	`;

	if ('lift' === card.hoverEffect) {
		css += `${target}:hover { transform: translateY(-3px); box-shadow: var(--svb-card-hover-shadow, 0 12px 28px rgba(15, 23, 42, 0.12)); }`;
	} else if ('glow' === card.hoverEffect) {
		css += `${target}:hover { box-shadow: 0 0 0 3px var(--svb-accent-soft, rgba(69, 39, 164, .12)); }`;
	} else if ('border' === card.hoverEffect) {
		css += `${target}:hover { border-color: var(--svb-accent, #4527a4); }`;
	}

	return css;
};

const inputCSS = (root, design, isPremium) => {
	const { inputStyle, input } = design;
	const area = `${root} .svbMainArea .fieldItem .fieldArea`;
	const sel = TEXT_INPUTS.map(s => `${area} ${s}`).join(', ');
	const focusSel = TEXT_INPUTS.map(s => `${area} ${s}:focus`).join(', ');
	const hoverSel = TEXT_INPUTS.map(s => `${area} ${s}:hover:not(:focus)`).join(', ');
	const placeholderSel = TEXT_INPUTS.map(s => `${area} ${s}::placeholder`).join(', ');

	const focus = (isPremium && input?.focusColor) || 'var(--svb-input-focus, #4527a4)';
	const ring = false === input?.focusRing ? '' : `box-shadow: 0 0 0 3px var(--svb-input-focus-ring, rgba(69, 39, 164, .15));`;

	let css = `
		${sel} { transition: border-color var(--svb-transition, .2s) ease, box-shadow var(--svb-transition, .2s) ease, background-color var(--svb-transition, .2s) ease; }
		${hoverSel} { border-color: var(--svb-input-hover, var(--svb-input-focus, #4527a4)); }
		${focusSel} { outline: none; border-color: ${focus}; ${ring} }
		${root} .svbMainArea .fieldItem .fieldArea input[type=checkbox],
		${root} .svbMainArea .fieldItem .fieldArea input[type=radio],
		${root} .svbMainArea .fieldItem .fieldArea input[type=range] { accent-color: var(--svb-accent, #4527a4); }
	`;

	if (isPremium && input?.placeholderColor) {
		css += `${placeholderSel} { color: ${input.placeholderColor}; opacity: 1; }`;
	} else {
		css += `${placeholderSel} { color: var(--svb-placeholder, inherit); }`;
	}

	if (isPremium && input?.bg) {
		css += `${sel} { background-color: ${input.bg}; }`;
	}

	if (isPremium && input?.radius) {
		css += `${sel} { border-radius: ${px(input.radius)}; }`;
	}

	switch (inputStyle) {
		case 'outlined':
			css += `
				${sel} { background-color: var(--svb-input-bg, transparent); border-width: 1px; border-style: solid; }
				${focusSel} { border-width: 1px; }
			`;
			break;

		case 'filled':
			css += `
				${sel} { background-color: var(--svb-input-filled-bg, var(--svb-accent-soft, rgba(15, 23, 42, .05))); border-color: transparent; box-shadow: var(--svb-input-shadow, none); }
				${hoverSel} { border-color: transparent; background-color: var(--svb-input-filled-hover, var(--svb-accent-soft, rgba(15, 23, 42, .08))); }
				${focusSel} { border-color: ${focus}; }
			`;
			break;

		case 'underline':
			css += `
				${sel} { background-color: transparent; border-width: 0 0 2px 0; border-style: solid; border-radius: 0; padding-left: 0; padding-right: 0; }
				${hoverSel} { border-width: 0 0 2px 0; }
				${area} .selectArea select { padding-left: 0; }
			`;

			// A ring would float away from a borderless field, so focus thickens
			// the rule instead. Never `box-shadow: none` here - that would leave
			// keyboard users with no focus indicator at all.
			css += false === input?.focusRing
				? `${focusSel} { border-width: 0 0 2px 0; box-shadow: none; border-bottom-color: ${focus}; }`
				: `${focusSel} { border-width: 0 0 2px 0; border-bottom-color: ${focus}; box-shadow: 0 2px 0 -1px ${focus}; }`;
			break;

		case 'rounded':
			css += `${sel} { border-radius: 999px; } ${area} textarea { border-radius: 18px; }`;
			break;

		case 'floating': {
			// Only single-input fields can float a label; choice fields, ratings and
			// dividers are marked `svbNoFloat` by Form.js and keep a normal label.
			const floatItem = `${root} .svbMainArea .mainFieldArea .fieldItem:not(.svbNoFloat)`;

			css += `
				${floatItem} .fieldMainArea { position: relative; padding-top: 8px; }
				${floatItem} .labelArea {
					position: absolute; top: calc(8px + var(--svb-float-mid, 1.35em)); left: 11px; transform: translateY(-50%);
					pointer-events: none; transition: top .18s ease, transform .18s ease, color .18s ease;
					z-index: 1; margin: 0; width: auto; max-width: calc(100% - 24px);
				}
				${floatItem} .labelArea .labelHelp { width: auto; }
				${floatItem} .labelArea label { background: var(--svb-input-bg, #ffffff); padding: 0 5px; border-radius: 3px; pointer-events: auto; white-space: nowrap; }
				${floatItem} .fieldMainArea:focus-within .labelArea,
				${floatItem} .fieldMainArea:has(input:not(:placeholder-shown)) .labelArea,
				${floatItem} .fieldMainArea:has(textarea:not(:placeholder-shown)) .labelArea {
					top: 8px; transform: translateY(-50%) scale(.86); transform-origin: left center; color: ${focus};
				}
				${floatItem} textarea { min-height: 96px; }
				${floatItem} .fieldMainArea:not(:focus-within) input:placeholder-shown::placeholder,
				${floatItem} .fieldMainArea:not(:focus-within) textarea:placeholder-shown::placeholder { color: transparent; }
			`;
			break;
		}

		default:
			break;
	}

	return css;
};

const buttonCSS = (root, design, isPremium) => {
	const { button } = design;
	const btn = `${root} .subBtn`;
	const area = `${root} .subBtnArea`;
	const speed = `${parseInt(button.transition) || 250}ms`;

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

		case 'gradient':
			if (isPremium) {
				css += `${btn} { background: ${button.gradient || 'var(--svb-accent, #4527a4)'}; border: none; box-shadow: var(--svb-btn-shadow, none); background-size: 180% 180%; }`;
			}
			break;

		case 'soft':
			if (isPremium) {
				css += `
					${btn} { background: var(--svb-accent-soft, rgba(69, 39, 164, .12)); color: var(--svb-accent, #4527a4); border: none; box-shadow: none; }
					${btn}:hover { background: var(--svb-accent, #4527a4); color: #ffffff; }
				`;
			}
			break;

		case 'minimal':
			if (isPremium) {
				css += `
					${btn} { background: transparent; border: none; box-shadow: none; color: var(--svb-accent, #4527a4); padding-left: 4px; padding-right: 4px; }
					${btn}::after { content: ''; position: absolute; left: 4px; right: 4px; bottom: 6px; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform ${speed} ease; }
					${btn}:hover::after { transform: scaleX(1); }
				`;
			}
			break;

		default:
			break;
	}

	if (isPremium && button.hoverColors?.bg) {
		css += `${btn}:hover { background: ${button.hoverColors.bg}; }`;
	}

	if (isPremium && button.hoverColors?.color) {
		css += `${btn}:hover { color: ${button.hoverColors.color}; }`;
	}

	switch (button.hoverEffect) {
		case 'lift':
			css += `${btn}:hover { transform: translateY(-2px); box-shadow: var(--svb-btn-hover-shadow, 0 10px 22px rgba(15, 23, 42, .18)); }`;
			break;

		case 'scale':
			css += `${btn}:hover { transform: scale(1.025); }`;
			break;

		case 'glow':
			css += `${btn}:hover { box-shadow: 0 0 0 4px var(--svb-accent-soft, rgba(69, 39, 164, .25)); }`;
			break;

		case 'slide':
			css += `
				${btn}::before { content: ''; position: absolute; inset: 0; background: var(--svb-accent-alt, rgba(255, 255, 255, .18)); transform: translateX(-101%); transition: transform ${speed} ease; z-index: 0; }
				${btn}:hover::before { transform: translateX(0); }
				${btn} > * { position: relative; z-index: 1; }
			`;
			break;

		default:
			break;
	}

	return css;
};

const backgroundCSS = (root, design, isPremium) => {
	const { background: bg } = design;

	if (!bg?.enable || !isPremium) {
		return '';
	}

	const wrap = `${root} .svbMainArea`;
	let css = '';

	if ('gradient' === bg.type) {
		css += `${wrap} { background: ${bg.gradient || 'transparent'}; }`;
	} else if ('image' === bg.type && bg.image?.url) {
		css += `
			${wrap} {
				background-image: ${bg.overlayColor ? `linear-gradient(${bg.overlayColor}, ${bg.overlayColor}), ` : ''}url('${String(bg.image.url).replace(/['"()]/g, '')}');
				background-position: ${bg.position || 'center center'};
				background-size: ${bg.size || 'cover'};
				background-repeat: ${bg.repeat || 'no-repeat'};
				background-attachment: ${bg.attachment || 'scroll'};
			}
		`;
	} else if (bg.color) {
		css += `${wrap} { background: ${bg.color}; }`;
	}

	// A backdrop needs breathing room, otherwise the form covers it entirely.
	css += `${wrap} { padding: var(--svb-bg-padding, 26px); border-radius: var(--svb-bg-radius, 20px); }`;

	if (bg.blur > 0) {
		css += `
			${root} form { backdrop-filter: blur(${px(bg.blur)}); -webkit-backdrop-filter: blur(${px(bg.blur)}); }
			${root} .svbMainArea .mainFieldArea .fieldItem .fieldMainArea { backdrop-filter: blur(var(--svb-card-blur, 6px)); -webkit-backdrop-filter: blur(var(--svb-card-blur, 6px)); }
		`;
	}

	return css;
};

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
	const fill = 'gradient' === progress.style && isPremium
		? (progress.gradient || 'var(--svb-accent, #4527a4)')
		: (progress.color || 'var(--svb-accent, #4527a4)');
	const track = progress.trackColor || 'var(--svb-progress-track, rgba(15, 23, 42, .10))';
	const height = px(progress.height) || '6px';

	return `
		${wrap} { --svb-progress-fill: ${fill}; --svb-progress-track: ${track}; --svb-progress-height: ${height}; }
		${wrap} .svbProgressLabel { color: var(--svb-muted, inherit); }
		${wrap} .svbProgressCircle .svbProgressCircleValue { stroke: ${progress.color || 'var(--svb-accent, #4527a4)'}; }
	`;
};

const successCSS = (root, design, isPremium) => {
	const { success } = design;
	const wrap = `${root} .successArea`;

	let css = `${wrap} .svbSuccessIcon { color: ${success.iconColor || 'var(--svb-success-color, currentColor)'}; }`;

	if (success.bg && isPremium) {
		css += `${wrap}.svbSuccess-card, ${wrap}.svbSuccess-banner, ${wrap}.svbSuccess-replace { background: ${success.bg}; }`;
	}

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
	} else if ('gradient' === divider?.style && isPremium) {
		css += `${line} { border: none; height: ${thickness}; background: linear-gradient(90deg, var(--svb-accent, #4527a4), transparent); }`;
	} else {
		css += `${line} { border-top: ${thickness} ${divider?.style || 'solid'} ${color}; }`;
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

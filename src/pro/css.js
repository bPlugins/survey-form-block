/**
 * Premium CSS for the design system.
 *
 * Premium build only. Each function fills one `svb.design.css.<slot>` filter
 * that `src/utils/designCSS.js` calls at the point the rule used to sit, so the
 * cascade is exactly what it was before the split. The rules themselves moved
 * here unchanged.
 */

import { addFilter } from '@wordpress/hooks';

const NS = 'svb/pro-design';

/** Floating, Split and Full Width layouts. */
const layout = (css, { design, form, item, root, cardSurfaceCSS }) => {
	const { layout: name } = design;

	if ('floating' === name) {
		return css + cardSurfaceCSS(item) + `
			${item} .fieldMainArea { box-shadow: var(--svb-card-shadow, 0 4px 14px rgba(15, 23, 42, 0.07)); }
			${item} .fieldMainArea:hover,
			${item} .fieldMainArea:focus-within {
				transform: translateY(-3px);
				box-shadow: var(--svb-card-hover-shadow, 0 14px 32px rgba(15, 23, 42, 0.14));
				border-color: var(--svb-accent, currentColor);
			}
		`;
	}

	if ('split' === name) {
		return css + `
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

	if ('fullwidth' === name) {
		return css + `
			${form} { text-align: initial; }
			${root} .svbMainArea .titleArea .title { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); }
			${root} .svbMainArea .descriptionArea .description { font-size: clamp(1rem, .95rem + .3vw, 1.15rem); }
			${item} { margin-bottom: var(--svb-gap, 22px); }
		`;
	}

	return css;
};

/** Question card designer. */
const card = (css, { root, design, isPremium, tools }) => {
	const { card: c } = design;

	if (!c?.enable || !isPremium) {
		return css;
	}

	const target = `${root} .svbMainArea .mainFieldArea .fieldItem .fieldMainArea`;
	const bg = 'gradient' === c.bgType ? c.gradient : c.bg;
	const shadow = c.shadow?.length ? tools.getMultiShadowCSS(c.shadow) : '';
	const padding = tools.getBoxCSS(c.padding);
	const border = tools.getBorderCSS(c.border);

	css += `
		${target} {
			${bg ? `background: ${bg};` : 'background: var(--svb-card-bg, #ffffff);'}
			${border?.trim() ? border : 'border: 1px solid var(--svb-card-border-color, #e6e8ec);'}
			${padding ? `padding: ${padding};` : 'padding: var(--svb-card-padding, 16px 18px);'}
			${shadow ? `box-shadow: ${shadow};` : ''}
			transition: box-shadow var(--svb-transition, .25s) ease, transform var(--svb-transition, .25s) ease, border-color var(--svb-transition, .25s) ease;
		}
		${target} .svbSectionDivider { margin-top: 0; }
	`;

	if ('lift' === c.hoverEffect) {
		css += `${target}:hover { transform: translateY(-3px); box-shadow: var(--svb-card-hover-shadow, 0 12px 28px rgba(15, 23, 42, 0.12)); }`;
	} else if ('glow' === c.hoverEffect) {
		css += `${target}:hover { box-shadow: 0 0 0 3px var(--svb-accent-soft, rgba(69, 39, 164, .12)); }`;
	} else if ('border' === c.hoverEffect) {
		css += `${target}:hover { border-color: var(--svb-accent, #4527a4); }`;
	}

	return css;
};

/** Custom focus colour. */
const inputFocus = (focus, { design, isPremium }) => (isPremium && design.input?.focusColor) || focus;

/** Custom placeholder colour; replaces the free rule. */
const inputPlaceholder = (css, { input, isPremium, placeholderSel }) => (
	isPremium && input?.placeholderColor ? `${placeholderSel} { color: ${input.placeholderColor}; opacity: 1; }` : css
);

/** Field background and corner radius. */
const inputExtras = (css, { input, isPremium, sel, tools }) => {
	if (isPremium && input?.bg) {
		css += `${sel} { background-color: ${input.bg}; }`;
	}

	if (isPremium && input?.radius) {
		css += `${sel} { border-radius: ${tools.px(input.radius)}; }`;
	}

	return css;
};

/** Filled, Underline, Rounded and Floating Label input styles. */
const inputStyle = (css, { root, design, input, area, sel, focusSel, hoverSel, focus }) => {
	switch (design.inputStyle) {
		case 'filled':
			return css + `
				${sel} { background-color: var(--svb-input-filled-bg, var(--svb-accent-soft, rgba(15, 23, 42, .05))); border-color: transparent; box-shadow: var(--svb-input-shadow, none); }
				${hoverSel} { border-color: transparent; background-color: var(--svb-input-filled-hover, var(--svb-accent-soft, rgba(15, 23, 42, .08))); }
				${focusSel} { border-color: ${focus}; }
			`;

		case 'underline':
			css += `
				${sel} { background-color: transparent; border-width: 0 0 2px 0; border-style: solid; border-radius: 0; padding-left: 0; padding-right: 0; }
				${hoverSel} { border-width: 0 0 2px 0; }
				${area} .selectArea select { padding-left: 0; }
			`;

			// A ring would float away from a borderless field, so focus thickens
			// the rule instead. Never `box-shadow: none` here - that would leave
			// keyboard users with no focus indicator at all.
			return css + (false === input?.focusRing
				? `${focusSel} { border-width: 0 0 2px 0; box-shadow: none; border-bottom-color: ${focus}; }`
				: `${focusSel} { border-width: 0 0 2px 0; border-bottom-color: ${focus}; box-shadow: 0 2px 0 -1px ${focus}; }`);

		case 'rounded':
			return css + `${sel} { border-radius: 999px; } ${area} textarea { border-radius: 18px; }`;

		case 'floating': {
			// Only single-input fields can float a label; choice fields, ratings and
			// dividers are marked `svbNoFloat` by Form.js and keep a normal label.
			const floatItem = `${root} .svbMainArea .mainFieldArea .fieldItem:not(.svbNoFloat)`;

			return css + `
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
		}

		default:
			return css;
	}
};

/** Gradient, Soft and Minimal buttons. */
const buttonVariant = (css, { button, isPremium, btn, speed }) => {
	if (!isPremium) {
		return css;
	}

	switch (button.variant) {
		case 'gradient':
			return css + `${btn} { background: ${button.gradient || 'var(--svb-accent, #4527a4)'}; border: none; box-shadow: var(--svb-btn-shadow, none); background-size: 180% 180%; }`;

		case 'soft':
			return css + `
				${btn} { background: var(--svb-accent-soft, rgba(69, 39, 164, .12)); color: var(--svb-accent, #4527a4); border: none; box-shadow: none; }
				${btn}:hover { background: var(--svb-accent, #4527a4); color: #ffffff; }
			`;

		case 'minimal':
			return css + `
				${btn} { background: transparent; border: none; box-shadow: none; color: var(--svb-accent, #4527a4); padding-left: 4px; padding-right: 4px; }
				${btn}::after { content: ''; position: absolute; left: 4px; right: 4px; bottom: 6px; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform ${speed} ease; }
				${btn}:hover::after { transform: scaleX(1); }
			`;

		default:
			return css;
	}
};

/** "On hover" colours. */
const buttonHoverColors = (css, { button, isPremium, btn }) => {
	if (isPremium && button.hoverColors?.bg) {
		css += `${btn}:hover { background: ${button.hoverColors.bg}; }`;
	}

	if (isPremium && button.hoverColors?.color) {
		css += `${btn}:hover { color: ${button.hoverColors.color}; }`;
	}

	return css;
};

/** Scale, Glow and Slide Fill hover effects. */
const buttonHover = (css, { button, btn, speed }) => {
	switch (button.hoverEffect) {
		case 'scale':
			return css + `${btn}:hover { transform: scale(1.025); }`;

		case 'glow':
			return css + `${btn}:hover { box-shadow: 0 0 0 4px var(--svb-accent-soft, rgba(69, 39, 164, .25)); }`;

		case 'slide':
			return css + `
				${btn}::before { content: ''; position: absolute; inset: 0; background: var(--svb-accent-alt, rgba(255, 255, 255, .18)); transform: translateX(-101%); transition: transform ${speed} ease; z-index: 0; }
				${btn}:hover::before { transform: translateX(0); }
				${btn} > * { position: relative; z-index: 1; }
			`;

		default:
			return css;
	}
};

/** Survey backdrop. */
const background = (css, { root, design, isPremium, tools }) => {
	const { background: bg } = design;

	if (!bg?.enable || !isPremium) {
		return css;
	}

	const wrap = `${root} .svbMainArea`;

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
			${root} form { backdrop-filter: blur(${tools.px(bg.blur)}); -webkit-backdrop-filter: blur(${tools.px(bg.blur)}); }
			${root} .svbMainArea .mainFieldArea .fieldItem .fieldMainArea { backdrop-filter: blur(var(--svb-card-blur, 6px)); -webkit-backdrop-filter: blur(var(--svb-card-blur, 6px)); }
		`;
	}

	return css;
};

/** Gradient progress fill. */
const progressFill = (fill, { design, isPremium }) => (
	'gradient' === design.progress?.style && isPremium ? (design.progress.gradient || 'var(--svb-accent, #4527a4)') : fill
);

/** Circular progress stroke colour. */
const progress = (css, { design, wrap }) => css + `
		${wrap} .svbProgressCircle .svbProgressCircleValue { stroke: ${design.progress.color || 'var(--svb-accent, #4527a4)'}; }
	`;

/** Success panel background. */
const successBg = (css, { design, isPremium, wrap }) => (
	design.success?.bg && isPremium
		? css + `${wrap}.svbSuccess-card, ${wrap}.svbSuccess-banner, ${wrap}.svbSuccess-replace { background: ${design.success.bg}; }`
		: css
);

/** Gradient section divider. */
const dividerLine = (css, { design, isPremium, line, thickness }) => (
	'gradient' === design.divider?.style && isPremium
		? `${line} { border: none; height: ${thickness}; background: linear-gradient(90deg, var(--svb-accent, #4527a4), transparent); }`
		: css
);

export const registerProCSS = () => {
	addFilter('svb.design.css.layout', NS, layout);
	addFilter('svb.design.css.card', NS, card);
	addFilter('svb.design.inputFocus', NS, inputFocus);
	addFilter('svb.design.css.inputPlaceholder', NS, inputPlaceholder);
	addFilter('svb.design.css.inputExtras', NS, inputExtras);
	addFilter('svb.design.css.inputStyle', NS, inputStyle);
	addFilter('svb.design.css.buttonVariant', NS, buttonVariant);
	addFilter('svb.design.css.buttonHoverColors', NS, buttonHoverColors);
	addFilter('svb.design.css.buttonHover', NS, buttonHover);
	addFilter('svb.design.css.background', NS, background);
	addFilter('svb.design.progressFill', NS, progressFill);
	addFilter('svb.design.css.progress', NS, progress);
	addFilter('svb.design.css.successBg', NS, successBg);
	addFilter('svb.design.css.dividerLine', NS, dividerLine);
};

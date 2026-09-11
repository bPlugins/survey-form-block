/**
 * One-click theme presets.
 *
 * Picking a theme writes its palette into the *existing* style attributes
 * (`form`, `input`, `button`, `labelS`, `radioCheckLabelColor`) so every colour
 * stays adjustable in the Style tab afterwards. Content - titles, descriptions,
 * fields, help text, the success message, typography families and sizes - is
 * never touched.
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, Notice } from '@wordpress/components';

import { THEMES, applyTheme } from '../../../utils/design';
import { ProTag } from './Shared';

const ThemeSwatch = ({ swatch }) => (
	<span className="svbThemeSwatch" style={{ background: swatch.bg, borderColor: swatch.border }}>
		<span className="svbThemeSwatchLine" style={{ background: swatch.text }} />
		<span className="svbThemeSwatchLine short" style={{ background: swatch.text, opacity: .45 }} />
		<span className="svbThemeSwatchBtn" style={{ background: swatch.accent }} />
	</span>
);

const ThemePanel = ({ attributes, setAttributes, design, isPremium, onProClick }) => {
	const free = THEMES.filter(t => !t.pro);
	const pro = THEMES.filter(t => t.pro);

	const pick = theme => {
		if (theme.pro && !isPremium) {
			return onProClick();
		}

		setAttributes(applyTheme(theme.name, attributes));
	};

	const renderTheme = theme => {
		const locked = theme.pro && !isPremium;
		const active = design.theme === theme.name;

		return (
			<button
				key={theme.name}
				type="button"
				className={`svbThemeCard ${active ? 'isActive' : ''} ${locked ? 'isLocked' : ''}`}
				onClick={() => pick(theme)}
				title={theme.description}
				aria-pressed={active}
			>
				<ThemeSwatch swatch={theme.swatch} />
				<span className="svbThemeName">{theme.label}</span>
				{locked && <span className="svbThemeLock">{__('Pro', 'survey-form-block')}</span>}
			</button>
		);
	};

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Theme Presets', 'survey-form-block')} initialOpen={true}>
			<div className="svbThemeGrid">{free.map(renderTheme)}</div>

			<div className="svbPanelDivider">
				<span>{__('Premium Themes', 'survey-form-block')}</span>
				<ProTag />
			</div>

			<div className="svbThemeGrid">{pro.map(renderTheme)}</div>

			<Notice status="info" isDismissible={false} className="svbInlineNotice">
				{__('Applying a theme updates colours, borders and button styles. Your questions, wording and typography stay exactly as they are.', 'survey-form-block')}
			</Notice>
		</PanelBody>
	);
};

export default ThemePanel;

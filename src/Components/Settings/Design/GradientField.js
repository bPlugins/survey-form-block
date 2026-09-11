/**
 * Thin wrapper over Gutenberg's gradient picker with a curated preset list, so
 * the block does not ship its own colour-stop editor.
 */

import { __ } from '@wordpress/i18n';
import { GradientPicker, __experimentalGradientPicker, TextControl } from '@wordpress/components';

const Picker = GradientPicker || __experimentalGradientPicker;

export const GRADIENT_PRESETS = [
	{ name: __('Indigo Violet', 'survey-form-block'), gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', slug: 'indigo-violet' },
	{ name: __('Ocean', 'survey-form-block'), gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', slug: 'ocean' },
	{ name: __('Sunset', 'survey-form-block'), gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)', slug: 'sunset' },
	{ name: __('Forest', 'survey-form-block'), gradient: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)', slug: 'forest' },
	{ name: __('Midnight', 'survey-form-block'), gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', slug: 'midnight' },
	{ name: __('Blush', 'survey-form-block'), gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', slug: 'blush' },
	{ name: __('Citrus', 'survey-form-block'), gradient: 'linear-gradient(135deg, #fde68a 0%, #f97316 100%)', slug: 'citrus' },
	{ name: __('Aurora', 'survey-form-block'), gradient: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)', slug: 'aurora' }
];

const GradientField = ({ value, onChange, label = '' }) => {
	if (!Picker) {
		return <TextControl label={label || __('Gradient CSS', 'survey-form-block')} value={value || ''} onChange={onChange} />;
	}

	return (
		<div className="svbGradientField">
			{label && <span className="svbGradientLabel">{label}</span>}

			<Picker
				value={value}
				gradients={GRADIENT_PRESETS}
				onChange={val => onChange(val || '')}
				clearable={false}
				__nextHasNoMargin
			/>
		</div>
	);
};

export default GradientField;

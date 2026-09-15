import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Column width for one field.
 *
 * Uses SelectControl's own label rather than a PanelRow with a separate Label,
 * so it lines up with the other field settings instead of sitting on its own
 * horizontal row.
 */
const Size = ({ value, onChange }) => (
	<SelectControl
		label={__('Width', 'survey-form-block')}
		value={value}
		onChange={val => onChange(Number(val))}
		options={[
			{ label: __('Full Width (100%)', 'survey-form-block'), value: 100 },
			{ label: __('Two Thirds (66%)', 'survey-form-block'), value: 66 },
			{ label: __('Half Width (50%)', 'survey-form-block'), value: 50 },
			{ label: __('One Third (33%)', 'survey-form-block'), value: 33 },
			{ label: __('One Fourth (25%)', 'survey-form-block'), value: 25 },
		]}
	/>
);

export default Size;

import { CheckboxControl, SelectControl, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { LabelPositionOpt } from '../../../utils/options';
import Width from '../FieldAttr/Size';

/**
 * Shared settings for every single-value field type.
 *
 * Labels come from each control's own `label` prop rather than a bare <label>
 * element beside it: WordPress then owns the spacing and the for/id pairing, so
 * the panel keeps an even rhythm instead of collapsing each caption onto the
 * control above it.
 */
const Text = ({ updateFields, index, size, isRequired, isDisable, label, labelPosition, placeholder, classes, help, type }) => {
	const hasPlaceholder = !['toggle', 'star_rating', 'opinion_scale', 'nps', 'range_slider', 'section'].includes(type);

	return <div className="svbFieldSettings">
		<TextControl
			label={__('Label', 'survey-form-block')}
			value={label}
			placeholder={__('Label here', 'survey-form-block')}
			onChange={(val) => updateFields(index, 'label', val)}
		/>

		<SelectControl
			label={__('Label Position', 'survey-form-block')}
			value={labelPosition}
			options={LabelPositionOpt}
			onChange={(val) => updateFields(index, 'labelPosition', val)}
		/>

		{hasPlaceholder && <TextControl
			label={__('Placeholder', 'survey-form-block')}
			value={placeholder}
			placeholder={__('Placeholder here', 'survey-form-block')}
			onChange={(val) => updateFields(index, 'placeholder', val)}
		/>}

		<TextareaControl
			label={__('Help Text', 'survey-form-block')}
			value={help}
			placeholder={__('Shown in a tooltip beside the label', 'survey-form-block')}
			onChange={(val) => updateFields(index, 'help', val)}
		/>

		<Width value={size} onChange={val => updateFields(index, 'size', val)} />

		<div className="svbCheckGroup">
			<CheckboxControl
				label={__('Disable', 'survey-form-block')}
				checked={isDisable}
				onChange={(val) => updateFields(index, 'isDisable', val)}
			/>

			{!isDisable && <CheckboxControl
				label={__('Required', 'survey-form-block')}
				checked={isRequired}
				onChange={(val) => updateFields(index, 'isRequired', val)}
			/>}
		</div>

		<TextControl
			label={__('CSS Class', 'survey-form-block')}
			value={classes}
			placeholder={__('class name', 'survey-form-block')}
			onChange={(val) => updateFields(index, 'classes', val)}
		/>
	</div>;
};

export default Text;

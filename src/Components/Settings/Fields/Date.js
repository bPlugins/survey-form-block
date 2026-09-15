import { CheckboxControl, SelectControl, TextControl, TextareaControl, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { LabelPositionOpt } from '../../../utils/options';
import Width from '../FieldAttr/Size';

/**
 * Settings for the date picker, which adds a selectable year range.
 */
const Date = ({ updateFields, index, size, isRequired, isDisable, label, labelPosition, classes, help, start, end }) => {
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

		<Flex className='svbYearRange' gap={3} align='flex-start'>
			<FlexItem isBlock>
				<TextControl
					label={__('First Year', 'survey-form-block')}
					value={start}
					onChange={(val) => updateFields(index, 'start', val)}
				/>
			</FlexItem>

			<FlexItem isBlock>
				<TextControl
					label={__('Last Year', 'survey-form-block')}
					value={end}
					onChange={(val) => updateFields(index, 'end', val)}
				/>
			</FlexItem>
		</Flex>

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

export default Date;

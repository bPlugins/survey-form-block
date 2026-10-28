import { CheckboxControl, SelectControl, TextControl, TextareaControl, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { LabelPositionOpt } from '../../../utils/options';
import Width from '../FieldAttr/Size';

/**
 * Settings for the date picker, which adds a selectable year range.
 */
const Date = ({ updateFields, index, size, isRequired, isDisable, label, labelPosition, classes, help, start, end }) => {
	// 1990-2023 was the automatic default until 1.2.0 and is now read as "no
	// limit" (see utils/answers.js), so show it as blank rather than as a range
	// the form no longer applies.
	const isLegacyRange = '1990' === String(start ?? '') && '2023' === String(end ?? '');

	// Editing one year of a legacy range clears the other, which the author
	// sees as blank; otherwise the hidden 2023 would become a real limit.
	const setYear = (key, val) => (isLegacyRange
		? updateFields(index, { start: '', end: '', [key]: val })
		: updateFields(index, key, val));

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
					value={isLegacyRange ? '' : start}
					onChange={(val) => setYear('start', val)}
				/>
			</FlexItem>

			<FlexItem isBlock>
				<TextControl
					label={__('Last Year', 'survey-form-block')}
					value={isLegacyRange ? '' : end}
					onChange={(val) => setYear('end', val)}
				/>
			</FlexItem>
		</Flex>

		<p className='svbScaleHelp'>{__('Leave blank for no limit. Visitors pick the date from their browser\'s calendar.', 'survey-form-block')}</p>

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

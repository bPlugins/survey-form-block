import { CheckboxControl, SelectControl, TextControl, TextareaControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';
import { __ } from '@wordpress/i18n';

import { duplicate, remove } from '../../../utils/icons';
import { valueConvert } from '../../../utils/functions';
import { LabelPositionOpt } from '../../../utils/options';
import Width from '../FieldAttr/Size';

/**
 * Settings for the choice fields (checkbox group, radio, dropdown).
 */
const MultipleInput = ({ updateFields, column, options, index, size, isRequired, isDisable, label, labelPosition, classes, help, addChildField, onDuplicateChildField, onRemoveChildField }) => {
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

		<TextareaControl
			label={__('Help Text', 'survey-form-block')}
			value={help}
			placeholder={__('Shown in a tooltip beside the label', 'survey-form-block')}
			onChange={(val) => updateFields(index, 'help', val)}
		/>

		<div className='svbOptionList'>
			<span className='svbOptionListLabel'>{__('Choices', 'survey-form-block')}</span>

			<div className='inputArea'>
				{options?.map((option, childIndex) => (
					<div key={childIndex} className="single">
						<TextControl
							value={option?.label}
							onChange={(val) => {
								const newOptions = produce(options, draft => {
									draft[childIndex] = { label: val, value: valueConvert(val) };
								});
								updateFields(index, 'options', newOptions);
							}}
						/>

						<div className="icon">
							<button type='button' title={__('Duplicate', 'survey-form-block')} onClick={() => onDuplicateChildField(index, childIndex)}>{duplicate}</button>
							<button type='button' title={__('Remove', 'survey-form-block')} onClick={() => onRemoveChildField(index, childIndex)}>{remove}</button>
						</div>
					</div>
				))}

				<button type='button' className='subBtn' onClick={() => addChildField(index)}>{__('Add Choice', 'survey-form-block')}</button>
			</div>
		</div>

		<Width value={size} onChange={val => updateFields(index, 'size', val)} />

		<NumberControl
			label={__('Choice Columns', 'survey-form-block')}
			value={column}
			min={1}
			max={4}
			onChange={(val) => updateFields(index, 'column', val)}
		/>

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

export default MultipleInput;

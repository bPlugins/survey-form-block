



import { CheckboxControl, SelectControl, TextControl, TextareaControl } from '@wordpress/components';
import { LabelPositionOpt } from '../../../utils/options';
import Width from '../FieldAttr/Size';
import { __ } from '@wordpress/i18n';

const Text = ({ updateFields, index, size, isRequired, isDisable, label, labelPosition, placeholder, classes, help }) => {

    return <>
        {/* Label  */}
        <label htmlFor='label'>{__('Label', 'survey-form-block')}</label>
        <TextControl id='label' value={label} placeholder='Label Here' onChange={(val) => updateFields(index, 'label', val)} />
        {/* Label Postion  */}
        <label htmlFor='labelPosition'>{__('Label Position', 'survey-form-block')}</label>
        <SelectControl id='labelPosition' value={labelPosition} options={LabelPositionOpt} onChange={(val) => updateFields(index, 'labelPosition', val)} />
        {/* name  */}
        {/*  <TextControl value={name} placeholder='Name' onChange={(val) => updateFields(index, 'name', val)} /> */}
        {/* placeholder  */}
        <label htmlFor='placeholder'>{__('Placeholder', 'survey-form-block')}</label>
        <TextControl id='placeholder' value={placeholder} placeholder='Placeholder here' onChange={(val) => updateFields(index, 'placeholder', val)} />
        {/* isDisable  */}
        <CheckboxControl label="Disable" checked={isDisable} onChange={(val) => updateFields(index, 'isDisable', val)} />
        {/* isRequired  */}
        {!isDisable && <CheckboxControl label="Required" checked={isRequired} onChange={(val) => updateFields(index, 'isRequired', val)} />}
        {/* help  */}
        <label htmlFor='help'>{__('Help', 'survey-form-block')}</label>
        <TextareaControl id='help' value={help} placeholder='Help Text' onChange={(val) => updateFields(index, 'help', val)} />
        {/* width */}
        <Width value={size} onChange={val => updateFields(index, 'size', val)} />
        {/* classes  */}
        <label htmlFor='classes'>{__('class', 'survey-form-block')}</label>
        <TextControl id='classes' value={classes} placeholder='class name' onChange={(val) => updateFields(index, 'classes', val)} />

    </>
}
export default Text;
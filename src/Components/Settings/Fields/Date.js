
import { CheckboxControl, PanelRow, SelectControl, TextControl, TextareaControl } from '@wordpress/components';
import Width from '../FieldAttr/Size';
import { LabelPositionOpt } from '../../../utils/options';
import { __ } from '@wordpress/i18n';

const Date = ({ updateFields, index, size, isRequired, isDisable, label, labelPosition, placeholder, classes, help, start, end }) => {
    return <>
        <PanelRow className='svb-year'>
            <TextControl label={__('Start', 'survey-form-block')} value={start} onChange={(val) => updateFields(index, "start", val)} />
            <TextControl label={__('End', 'survey-form-block')} value={end} onChange={(val) => updateFields(index, "end", val)} />
        </PanelRow>
        {/* width */}
        <Width value={size} onChange={val => updateFields(index, 'size', val)} />
        {/* label  */}
        <label htmlFor='label'>{__('Label', 'survey-form-block')}</label>
        <TextControl id='label' value={label} placeholder='Label Here' onChange={(val) => updateFields(index, 'label', val)} />
        {/* label position  */}
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
        {/* classes  */}
        <label htmlFor='classes'>{__('Class', 'survey-form-block')}</label>
        <TextControl id='classes' value={classes} placeholder='class name' onChange={(val) => updateFields(index, 'classes', val)} />
    </>
}
export default Date;


import { SelectControl, TextControl, TextareaControl, __experimentalNumberControl as NumberControl, CheckboxControl } from '@wordpress/components';
import { duplicate, remove } from '../../../utils/icons';
import { produce } from 'immer';
import { valueConvert } from '../../../utils/functions';

import Width from '../FieldAttr/Size';
import { LabelPositionOpt } from '../../../utils/options';
import { __ } from '@wordpress/i18n';

const MultipleInput = ({ updateFields, column, options, index, size, isRequired, isDisable, label, labelPosition, classes, help, addChildField, onDuplicateChildField, onRemoveChildField }) => {

    return <>
        {/* label  */}
        <label htmlFor='label'>{__('Label', 'survey-form-block')}</label>
        <TextControl id='label' value={label} placeholder='Label Here' onChange={(val) => updateFields(index, 'label', val)} />
        {/* label position  */}
        <label htmlFor='labelPosition'>{__('Label Position', 'survey-form-block')}</label>
        <SelectControl id='labelPosition' value={labelPosition} options={LabelPositionOpt} onChange={(val) => updateFields(index, 'labelPosition', val)} />
        {/* name  */}
        {/*  <TextControl value={name} placeholder='Name' onChange={(val) => updateFields(index, 'name', val)} />*/}
        {/* placeholder  */}
        {/* <label htmlFor='placeholder'>Placeholder</label>
        <TextControl id='placeholder' value={placeholder} placeholder='Placeholder here' onChange={(val) => updateFields(index, 'placeholder', val)} /> */}
        {/* isDisable  */}
        <CheckboxControl label="Disable" checked={isDisable} onChange={(val) => updateFields(index, 'isDisable', val)} />
        {/* isRequired  */}
        {!isDisable && <CheckboxControl label="Required" checked={isRequired} onChange={(val) => updateFields(index, 'isRequired', val)} />}
        {/* help  */}
        <label htmlFor='help'>{__('Help', 'survey-form-block')}</label>
        <TextareaControl id='help' value={help} placeholder='Help Text' onChange={(val) => updateFields(index, 'help', val)} />
        <div className='inputArea '>
            {options?.map((option, childIndex) => {
                return <div key={childIndex} className="single">
                    <TextControl value={option?.label} onChange={(val) => {
                        const newOptions = produce(options, draft => {
                            draft[childIndex] = {
                                label: val,
                                value: valueConvert(val)
                            }
                        })
                        updateFields(index, 'options', newOptions)
                    }} />
                    <div className="icon">
                        <button onClick={() => onDuplicateChildField(index, childIndex)}>{duplicate}</button>
                        <button onClick={() => onRemoveChildField(index, childIndex)}>{remove}</button>
                    </div>
                </div>
            })}
            <button className='subBtn' onClick={() => addChildField(index)}>Add</button>
        </div>
        {/* width  */}
        <Width id='size' value={size} onChange={val => updateFields(index, 'size', val)} />
        {/* column  */}
        <label htmlFor='column'>{__('Column', 'survey-form-block')}</label>
        <NumberControl id='column' updateFields={updateFields} value={column} onChange={(val) => {
            updateFields(index, 'column', val)
        }} />
        {/* classes  */}
        <label htmlFor='classes'>{__('Class', 'survey-form-block')}</label>
        <TextControl id='classes' value={classes} placeholder='class name' onChange={(val) => updateFields(index, 'classes', val)} />
    </>
}
export default MultipleInput;
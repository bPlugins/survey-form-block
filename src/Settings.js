
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TabPanel, SelectControl, __experimentalBoxControl as BoxControl, TextControl, PanelRow, TextareaControl } from '@wordpress/components';

import { produce } from 'immer';

// Settings Components
import { ColorControl, ColorsControl, Label, SortableControl, Typography } from '../../bpl-tools/Components';
import { BorderControl } from '../../bpl-tools/Components/Deprecated';


import { tabController } from '../../bpl-tools/utils/functions';
import { fieldTypeOpt, generalStyleTabs, titleAlignOpt } from './utils/options';
import Text from './Components/Settings/Fields/Text';
import TextArea from './Components/Settings/Fields/TextArea';
import MultipleInput from './Components/Settings/Fields/MultipleInput';
import Email from './Components/Settings/Fields/Email';
import Date from './Components/Settings/Fields/Date';

import { emUnit, pxUnit } from '../../bpl-tools/utils/options';

const Settings = ({ updateObject, attributes, setAttributes, activeIndex, addField, updateFields, formData, setFormData }) => {
	const { form, fields, labelS, input, radioCheckLabelTypo, radioCheckLabelColor, button } = attributes;
	const { bgColor, padding, border, title, description, descriptionTypo, descriptionColor, descriptionMargin, descriptionAlign, titleTypo, titleColor, titleMargin, titleAlign, successMsg, successMsgColor } = form;

	// Child Field Add
	const addChildField = (index) => {
		const addField = produce(fields, draft => {
			draft[index].options.splice(fields[activeIndex].options.length, 0, { value: `Test-${fields[activeIndex].options.length + 1}` });
		});
		setAttributes({ fields: addField });
	}

	//Duplicate Child Field
	const onDuplicateChildField = (index, childIndex) => {
		const newShowField = produce(fields, draft => {
			draft[index].options.splice(childIndex + 1, 0, { ...draft[index].options[childIndex] });
		});
		setAttributes({ fields: newShowField });
	}

	//Remove Child Field
	const onRemoveChildField = (index, childIndex) => {
		const removeChildField = produce(fields, draft => {
			draft[index].options.splice(childIndex, 1);
		});
		setAttributes({ fields: removeChildField });
	}


	// single Item get in Item 
	const { type, column, options, label } = fields[activeIndex] || {};
	const myFields = fields[activeIndex] || {};

	const fieldProps = {
		index: activeIndex,
		...myFields,
		updateFields
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel svTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Form', 'survey-form-block')} initialOpen={false}>
						<TextControl label={__('Title', 'survey-form-block')} value={title} onChange={(val) => updateObject("form", "title", val)} />

						<TextareaControl label={__('Description', 'survey-form-block')} value={description} onChange={(val) => updateObject("form", "description", val)} />

						<TextControl label={__('Success message', 'survey-form-block')} value={successMsg} onChange={(val) => updateObject("form", "successMsg", val)} />

					</PanelBody>

					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Fields', 'survey-form-block')} initialOpen={true}>

						{(() => {
							switch (type) {
								case "text":
									return <Text {...fieldProps} />
								case "paragraph":
									return <TextArea {...fieldProps} />
								case "checkbox":
								case "radio":
								case "select":
									return <MultipleInput column={column} options={options} addChildField={addChildField} onDuplicateChildField={onDuplicateChildField} onRemoveChildField={onRemoveChildField} {...fieldProps} />
								case "email":
									return <Email {...fieldProps} />
								case "date":
									return <Date {...fieldProps} />
								default:
									return null;
							}
						})()}
						{myFields.type && <SelectControl label={__('Select Field Type', 'survey-form-block')} options={[{ label: 'Select', value: '' }, ...fieldTypeOpt]} value={myFields.type} onChange={(val) => {
							updateFields(activeIndex, 'type', val);
							setFormData({ ...formData, [label]: val === 'checkbox' ? [] : '' })
						}} />}
						<button onClick={addField} className='addField'>{__('Add New Field', 'survey-form-block')}</button>
					</PanelBody>

					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Sortable', 'survey-form-block')} initialOpen={false}>

						<SortableControl label={__('', 'survey-form-block')} value={fields} property='label' onChange={val => setAttributes({ fields: val })} />
					</PanelBody>
				</>}

				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Form', 'survey-form-block')} initialOpen={false}>
						<ColorControl label={__('Background Color', 'survey-form-block')} className="mb10" value={bgColor} onChange={val => updateObject("form", "bgColor", val)} />

						<BoxControl label={__('Padding', 'survey-form-block')} values={padding} onChange={val => updateObject("form", "padding", val)} resetValues={{ top: "8px", right: "12px", bottom: "8px", left: "12px" }} units={[pxUnit(3), emUnit(2)]} />

						<BorderControl className='' label={__('Border', 'mail-collections')} value={border}
							onChange={(val) => updateObject("form", "border", val)} />

						<ColorControl label={__('Success message color', 'survey-form-block')} className="mb10" value={successMsgColor} onChange={val => updateObject("form", "successMsgColor", val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Title', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={titleTypo} onChange={val => updateObject("form", "titleTypo", val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={titleColor} onChange={val => updateObject("form", "titleColor", val)} />

						<BoxControl label={__('Margin', 'survey-form-block')} values={titleMargin} onChange={val => updateObject("form", "titleMargin", val)} resetValues={{ top: "20px", right: "0px", bottom: "20px", left: "0px" }} units={[pxUnit(3), emUnit(2)]} />

						<PanelRow>
							<Label> {__('Align', 'survey-form-block')}</Label>
							<SelectControl className='' value={titleAlign} options={titleAlignOpt} onChange={(val) => updateObject("form", "titleAlign", val)} />
						</PanelRow>
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Description', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={descriptionTypo} onChange={val => updateObject("form", "descriptionTypo", val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={descriptionColor} onChange={val => updateObject("form", "descriptionColor", val)} />

						<BoxControl label={__('Margin', 'survey-form-block')} values={descriptionMargin} onChange={val => updateObject("form", "descriptionMargin", val)} resetValues={{ top: "20px", right: "0px", bottom: "20px", left: "0px" }} units={[pxUnit(3), emUnit(2)]} />

						<PanelRow>
							<Label> {__('Align', 'survey-form-block')}</Label>
							<SelectControl className='' value={descriptionAlign} options={titleAlignOpt} onChange={(val) => updateObject("form", "descriptionAlign", val)} />
						</PanelRow>
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Label', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={labelS?.typo} onChange={val => updateObject("labelS", "typo", val)} produce={produce} />

						<ColorControl label={__('Color', 'survey-form-block')} value={labelS?.color} onChange={val => updateObject("labelS", "color", val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Input', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={input?.typo} onChange={val => updateObject("input", "typo", val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={input?.color} onChange={val => updateObject("input", "color", val)} />

						<BoxControl label={__('Padding', 'survey-form-block')} values={input?.padding} onChange={val => updateObject("input", "padding", val)} resetValues={{ top: "8px", right: "12px", bottom: "8px", left: "12px" }} units={[pxUnit(3), emUnit(2)]} />

						<BorderControl className='' label={__('Border', 'survey-form-block')} value={input?.border} onChange={(val) => updateObject("input", "border", val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Radio and checkbox label', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={radioCheckLabelTypo} onChange={val => setAttributes({ radioCheckLabelTypo: val })} produce={produce} />

						<ColorControl label={__('Color', 'survey-form-block')} value={radioCheckLabelColor} onChange={val => setAttributes({ radioCheckLabelColor: val })} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Button', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={button?.typo} onChange={val => updateObject("button", "typo", val)} produce={produce} />

						<ColorsControl className='mb10' label={__(' Colors', 'survey-form-block')} value={button?.colors} onChange={val => updateObject("button", "colors", val)} />

						<BoxControl label={__('Padding', 'mail-collections')} values={button?.padding} onChange={val => updateObject("button", "padding", val)} resetValues={{ top: "11px", right: 0, bottom: "11px", left: 0 }} units={[pxUnit(3), emUnit(2)]} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;
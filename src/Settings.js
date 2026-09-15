import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TabPanel, SelectControl, __experimentalBoxControl as BoxControl, TextControl, PanelRow, TextareaControl } from '@wordpress/components';

import { produce } from 'immer';

// Settings Components
import { ColorControl, ColorsControl, Label, SortableControl, Typography } from '../../bpl-tools/Components';
import { BorderControl } from '../../bpl-tools/Components/Deprecated';
import { AdvertiseCard, ProModal } from '../../bpl-tools/ProControls';

import { tabController } from '../../bpl-tools/utils/functions';
import { fieldTypeOpt, generalStyleTabs, titleAlignOpt } from './utils/options';
import { getDesign } from './utils/design';
import { getPricingUrl, PRO_FEATURES } from './utils/premium';
import { ICON_OPTIONS, getIcon } from './utils/svbIcons';

import Text from './Components/Settings/Fields/Text';
import TextArea from './Components/Settings/Fields/TextArea';
import MultipleInput from './Components/Settings/Fields/MultipleInput';
import Date from './Components/Settings/Fields/Date';

// Design tab panels
import ThemePanel from './Components/Settings/Design/ThemePanel';
import LayoutPanel from './Components/Settings/Design/LayoutPanel';
import QuestionCardPanel from './Components/Settings/Design/QuestionCardPanel';
import InputStylePanel from './Components/Settings/Design/InputStylePanel';
import ButtonPanel from './Components/Settings/Design/ButtonPanel';
import EffectsPanel from './Components/Settings/Design/EffectsPanel';
import ProgressPanel from './Components/Settings/Design/ProgressPanel';
import BackgroundPanel from './Components/Settings/Design/BackgroundPanel';
import SuccessPanel from './Components/Settings/Design/SuccessPanel';
import DetailsPanel from './Components/Settings/Design/DetailsPanel';
import { OptionGrid } from './Components/Settings/Design/Shared';

import { emUnit, pxUnit } from '../../bpl-tools/utils/options';

const Settings = ({ updateObject, attributes, setAttributes, activeIndex, addField, updateFields, formData, setFormData, isPremium = false }) => {
	const { form, fields, labelS, input, radioCheckLabelTypo, radioCheckLabelColor, button } = attributes;
	const { bgColor, padding, border, title, description, descriptionTypo, descriptionColor, descriptionMargin, descriptionAlign, titleTypo, titleColor, titleMargin, titleAlign, successMsg, successMsgColor } = form;

	const [isProModalOpen, setIsProModalOpen] = useState(false);
	const [device, setDevice] = useState('desktop');

	const design = getDesign(attributes.design);

	/** Patch top-level design keys. */
	const setDesign = patch => setAttributes({ design: { ...design, ...patch } });

	/** Patch a nested design section without dropping its siblings. */
	const setSection = (section, patch) => setAttributes({
		design: { ...design, [section]: { ...design[section], ...patch } }
	});

	const onProClick = () => setIsProModalOpen(true);

	const designProps = { design, setDesign, setSection, isPremium, onProClick };

	// Child Field Add
	const addChildField = (index) => {
		const addFieldOption = produce(fields, draft => {
			draft[index].options.splice(fields[activeIndex].options.length, 0, { value: `Test-${fields[activeIndex].options.length + 1}` });
		});
		setAttributes({ fields: addFieldOption });
	};

	//Duplicate Child Field
	const onDuplicateChildField = (index, childIndex) => {
		const newShowField = produce(fields, draft => {
			draft[index].options.splice(childIndex + 1, 0, { ...draft[index].options[childIndex] });
		});
		setAttributes({ fields: newShowField });
	};

	//Remove Child Field
	const onRemoveChildField = (index, childIndex) => {
		const removeChildField = produce(fields, draft => {
			draft[index].options.splice(childIndex, 1);
		});
		setAttributes({ fields: removeChildField });
	};

	// single Item get in Item
	const { type, column, options, label } = fields[activeIndex] || {};
	const myFields = fields[activeIndex] || {};

	const fieldProps = {
		index: activeIndex,
		...myFields,
		updateFields
	};

	const iconOptions = ICON_OPTIONS.map(o => ({
		value: o.value,
		label: o.label,
		pro: Boolean(o.value),
		preview: o.value ? <span className="svbIconPreview">{getIcon(o.value)}</span> : <span className="svbIconPreview svbIconNone">—</span>
	}));

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel svTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Form', 'survey-form-block')} initialOpen={false}>
						<TextControl label={__('Title', 'survey-form-block')} value={title} onChange={(val) => updateObject('form', 'title', val)} />

						<TextareaControl label={__('Description', 'survey-form-block')} value={description} onChange={(val) => updateObject('form', 'description', val)} />

						<TextControl label={__('Success message', 'survey-form-block')} value={successMsg} onChange={(val) => updateObject('form', 'successMsg', val)} />

					</PanelBody>

					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Fields', 'survey-form-block')} initialOpen={true}>

						{(() => {
							switch (type) {
								case 'text':
								case 'email':
								case 'number':
								case 'phone':
								case 'url':
								case 'star_rating':
								case 'opinion_scale':
								case 'nps':
								case 'range_slider':
								case 'toggle':
								case 'section':
									return <Text {...fieldProps} />;
								case 'paragraph':
									return <TextArea {...fieldProps} />;
								case 'checkbox':
								case 'radio':
								case 'select':
									return <MultipleInput column={column} options={options} addChildField={addChildField} onDuplicateChildField={onDuplicateChildField} onRemoveChildField={onRemoveChildField} {...fieldProps} />;
								case 'date':
									return <Date {...fieldProps} />;
								default:
									return <Text {...fieldProps} />;
							}
						})()}

						{'toggle' === type && <div className='svbToggleLabels'>
							<TextControl
								label={__('Label when on', 'survey-form-block')}
								value={myFields.onLabel ?? 'Yes'}
								placeholder='Yes'
								help={__('Stored with the response, so it reads as words rather than true/false.', 'survey-form-block')}
								onChange={(val) => updateFields(activeIndex, 'onLabel', val)}
							/>

							<TextControl
								label={__('Label when off', 'survey-form-block')}
								value={myFields.offLabel ?? 'No'}
								placeholder='No'
								onChange={(val) => updateFields(activeIndex, 'offLabel', val)}
							/>
						</div>}

						{myFields.type && <SelectControl label={__('Select Field Type', 'survey-form-block')} options={[{ label: 'Select', value: '' }, ...fieldTypeOpt]} value={myFields.type} onChange={(val) => {
							updateFields(activeIndex, 'type', val);
							setFormData({ ...formData, [label]: val === 'checkbox' ? [] : '' });
						}} />}

						{myFields.type && <OptionGrid
							label={__('Question Icon', 'survey-form-block')}
							options={iconOptions}
							value={myFields.icon || ''}
							onChange={val => updateFields(activeIndex, 'icon', val)}
							isPremium={isPremium}
							onProClick={onProClick}
							columns="three"
						/>}

						<button type='button' onClick={addField} className='addField'>{__('Add New Field', 'survey-form-block')}</button>
					</PanelBody>

					<PanelBody className='bPlPanelBody svPanelBody fieldItem' title={__('Sortable', 'survey-form-block')} initialOpen={false}>

						<SortableControl label={__('', 'survey-form-block')} value={fields} property='label' onChange={val => setAttributes({ fields: val })} />
					</PanelBody>
				</>}

				{'design' === tab.name && <>
					<ThemePanel attributes={attributes} setAttributes={setAttributes} {...designProps} />
					<LayoutPanel {...designProps} device={device} setDevice={setDevice} />
					<QuestionCardPanel {...designProps} />
					<InputStylePanel {...designProps} />
					<ButtonPanel {...designProps} />
					<ProgressPanel {...designProps} />
					<EffectsPanel {...designProps} />
					<BackgroundPanel {...designProps} />
					<SuccessPanel {...designProps} form={form} updateObject={updateObject} />
					<DetailsPanel {...designProps} />

					<PanelBody className='bPlPanelBody'>
						<AdvertiseCard isPremium={isPremium} planLink={getPricingUrl()} />
					</PanelBody>
				</>}

				{'style' === tab.name && <>
					<PanelBody className='bPlPanelBody' title={__('Form', 'survey-form-block')} initialOpen={false}>
						<ColorControl label={__('Background Color', 'survey-form-block')} className="mb10" value={bgColor} onChange={val => updateObject('form', 'bgColor', val)} />

						<BoxControl label={__('Padding', 'survey-form-block')} values={padding} onChange={val => updateObject('form', 'padding', val)} resetValues={{ top: '8px', right: '12px', bottom: '8px', left: '12px' }} units={[pxUnit(3), emUnit(2)]} />

						<BorderControl className='' label={__('Border', 'survey-form-block')} value={border}
							onChange={(val) => updateObject('form', 'border', val)} />

						<ColorControl label={__('Success message color', 'survey-form-block')} className="mb10" value={successMsgColor} onChange={val => updateObject('form', 'successMsgColor', val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Title', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={titleTypo} onChange={val => updateObject('form', 'titleTypo', val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={titleColor} onChange={val => updateObject('form', 'titleColor', val)} />

						<BoxControl label={__('Margin', 'survey-form-block')} values={titleMargin} onChange={val => updateObject('form', 'titleMargin', val)} resetValues={{ top: '20px', right: '0px', bottom: '20px', left: '0px' }} units={[pxUnit(3), emUnit(2)]} />

						<PanelRow>
							<Label> {__('Align', 'survey-form-block')}</Label>
							<SelectControl className='' value={titleAlign} options={titleAlignOpt} onChange={(val) => updateObject('form', 'titleAlign', val)} />
						</PanelRow>
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Description', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={descriptionTypo} onChange={val => updateObject('form', 'descriptionTypo', val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={descriptionColor} onChange={val => updateObject('form', 'descriptionColor', val)} />

						<BoxControl label={__('Margin', 'survey-form-block')} values={descriptionMargin} onChange={val => updateObject('form', 'descriptionMargin', val)} resetValues={{ top: '20px', right: '0px', bottom: '20px', left: '0px' }} units={[pxUnit(3), emUnit(2)]} />

						<PanelRow>
							<Label> {__('Align', 'survey-form-block')}</Label>
							<SelectControl className='' value={descriptionAlign} options={titleAlignOpt} onChange={(val) => updateObject('form', 'descriptionAlign', val)} />
						</PanelRow>
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Label', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={labelS?.typo} onChange={val => updateObject('labelS', 'typo', val)} produce={produce} />

						<ColorControl label={__('Color', 'survey-form-block')} value={labelS?.color} onChange={val => updateObject('labelS', 'color', val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Input', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={input?.typo} onChange={val => updateObject('input', 'typo', val)} produce={produce} />

						<ColorControl className="mb10" label={__('Color', 'survey-form-block')} value={input?.color} onChange={val => updateObject('input', 'color', val)} />

						<BoxControl label={__('Padding', 'survey-form-block')} values={input?.padding} onChange={val => updateObject('input', 'padding', val)} resetValues={{ top: '8px', right: '12px', bottom: '8px', left: '12px' }} units={[pxUnit(3), emUnit(2)]} />

						<BorderControl className='' label={__('Border', 'survey-form-block')} value={input?.border} onChange={(val) => updateObject('input', 'border', val)} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Radio and checkbox label', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={radioCheckLabelTypo} onChange={val => setAttributes({ radioCheckLabelTypo: val })} produce={produce} />

						<ColorControl label={__('Color', 'survey-form-block')} value={radioCheckLabelColor} onChange={val => setAttributes({ radioCheckLabelColor: val })} />
					</PanelBody>

					<PanelBody className='bPlPanelBody' title={__('Button', 'survey-form-block')} initialOpen={false}>
						<Typography className='mt10' label={__('Typography', 'survey-form-block')} value={button?.typo} onChange={val => updateObject('button', 'typo', val)} produce={produce} />

						<ColorsControl className='mb10' label={__(' Colors', 'survey-form-block')} value={button?.colors} onChange={val => updateObject('button', 'colors', val)} />

						<BoxControl label={__('Padding', 'survey-form-block')} values={button?.padding} onChange={val => updateObject('button', 'padding', val)} resetValues={{ top: '11px', right: 0, bottom: '11px', left: 0 }} units={[pxUnit(3), emUnit(2)]} />
					</PanelBody>
				</>}
			</>}</TabPanel>
		</InspectorControls>

		<ProModal
			isProModalOpen={isProModalOpen}
			setIsProModalOpen={setIsProModalOpen}
			link={getPricingUrl()}
			title={__('Unlock More with<br/>Survey Form Block Pro!', 'survey-form-block')}
			description={__('The free design tools already go a long way - Pro adds the themes, layouts and motion that make a survey look bespoke.', 'survey-form-block')}
			features={PRO_FEATURES}
		/>
	</>;
};

export default Settings;

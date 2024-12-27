

import { useState, useEffect } from 'react';
import { produce } from 'immer';
import { __ } from '@wordpress/i18n';
import { SelectControl, Tooltip } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';

import { tabController } from '../../bpl-tools/utils/functions';
import { LabelPositionOpt, fieldTypeOpt } from './utils/options';
import Settings from './Settings';
import Style from './Style';
import Form from './Form';
import { generateUniqueId, postData } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected, formCreatorId, isSavingPost } = props;
	const { fields, form } = attributes;
	const { id, creator_id, title } = form;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => {
		if (isSavingPost) {
			const url = `${window.svbData?.ajaxUrl}`;
			const columns = {};
			fields.map(item => columns[item.id] = item.label)
			postData(url, { columns: JSON.stringify(columns), form_id: id, action: 'svb_add_update_columns', nonce: window.svbData?.nonce, form_name: title }).then(res => console.log(res));
		}
	}, [isSavingPost])

	useEffect(() => {
		setAttributes({ form: { ...form, id: id || clientId.substring(0, 14), creator_id: creator_id || formCreatorId } });
	}, [clientId]);

	useEffect(() => tabController(), [isSelected]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [formData, setFormData] = useState({});
	const [requireError, setRequireError] = useState(false);

	const updateFields = (index, property, val, childProperty = false, childIndex = false) => {

		const newFields = produce(fields, draft => {
			if (false !== childIndex && childProperty) {
				draft[index][property][childIndex][childProperty] = val;
			} else if (childProperty) {
				draft[index][property][childProperty] = val;
			} else {
				draft[index][property] = val;
			}
		});
		setAttributes({ fields: newFields });
	}

	//  Add Field
	const addField = () => {
		const getUId = () => {
			const uniqueId = generateUniqueId(4);
			const matched = fields.find(f => f.id === uniqueId);
			return matched ? getUId() : uniqueId;
		}

		const newField = produce(fields, draft => {
			draft.splice(draft.length, 0, {
				id: getUId(),
				type: "",
				column: 1,
				size: 100,
				label: "Label-1",
				labelPosition: "column",
				help: "",
				name: "",
				placeholder: "Placeholder",
				classes: "",
				isRequired: false,
				isDisable: false,
				options: [
					{
						label: "Author",
						value: "Al-Amin"
					}
				],
				start: "1990",
				end: "2023",
			})
		});

		setAttributes({ fields: newField });
	}

	// Duplicate Fields 
	const onDuplicateFields = (index) => {
		setAttributes({ fields: produce(fields, draft => { draft.splice(index, 0, { ...fields[index], id: generateUniqueId(4) }) }) })
	}

	//Remove Fields
	const removeField = (index) => {
		const removeField = produce(fields, draft => {
			draft.splice(index, 1);
		});
		setAttributes({ fields: removeField });
	}

	// update object 
	const updateObject = (attr, key, val) => {
		const newAttr = { ...attributes[attr] };
		newAttr[key] = val;
		setAttributes({ [attr]: newAttr })
	}

	const fieldsEls = fields.map((field, index) => {
		const { label } = field;

		return {
			label: <RichText tagName="label" className='label' value={label} onChange={(val) => updateFields(index, 'label', val)} placeholder={__('Enter your label', 'survey-form-block')} inlineToolbar />
		}
	});

	return <>
		<Settings updateObject={updateObject} setFormData={setFormData} formData={formData} attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateFields={updateFields} addField={addField} onDuplicateFields={onDuplicateFields} removeField={removeField} />

		<div className={className} id={`svbMainArea-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className={`svbMainArea`}>
				<Form RichText={RichText} fieldsEls={fieldsEls} updateObject={updateObject} postData={postData} Tooltip={Tooltip} requireError={requireError} setRequireError={setRequireError} LabelPositionOpt={LabelPositionOpt} fieldTypeOpt={fieldTypeOpt} __={__} SelectControl={SelectControl} attributes={attributes} setAttributes={setAttributes} updateFields={updateFields} addField={addField} onDuplicateFields={onDuplicateFields} removeField={removeField} activeIndex={activeIndex} setActiveIndex={setActiveIndex} formData={formData} setFormData={setFormData} isBackend={true} />
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const formCreatorId = select('core').getCurrentUser()?.id;
	const { isSavingPost } = select('core/editor')
	return {
		formCreatorId,
		isSavingPost: isSavingPost()
	}
})(Edit);
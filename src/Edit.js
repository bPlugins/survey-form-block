import { useState, useEffect, useRef } from 'react';
import { produce } from 'immer';
import { __ } from '@wordpress/i18n';
import { SelectControl, Tooltip } from '@wordpress/components';
import { withSelect, useSelect } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

import { tabController } from '../../bpl-tools/utils/functions';
import { LabelPositionOpt, fieldTypeOpt } from './utils/options';
import Settings from './Settings';
import Style from './Style';
import Form from './Form';
import { generateUniqueId, postData } from './utils/functions';
import { isPremium as checkPremium } from './utils/premium';
import { countIdInContent, pickNewCopies } from './utils/surveyIds';

const BLOCK_NAME = 'svb/survey-block';

/**
 * Order in which survey blocks mounted in this editor session. Blocks present
 * when the editor opens mount first, in document order; a duplicate mounts
 * when it is created. See utils/surveyIds.js.
 */
const mountOrder = new Map();
let mountCounter = 0;

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected, formCreatorId, isSavingPost } = props;
	const { fields, form, cId } = attributes;
	const { id, creator_id, title } = form;

	const isPremium = checkPremium();

	const mounted = useRef(false);
	if (!mounted.current) {
		mounted.current = true;
		mountOrder.set(clientId, ++mountCounter);
	}
	useEffect(() => () => { mountOrder.delete(clientId); }, [clientId]);

	// Other survey blocks in this editor with the same survey id, and the post
	// as it was last saved. Joined into a string so the selector result stays
	// equal between renders.
	const { twins, savedContent } = useSelect((select) => {
		const blockEditor = select('core/block-editor');
		const editor = select('core/editor');
		const post = editor?.getCurrentPost?.();

		const sameId = id ? blockEditor.getClientIdsWithDescendants().filter(other =>
			other !== clientId &&
			BLOCK_NAME === blockEditor.getBlockName(other) &&
			id === blockEditor.getBlockAttributes(other)?.form?.id
		) : [];

		return {
			twins: sameId.join(','),
			savedContent: 'string' === typeof post?.content ? post.content : null
		};
	}, [id, clientId]);

	// Set the survey id, creator and id prefix once, when they are missing.
	// These used to be rewritten on every editor load, which marked every post
	// holding a survey as changed the moment it was opened.
	useEffect(() => {
		const patch = {};

		if (!id || (!creator_id && formCreatorId)) {
			patch.form = { ...form, id: id || clientId.substring(0, 14), creator_id: creator_id || formCreatorId || '' };
		}

		if (!cId) {
			patch.cId = clientId.substring(0, 10);
		}

		if (Object.keys(patch).length) {
			setAttributes(patch);
		}
	}, [clientId, formCreatorId]);

	// A duplicated or pasted copy gets its own survey id, so it collects its own
	// responses. Ids already in the saved post are never changed; when the
	// saved content is unknown (widgets screen), nothing is changed.
	useEffect(() => {
		if (!id || !twins || null === savedContent) {
			return;
		}

		const copies = pickNewCopies({
			group: [clientId, ...twins.split(',')],
			savedCount: countIdInContent(savedContent, id),
			mountedAt: (other) => mountOrder.get(other)
		});

		if (copies.includes(clientId)) {
			setAttributes({ form: { ...form, id: clientId.substring(0, 14) }, cId: clientId.substring(0, 10) });
		}
	}, [id, twins, savedContent]);

	useEffect(() => {
		if (isSavingPost) {
			const url = `${window.svbData?.ajaxUrl}`;
			const columns = {};
			fields.map(item => columns[item.id] = item.label);
			postData(url, { columns: JSON.stringify(columns), form_id: id, action: 'svb_add_update_columns', nonce: window.svbData?.nonce, form_name: title });
		}
	}, [isSavingPost]);

	useEffect(() => tabController(), [isSelected]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [formData, setFormData] = useState({});
	const [requireError, setRequireError] = useState(false);

	// `property` may also be an object of several properties to set at once;
	// two separate calls would each start from the same `fields` and the second
	// would undo the first.
	const updateFields = (index, property, val, childProperty = false, childIndex = false) => {

		const newFields = produce(fields, draft => {
			if (property && 'object' === typeof property) {
				Object.assign(draft[index], property);
			} else if (false !== childIndex && childProperty) {
				draft[index][property][childIndex][childProperty] = val;
			} else if (childProperty) {
				draft[index][property][childProperty] = val;
			} else {
				draft[index][property] = val;
			}
		});
		setAttributes({ fields: newFields });
	};

	//  Add Field
	const addField = () => {
		const getUId = () => {
			const uniqueId = generateUniqueId(4);
			const matched = fields.find(f => f.id === uniqueId);
			return matched ? getUId() : uniqueId;
		};

		const newField = produce(fields, draft => {
			draft.splice(draft.length, 0, {
				id: getUId(),
				type: '',
				column: 1,
				size: 100,
				label: __('Untitled question', 'survey-form-block'),
				labelPosition: 'column',
				help: '',
				name: '',
				placeholder: '',
				classes: '',
				icon: '',
				onLabel: 'Yes',
				offLabel: 'No',
				isRequired: false,
				isDisable: false,
				options: [
					{
						label: __('Option 1', 'survey-form-block'),
						value: __('Option 1', 'survey-form-block')
					}
				],
				// Empty = no limit. The old 1990-2023 default kept visitors from
				// picking a current or future date.
				start: '',
				end: '',
			});
		});

		setAttributes({ fields: newField });
	};

	// Duplicate Fields
	const onDuplicateFields = (index) => {
		setAttributes({ fields: produce(fields, draft => { draft.splice(index, 0, { ...fields[index], id: generateUniqueId(4) }); }) });
	};

	//Remove Fields
	const removeField = (index) => {
		const removedFields = produce(fields, draft => {
			draft.splice(index, 1);
		});
		setAttributes({ fields: removedFields });
	};

	// update object
	const updateObject = (attr, key, val) => {
		const newAttr = { ...attributes[attr] };
		newAttr[key] = val;
		setAttributes({ [attr]: newAttr });
	};

	const fieldsEls = fields.map((field, index) => {
		const { label } = field;

		return {
			label: <RichText tagName="label" className='label' value={label} onChange={(val) => updateFields(index, 'label', val)} placeholder={__('Enter your label', 'survey-form-block')} inlineToolbar />
		};
	});

	const elId = `svbMainArea-${clientId}`;

	return <div {...useBlockProps()}>
		<Settings updateObject={updateObject} setFormData={setFormData} formData={formData} attributes={attributes} setAttributes={setAttributes} activeIndex={activeIndex} setActiveIndex={setActiveIndex} updateFields={updateFields} addField={addField} onDuplicateFields={onDuplicateFields} removeField={removeField} isPremium={isPremium} />

		<div id={elId}>
			<Style attributes={attributes} id={elId} isPremium={isPremium} />

			<div className={'svbMainArea'}>
				<Form RichText={RichText} fieldsEls={fieldsEls} updateObject={updateObject} postData={postData} Tooltip={Tooltip} requireError={requireError} setRequireError={setRequireError} LabelPositionOpt={LabelPositionOpt} fieldTypeOpt={fieldTypeOpt} __={__} SelectControl={SelectControl} attributes={attributes} setAttributes={setAttributes} updateFields={updateFields} addField={addField} onDuplicateFields={onDuplicateFields} removeField={removeField} activeIndex={activeIndex} setActiveIndex={setActiveIndex} formData={formData} setFormData={setFormData} isBackend={true} isPremium={isPremium} />
			</div>
		</div>
	</div>;
};

export default withSelect((select) => {
	const formCreatorId = select('core').getCurrentUser()?.id;

	// The core/editor store does not exist on the Widgets screen; destructuring
	// it unguarded crashed the block there.
	const editor = select('core/editor');

	return {
		formCreatorId,
		isSavingPost: editor?.isSavingPost?.() ?? false
	};
})(Edit);

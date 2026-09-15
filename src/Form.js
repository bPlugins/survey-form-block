import { useMemo, useEffect, useState } from 'react';
import { duplicate, remove, loadingIcon } from './utils/icons';
import { resolveDesign, getDesignClasses } from './utils/designCSS';
import { withAttributeDefaults } from './utils/attributes';
import ProgressBar from './Components/FrontEnd/MainEle/ProgressBar';
import SuccessState from './Components/FrontEnd/MainEle/SuccessState';
import Text from './Components/FrontEnd/Fields/Text';
import TextArea from './Components/FrontEnd/Fields/TextArea';
import Checkbox from './Components/FrontEnd/Fields/CheckBox';
import Radio from './Components/FrontEnd/Fields/Radio';
import Email from './Components/FrontEnd/Fields/Email';
import DropDown from './Components/FrontEnd/Fields/DropDowns';
import Date from './Components/FrontEnd/Fields/Date';
import StarRating from './Components/FrontEnd/Fields/StarRating';
import OpinionScale from './Components/FrontEnd/Fields/OpinionScale';
import NPS from './Components/FrontEnd/Fields/NPS';
import RangeSlider from './Components/FrontEnd/Fields/RangeSlider';
import Toggle from './Components/FrontEnd/Fields/Toggle';
import Section from './Components/FrontEnd/Fields/Section';
import NumberField from './Components/FrontEnd/Fields/Number';
import Phone from './Components/FrontEnd/Fields/Phone';
import UrlField from './Components/FrontEnd/Fields/Url';

/** Field types that cannot host a floating label (no single text input). */
const NON_FLOATING = ['checkbox', 'radio', 'toggle', 'star_rating', 'opinion_scale', 'nps', 'range_slider', 'section', 'date', ''];

const Form = ({ fieldsEls, RichText, updateObject, postData, Tooltip, requireError, setRequireError, formData, setFormData, __, SelectControl, isBackend, fieldTypeOpt, attributes: rawAttributes, updateFields, addField, onDuplicateFields, removeField, activeIndex, setActiveIndex, isPremium = false }) => {
	// Render-only normalisation: a survey saved before a key existed still draws
	// correctly, and nothing is written back to the post.
	const attributes = useMemo(() => withAttributeDefaults(rawAttributes), [rawAttributes]);
	const { form, fields, cId } = attributes;
	const { id, creator_id, title, description, successMsg } = form;
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [missing, setMissing] = useState([]);
	const [submitError, setSubmitError] = useState('');

	const design = useMemo(() => resolveDesign(attributes.design, isPremium), [attributes.design, isPremium]);
	const { progress, success: successDesign, button, label: labelDesign } = design;

	const errorMessage = __('Sorry, your response could not be sent. Please try again.', 'survey-form-block');

	// Button Area
	const ActionButtons = (index) => {
		return (isBackend && activeIndex === index) && <div className='btnArea'>
			<Tooltip text="Duplicate" position='top'><button type='button' onClick={() => onDuplicateFields(index)}>{duplicate}</button></Tooltip>
			{1 < fields?.length && <Tooltip text="Delete" position='top'><button type='button' onClick={() => removeField(index)}>{remove}</button></Tooltip>}
		</div>;
	};

	useEffect(() => {
		setFormData({ ...formData, id, creator_id, title });
	}, []);

	const requiredFields = useMemo(() => {
		return fields.map(item => item.isRequired && !item.isDisable ? item.id : false).filter(item => item !== false);
	}, [fields]);

	const onSubmit = (e) => {
		e.preventDefault();

		// Required Field check
		const missingRequiredFields = requiredFields.filter(field => {
			if (!formData[field]) {
				return true;
			}
			return false;
		});

		if (missingRequiredFields.length) {
			setMissing(missingRequiredFields);
			setRequireError(true);
			return setTimeout(() => {
				setRequireError(false);
				setMissing([]);
			}, 2500);
		}

		setMissing([]);
		setSubmitError('');

		// The editor is a preview, not a real endpoint. Show the success state so
		// the author can style it, without a round trip.
		if (isBackend) {
			setSuccess(true);
			setTimeout(() => setSuccess(false), parseInt(successDesign.duration) || 2000);
			return;
		}

		// Toggles are held as booleans so "required" still means "must be on",
		// but a stored response should read the way the visitor saw it - "Yes",
		// not "true". Convert on the way out only.
		const readableAnswers = () => {
			const payload = { ...formData };

			fields.forEach(field => {
				if ('toggle' !== field.type || field.isDisable) {
					return;
				}

				payload[field.id] = formData[field.id]
					? (field.onLabel || 'Yes')
					: (field.offLabel || 'No');
			});

			return payload;
		};

		const clearAnswers = () => {
			const tempFormData = {};
			const { id: formId, title: formTitle, creator_id: formCreator } = formData;
			Object.keys(formData).map(key => tempFormData[key] = '');
			setFormData({ ...tempFormData, id: formId, title: formTitle, creator_id: formCreator });
		};

		setLoading(true);

		postData(`${window.svbData?.ajaxUrl}`, readableAnswers()).then(
			(res) => {
				setLoading(false);

				// The response used to be ignored entirely, so a rejected request
				// still showed "thank you" while the answers were thrown away.
				// wp_send_json_error() puts the reason in `data`; prefer it, since
				// it explains *why* (rate limited, missing form id).
				if (!res || false === res.success) {
					setSubmitError('string' === typeof res?.data && res.data ? res.data : errorMessage);
					return;
				}

				setSuccess(true);
				clearAnswers();
				setTimeout(() => setSuccess(false), parseInt(successDesign.duration) || 2000);
			}
		).catch(() => {
			setLoading(false);
			setSubmitError(errorMessage);
		});
	};

	const progressEl = progress.enable && <ProgressBar fields={fields} formData={formData} design={design} />;

	// "Replace form" swaps the questions out for the thank-you panel. Never in the
	// editor, where the author still needs to see and edit the fields.
	const isReplaced = success && !isBackend && 'replace' === successDesign.style;

	const submitLabel = button.label || 'Submit';

	return <form action='' method='' onSubmit={onSubmit} className={getDesignClasses(design)}>
		<div className="titleArea">
			{isBackend ? <RichText tagName="h2" className='title' value={title} onChange={(val) => updateObject('form', 'title', val)} placeholder={__('Title Here', 'survey-form-block')} inlineToolbar /> : title && <h2 className='title' dangerouslySetInnerHTML={{ __html: title }} />}
		</div>

		<div className="descriptionArea">
			{isBackend ? <RichText tagName="h2" className='description' value={description} onChange={(val) => updateObject('form', 'description', val)} placeholder={__('Description Here', 'survey-form-block')} inlineToolbar /> : description && <h2 className='description' dangerouslySetInnerHTML={{ __html: description }} />}
		</div>

		{'top' === progress.position && progressEl}

		{isReplaced ? <SuccessState design={design} message={successMsg} /> : <>
			<div className="mainFieldArea">
				{fields.map((field, index) => {
					const { id: fieldId, type, size, isDisable } = field;

					const fieldsPros = {
						cId,
						updateFields,
						buttonArea: ActionButtons,
						...field,
						requiredMark: labelDesign?.requiredMark || 'asterisk',
						icon: isPremium ? field.icon : '',
						fieldEls: fieldsEls[index],
						index,
						value: formData[fieldId]
					};

					const classNames = [
						'fieldItem',
						`w${size || 100}`,
						isDisable ? 'disable' : '',
						NON_FLOATING.includes(type) ? 'svbNoFloat' : '',
						missing.includes(fieldId) ? 'svbFieldError' : '',
						isBackend && index === activeIndex ? 'svbNowEditing' : ''
					].filter(Boolean).join(' ');

					return <div key={index} className={classNames} style={{ '--svb-i': index }}
						onClick={() => isBackend && setActiveIndex(index)}>

						{(!type && isBackend) && (
							<SelectControl className='selectBox' label={__('Select Field Type', 'survey-form-block')} options={[{ label: 'Select', value: '' }, ...fieldTypeOpt]} value={type} onChange={(val) => { updateFields(index, 'type', val); }} />
						)}

						{(() => {
							switch (type) {
								case 'text':
									return <Text {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'paragraph':
									return <TextArea {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'email':
									return <Email {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'number':
									return <NumberField {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'phone':
									return <Phone {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'url':
									return <UrlField {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'checkbox':
									return <Checkbox {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'radio':
									return <Radio {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'select':
									return <DropDown {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'toggle':
									return <Toggle {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'star_rating':
									return <StarRating {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'opinion_scale':
									return <OpinionScale {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'nps':
									return <NPS {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'range_slider':
									return <RangeSlider {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'date':
									return <Date {...fieldsPros} onChange={val => setFormData({ ...formData, [fieldId]: val })} />;
								case 'section':
									return <Section {...fieldsPros} />;
								default:
									return null;
							}
						})()}
					</div>;
				})}

				{isBackend && <button type='button' onClick={addField} className='addField'>{__('Add New Field', 'survey-form-block')}</button>}

				{fields && <div className='subBtnArea'>
					<button type='submit' className='subBtn' disabled={loading}><span>{submitLabel}</span></button>
					{loading && <div className="loading">
						{loadingIcon}
					</div>}
				</div>}

				{/* success message  */}
				{success && <SuccessState design={design} message={successMsg} isBackend={isBackend} />}
			</div>
		</>}

		{'bottom' === progress.position && progressEl}

		{/* Require Notice */}
		{requireError && <div className="svb_required_notice">
			<p className='svb_notice'>Required Field Missing</p>
		</div>}

		{/* Submission failure. Previously swallowed, which showed a thank-you
			message while the answers were discarded. */}
		{submitError && <div className="svb_submit_error" role="alert">
			<p className='svb_notice'>{submitError}</p>
		</div>}

	</form>;
};

export default Form;

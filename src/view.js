import { useState } from 'react';
import { createRoot } from 'react-dom';

import './style.scss';
import Style from './Style';
import Form from './Form';
import { isPremium as checkPremium } from './utils/premium';

// Servey Block
document.addEventListener('DOMContentLoaded', () => {
	const allSurveyFormBlockEles = document.querySelectorAll('.wp-block-svb-survey-block');

	allSurveyFormBlockEles.forEach(surveyFormEle => {
		if (!surveyFormEle.dataset.attributes) {
			return;
		}

		const attributes = JSON.parse(surveyFormEle.dataset.attributes);
		const isPremium = checkPremium();

		createRoot(surveyFormEle).render(<>
			<Style attributes={attributes} id={surveyFormEle.id} isPremium={isPremium} />
			<RenderForm attributes={attributes} isPremium={isPremium} />
		</>);
		surveyFormEle?.removeAttribute('data-attributes');
	});
});


const RenderForm = ({ attributes, isPremium }) => {
	const { cId, fields } = attributes;
	const [formData, setFormData] = useState({});
	const [requireError, setRequireError] = useState(false);

	const __ = (text) => text;

	const fieldsEls = fields.map((field, index) => {
		const { label } = field;

		return {
			label: <label htmlFor={`${cId}-${index}`} dangerouslySetInnerHTML={{ __html: label }} />
		};
	});

	return <div className={'svbMainArea'}>
		<Form postData={postData} fieldsEls={fieldsEls} requireError={requireError} setRequireError={setRequireError} attributes={attributes} formData={formData} setFormData={setFormData} __={__} isBackend={false} isPremium={isPremium} />
	</div>;
};

// Example POST method implementation:
export async function postData(url = '', data = {}) {
	const formData = new FormData();
	formData.append('action', 'svb_data_add');
	formData.append('nonce', window.svbData?.nonce);
	formData.append('data', JSON.stringify(data));
	formData.append('form_id', data.id);
	formData.append('form_creator_id', data.creator_id);
	formData.append('form_name', data.title);

	window.formData = formData;
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		credentials: 'same-origin', // include, *same-origin, omit
		body: formData // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

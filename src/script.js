import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import Form from './Form';

// Servey Block
document.addEventListener('DOMContentLoaded', () => {
	const allSurveyFormBlockEles = document.querySelectorAll('.wp-block-svb-survey-block');
	allSurveyFormBlockEles.forEach(surveyFormEle => {
		const attributes = JSON.parse(surveyFormEle.dataset.attributes);

		createRoot(surveyFormEle).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
			<RenderForm attributes={attributes} />
		</>);
		surveyFormEle?.removeAttribute('data-attributes');
	});
});


const RenderForm = ({ attributes }) => {
	const { cId, fields } = attributes;
	const [formData, setFormData] = useState({});
	const [requireError, setRequireError] = useState(false);

	const __ = (text, textDomain) => {
		return text;
	}

	const fieldsEls = fields.map((field, index) => {
		const { label } = field;

		return {
			label: <label htmlFor={`${cId}-${index}`} dangerouslySetInnerHTML={{ __html: label }} />
		}
	});

	return <div className={`svbMainArea`}>
		<Form postData={postData} fieldsEls={fieldsEls} requireError={requireError} setRequireError={setRequireError} attributes={attributes} formData={formData} setFormData={setFormData} __={__} isBackend={false} />
	</div>
}

// Example POST method implementation:
export async function postData(url = "", data = {}) {
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
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		// mode: "cors", // no-cors, *cors, same-origin
		// cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		// headers: {
		//     "Content-Type": "application/json",
		//     // 'Content-Type': 'application/x-www-form-urlencoded',
		// },
		// redirect: "follow", // manual, *follow, error
		// referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: formData // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}
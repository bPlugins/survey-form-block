import { useState } from 'react';
import { createRoot } from 'react-dom';
import domReady from '@wordpress/dom-ready';
import { __ } from '@wordpress/i18n';

import './style.scss';
import Style from './Style';
import Form from './Form';
import { isPremium as checkPremium } from './utils/premium';

// Survey block.
//
// domReady() rather than a DOMContentLoaded listener: when an optimisation
// plugin delays scripts until after that event has fired, a plain listener
// never runs and the survey stays an empty box.
domReady(() => {
	const allSurveyFormBlockEles = document.querySelectorAll('.wp-block-svb-survey-block');

	allSurveyFormBlockEles.forEach(surveyFormEle => {
		if (!surveyFormEle.dataset.attributes) {
			return;
		}

		const saved = JSON.parse(surveyFormEle.dataset.attributes);

		// cId only prefixes input ids and radio group names. The same survey can
		// print twice on one page (a shortcode, a duplicated block), so make it
		// unique per render; it is never stored.
		const attributes = { ...saved, cId: `${saved.cId || 'svb'}-${surveyFormEle.id}` };
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

/**
 * Sends one response to the public `svb_data_add` endpoint.
 *
 * @param {string} url  admin-ajax.php URL.
 * @param {Object} data Answers keyed by field id, plus id / creator_id / title.
 * @return {Promise<Object>} The decoded JSON reply.
 */
export async function postData(url = '', data = {}) {
	const formData = new FormData();
	formData.append('action', 'svb_data_add');
	formData.append('nonce', window.svbData?.nonce);
	formData.append('data', JSON.stringify(data));
	formData.append('form_id', data.id);
	formData.append('form_creator_id', data.creator_id);
	formData.append('form_name', data.title);

	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		body: formData
	});

	return response.json();
}

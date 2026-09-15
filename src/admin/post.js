import { __ } from '@wordpress/i18n';

import './post.scss';

/**
 * Click-to-copy for the ShortCode column on the Surveys list screen.
 *
 * Delegated from the document rather than an inline onclick attribute, so the
 * rows added by WordPress list-table AJAX (quick edit, sorting) keep working and
 * nothing has to be exposed on window.
 */
const RESET_AFTER = 1500;

document.addEventListener('click', (event) => {
	const input = event.target.closest('[data-svb-shortcode]');

	if (!input) {
		return;
	}

	const wrapper = input.closest('.bPlAdminShortcode');
	const tooltip = wrapper?.querySelector('.tooltip');

	input.select();
	input.setSelectionRange(0, input.value.length);

	// execCommand rather than navigator.clipboard: the async clipboard API
	// needs a secure context, and plenty of sites run wp-admin over plain HTTP.
	let copied = false;

	try {
		copied = document.execCommand('copy');
	} catch (e) {
		copied = false;
	}

	if (!tooltip) {
		return;
	}

	tooltip.textContent = copied
		? __('Copied Successfully!', 'survey-form-block')
		: __('Press Ctrl/Cmd + C to copy', 'survey-form-block');

	clearTimeout(wrapper.svbTimer);
	wrapper.svbTimer = setTimeout(() => {
		tooltip.textContent = __('Copy To Clipboard', 'survey-form-block');
	}, RESET_AFTER);
});

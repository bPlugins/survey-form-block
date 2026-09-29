import { __ } from '@wordpress/i18n';

import './post.scss';

/**
 * Click-to-copy for the ShortCode column on the Surveys list screen.
 *
 * Delegated from the document rather than an inline onclick attribute, so the
 * rows added by WordPress list-table AJAX (quick edit, sorting) keep working and
 * nothing has to be exposed on window.
 *
 * Copy is two-stage, the same as the editor's shortcode clip: the async
 * clipboard API where it exists, execCommand otherwise. navigator.clipboard
 * needs a secure context and plenty of sites run wp-admin over plain HTTP, so
 * the fallback is the path that actually runs on them.
 */
const RESET_AFTER = 1500;

/**
 * Shows the outcome in the tooltip and clears it again after a moment.
 *
 * @param {HTMLElement} wrapper The .bPlAdminShortcode wrapper.
 * @param {HTMLElement} tooltip The .tooltip inside it.
 * @param {boolean}     copied  Whether the copy succeeded.
 */
const report = (wrapper, tooltip, copied) => {
	if (!tooltip) {
		return;
	}

	tooltip.textContent = copied
		? __('Copied Successfully!', 'survey-form-block')
		: __('Press Ctrl/Cmd + C to copy', 'survey-form-block');

	// Drives the green tooltip, and keeps it on screen while it says so.
	tooltip.classList.toggle('copied', copied);

	clearTimeout(wrapper.svbTimer);
	wrapper.svbTimer = setTimeout(() => {
		tooltip.textContent = __('Copy To Clipboard', 'survey-form-block');
		tooltip.classList.remove('copied');
	}, RESET_AFTER);
};

document.addEventListener('click', (event) => {
	const input = event.target.closest('[data-svb-shortcode]');

	if (!input) {
		return;
	}

	const wrapper = input.closest('.bPlAdminShortcode');
	const tooltip = wrapper?.querySelector('.tooltip');

	const legacyCopy = () => {
		input.select();
		input.setSelectionRange(0, input.value.length);

		let copied = false;

		try {
			copied = document.execCommand('copy');
		} catch (e) {
			copied = false;
		}

		report(wrapper, tooltip, copied);
	};

	if (navigator.clipboard?.writeText) {
		navigator.clipboard
			.writeText(input.value)
			.then(() => report(wrapper, tooltip, true))
			.catch(legacyCopy);
	} else {
		legacyCopy();
	}
});

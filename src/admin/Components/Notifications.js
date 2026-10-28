import { useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Response-email settings, shown above the responses table.
 *
 * Collapsed to one line saying what happens today; "Change" opens the choices.
 * Saved through the `svb_save_notify_settings` AJAX action (includes/Options.php).
 */
const MODES = [
	{ value: 'first', label: __('When a survey gets its first response', 'survey-form-block') },
	{ value: 'each', label: __('For every response (at most 30 emails an hour)', 'survey-form-block') },
	{ value: 'off', label: __('Never', 'survey-form-block') }
];

const Notifications = () => {
	const initial = window.svbData?.notify;

	const [saved, setSaved] = useState({ mode: initial?.mode || 'first', email: initial?.email || '' });
	const [mode, setMode] = useState(saved.mode);
	const [email, setEmail] = useState(saved.email);
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [notice, setNotice] = useState(null);

	if (!initial) {
		return null;
	}

	const recipient = saved.email || initial.adminEmail;

	// One sprintf() per string: the POT extractor only reads a translators
	// comment placed directly before the __() call.
	let summary = __('Response emails are off.', 'survey-form-block');

	if ('first' === saved.mode) {
		summary = sprintf(
			/* translators: %s: email address(es). */
			__('An email goes to %s when a survey receives its first response.', 'survey-form-block'),
			recipient
		);
	} else if ('each' === saved.mode) {
		summary = sprintf(
			/* translators: %s: email address(es). */
			__('Every new response is emailed to %s.', 'survey-form-block'),
			recipient
		);
	}

	const save = (e) => {
		e.preventDefault();
		setBusy(true);
		setNotice(null);

		const body = new FormData();
		body.append('action', 'svb_save_notify_settings');
		body.append('nonce', initial.nonce);
		body.append('mode', mode);
		body.append('email', email);

		fetch(window.svbData.ajaxUrl, { method: 'POST', credentials: 'same-origin', body })
			.then(r => r.json())
			.then(res => {
				if (!res?.success) {
					setNotice({ type: 'error', text: res?.data || __('The settings could not be saved.', 'survey-form-block') });
					return;
				}

				setSaved({ mode: res.data.mode, email: res.data.email });
				setEmail(res.data.email);
				setOpen(false);
				setNotice({ type: 'ok', text: __('Email settings saved.', 'survey-form-block') });
			})
			.catch(() => setNotice({ type: 'error', text: __('Could not reach the server.', 'survey-form-block') }))
			.finally(() => setBusy(false));
	};

	return <div className="svbAdmin svbNotify">
		<div className="svbPanel">
			<div className="svbNotifyHead">
				<div>
					<h2>{__('Response emails', 'survey-form-block')}</h2>
					<p>{summary}</p>
				</div>

				<button type="button" className="svbRefresh" aria-expanded={open} onClick={() => { setOpen(!open); setNotice(null); }}>
					{open ? __('Close', 'survey-form-block') : __('Change', 'survey-form-block')}
				</button>
			</div>

			{open && <form className="svbNotifyForm" onSubmit={save}>
				<fieldset>
					<legend>{__('Send an email', 'survey-form-block')}</legend>
					{MODES.map(option => <label key={option.value} className="svbNotifyOption">
						<input type="radio" name="svbNotifyMode" value={option.value} checked={mode === option.value} onChange={() => setMode(option.value)} />
						{option.label}
					</label>)}
				</fieldset>

				<div className="svbField">
					<label htmlFor="svbNotifyEmail">{__('Send to', 'survey-form-block')}</label>
					<input
						id="svbNotifyEmail"
						type="text"
						inputMode="email"
						value={email}
						placeholder={initial.adminEmail}
						disabled={'off' === mode}
						onChange={e => setEmail(e.target.value)}
					/>
					<span className="svbNotifyHint">{__('Leave empty to use the site admin email. Separate several addresses with commas.', 'survey-form-block')}</span>
				</div>

				<button type="submit" className="svbRefresh svbPrimary" disabled={busy}>
					{busy ? __('Saving…', 'survey-form-block') : __('Save', 'survey-form-block')}
				</button>
			</form>}

			{notice && <div className={`svbNotice ${'error' === notice.type ? 'isError' : 'isOk'}`} role="status">{notice.text}</div>}
		</div>
	</div>;
};

export default Notifications;

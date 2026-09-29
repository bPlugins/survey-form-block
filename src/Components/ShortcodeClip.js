import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import './ShortcodeClip.scss';

const CopyIcon = () => (
	<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);

const CheckIcon = () => (
	<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

const ShortcodeIcon = () => (
	<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="8 7 3 12 8 17" />
		<polyline points="16 7 21 12 16 17" />
	</svg>
);

/**
 * Click-to-copy shortcode clip shown above the survey block while editing a
 * saved survey. Matches the Business Card block's editor clip.
 *
 * The copy path is deliberately two-stage: navigator.clipboard needs a secure
 * context, and wp-admin is routinely served over plain HTTP on local and
 * staging sites, where it is simply undefined. execCommand is the path that
 * actually runs there, so it is a real fallback rather than a legacy nicety.
 *
 * @param {Object} props
 * @param {string} props.shortCode The shortcode text to copy.
 */
const ShortcodeClip = ({ shortCode }) => {
	const [copied, setCopied] = useState(false);
	const timer = useRef(null);

	// The timeout outlives the component if the block is removed mid-flash.
	useEffect(() => () => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
	}, []);

	const flash = () => {
		setCopied(true);

		if (timer.current) {
			clearTimeout(timer.current);
		}

		timer.current = setTimeout(() => setCopied(false), 1800);
	};

	const copy = (e) => {
		e?.preventDefault();
		e?.stopPropagation();

		if (!shortCode) {
			return;
		}

		const fallback = () => {
			const ta = document.createElement('textarea');

			ta.value = shortCode;
			ta.style.position = 'fixed';
			ta.style.left = '-9999px';
			document.body.appendChild(ta);
			ta.focus();
			ta.select();

			try {
				document.execCommand('copy');
				flash();
			} catch (err) {
				// Copy unsupported; the code stays on screen to select by hand.
			}

			document.body.removeChild(ta);
		};

		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(shortCode).then(flash).catch(fallback);
		} else {
			fallback();
		}
	};

	return (
		<div className={`svbShortcodeClip${copied ? ' is-copied' : ''}`}>
			<span className="svbShortcodeClip__tag">
				<ShortcodeIcon />
				{__('Shortcode', 'survey-form-block')}
			</span>

			<button
				type="button"
				className="svbShortcodeClip__field"
				onClick={copy}
				title={__('Click to copy', 'survey-form-block')}
			>
				<code className="svbShortcodeClip__code">{shortCode}</code>

				<span className="svbShortcodeClip__btn">
					{copied ? <CheckIcon /> : <CopyIcon />}
					<span className="svbShortcodeClip__btnText">
						{copied ? __('Copied!', 'survey-form-block') : __('Copy', 'survey-form-block')}
					</span>
				</span>
			</button>

			{/* Screen readers get the state change; sighted users get the button label. */}
			<span className="screen-reader-text" aria-live="polite">
				{copied ? __('Shortcode copied to clipboard', 'survey-form-block') : ''}
			</span>

			<span className="svbShortcodeClip__hint">
				{__('Paste it into any post, page, or widget.', 'survey-form-block')}
			</span>
		</div>
	);
};

export default ShortcodeClip;

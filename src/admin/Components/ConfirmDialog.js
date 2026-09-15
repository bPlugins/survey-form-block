import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';

const WarningIcon = () => (
	<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
		<path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
	</svg>
);

/**
 * Confirmation dialog for destructive actions.
 *
 * Replaces `window.confirm`, which renders unstyled browser chrome, cannot say
 * *what* is about to be deleted beyond one line of plain text, and blocks the
 * whole tab while it is open.
 *
 * Keyboard behaviour matches what people expect of a modal: Escape cancels, Tab
 * stays inside the dialog, and focus lands on the safe action rather than the
 * destructive one.
 */
const ConfirmDialog = ({ open, title, message, confirmLabel, isDestructive = true, busy = false, onConfirm, onCancel }) => {
	const cancelRef = useRef(null);
	const dialogRef = useRef(null);

	// Callers pass inline arrows, so their identity changes on every render.
	// Reading them through a ref keeps the effect below tied to `open` alone,
	// instead of tearing down and re-adding a document listener each render.
	const cancelHandler = useRef(onCancel);
	cancelHandler.current = onCancel;

	useEffect(() => {
		if (!open) {
			return undefined;
		}

		// Opening on Cancel: a mis-aimed Enter should not delete anything.
		cancelRef.current?.focus();

		const onKeyDown = (event) => {
			if ('Escape' === event.key) {
				event.preventDefault();
				cancelHandler.current();
				return;
			}

			if ('Tab' !== event.key) {
				return;
			}

			const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])');

			if (!focusable?.length) {
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', onKeyDown);

		return () => document.removeEventListener('keydown', onKeyDown);
	}, [open]);

	if (!open) {
		return null;
	}

	return (
		<div
			className="svbModalOverlay"
			onMouseDown={(e) => { if (e.target === e.currentTarget) { cancelHandler.current(); } }}
		>
			<div
				className="svbModal"
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="svbModalTitle"
				aria-describedby="svbModalBody"
			>
				{isDestructive && <span className="svbModalIcon"><WarningIcon /></span>}

				<h2 id="svbModalTitle">{title}</h2>
				<p id="svbModalBody">{message}</p>

				<div className="svbModalActions">
					<button type="button" ref={cancelRef} onClick={onCancel} disabled={busy}>
						{__('Cancel', 'survey-form-block')}
					</button>

					<button
						type="button"
						className={isDestructive ? 'svbDanger' : 'svbPrimary'}
						onClick={onConfirm}
						disabled={busy}
					>
						{busy ? __('Working…', 'survey-form-block') : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;

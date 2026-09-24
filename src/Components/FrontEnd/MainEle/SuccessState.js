/**
 * Success / thank-you state.
 *
 * Replaces the previous bare `<p>` while keeping the same class names and the
 * same `successMsg` attribute, so nothing saved before this release is lost.
 */

import { getIcon } from '../../../utils/svbIcons';

const SuccessState = ({ design, message, isBackend = false }) => {
	const { success } = design;
	const icon = 'none' === success.icon ? null : getIcon(success.icon);

	return (
		<div
			className={`successArea svbSuccess-${success.style} ${isBackend ? 'svbSuccessPreview' : ''}`}
			role="status"
			aria-live="polite"
		>
			<div className="svbSuccessContainer">
				{icon && (
					<div className="svbSuccessIconWrapper">
						<span className="svbSuccessIcon">{icon}</span>
					</div>
				)}

				<div className="svbSuccessBody">
					{success.title && <p className="svbSuccessTitle">{success.title}</p>}
					<p className="message">{message}</p>
				</div>
			</div>
		</div>
	);
};

export default SuccessState;

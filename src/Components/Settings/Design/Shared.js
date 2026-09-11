/**
 * Shared building blocks for the Design inspector tab.
 *
 * `OptionGrid` is the workhorse: a visual picker that shows free and Pro choices
 * side by side. Pro choices stay visible (and previewable as a swatch) but open
 * the upgrade modal instead of writing an attribute, so the value of upgrading
 * is obvious without nagging.
 */

import { __ } from '@wordpress/i18n';
import { PanelRow } from '@wordpress/components';

import Label from '../../../../../bpl-tools/Components/Label/Label';
import { crownIcon } from '../../../../../bpl-tools/utils/icons';

/** Small crown chip reused in panel titles. */
export const ProTag = ({ label = __('Pro', 'survey-form-block') }) => (
	<span className="svbProTag">{crownIcon}{label}</span>
);

const LockIcon = () => (
	<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
		<path d="M17 9V7a5 5 0 0 0-10 0v2H6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1Zm-8-2a3 3 0 0 1 6 0v2H9Z" />
	</svg>
);

/**
 * @param {Object}   props
 * @param {string}   props.label       Control label.
 * @param {Array}    props.options     `{ value, label, pro?, hint?, preview? }`.
 * @param {string}   props.value       Selected value.
 * @param {Function} props.onChange    Called with the new value (free options only).
 * @param {boolean}  props.isPremium   Whether Pro is active.
 * @param {Function} props.onProClick  Opens the upgrade modal.
 * @param {string}   props.columns     Grid density: 'two' | 'three'.
 */
export const OptionGrid = ({ label, options, value, onChange, isPremium, onProClick, columns = 'two', help }) => (
	<div className="svbOptionGridWrap">
		{label && <Label className="mb5">{label}</Label>}

		<div className={`svbOptionGrid svbCols-${columns}`}>
			{options.map(option => {
				const locked = option.pro && !isPremium;
				const active = value === option.value;

				return (
					<button
						key={option.value}
						type="button"
						className={`svbOption ${active ? 'isActive' : ''} ${locked ? 'isLocked' : ''}`}
						title={option.hint || option.label}
						aria-pressed={active}
						onClick={() => locked ? onProClick() : onChange(option.value)}
					>
						{option.preview && <span className="svbOptionPreview">{option.preview}</span>}
						<span className="svbOptionLabel">{option.label}</span>
						{locked && <span className="svbOptionLock"><LockIcon /></span>}
					</button>
				);
			})}
		</div>

		{help && <p className="svbControlHelp">{help}</p>}
	</div>
);

/**
 * Wraps any control so it is visibly disabled and routed to the upgrade modal
 * when Pro is inactive, without ever discarding a stored value.
 */
export const ProGate = ({ isPremium, onProClick, children, label }) => {
	if (isPremium) {
		return children;
	}

	return (
		<div className="svbProGate" onClickCapture={e => { e.preventDefault(); e.stopPropagation(); onProClick(); }} role="presentation">
			<div className="svbProGateInner" aria-hidden="true">{children}</div>
			<span className="svbProGateBadge">{crownIcon}{label || __('Pro', 'survey-form-block')}</span>
		</div>
	);
};

/** A labelled row used by the simple select-style controls. */
export const Row = ({ label, children, className = '' }) => (
	<PanelRow className={`svbSettingRow ${className}`}>
		<Label>{label}</Label>
		{children}
	</PanelRow>
);

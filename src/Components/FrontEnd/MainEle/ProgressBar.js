/**
 * Completion progress indicator.
 *
 * Purely presentational: it reflects how many answerable questions currently
 * hold a value. No survey logic, pagination or state machine is introduced -
 * the data already exists in `formData`.
 *
 * The free build draws the linear bar. The premium styles (circular, step dots,
 * segmented) are drawn by the premium build through the `svb.progress.render`
 * filter; `resolveDesign()` maps them to linear when they are not available.
 */

import { applyFilters } from '@wordpress/hooks';

const isAnswered = value => {
	if (Array.isArray(value)) {
		return value.length > 0;
	}

	if ('boolean' === typeof value) {
		return value;
	}

	if ('number' === typeof value) {
		return true;
	}

	return Boolean(value && String(value).trim() && !String(value).startsWith('undefined'));
};

const ProgressBar = ({ fields = [], formData = {}, design }) => {
	const { progress } = design;

	// Section dividers and disabled fields are not questions.
	const answerable = fields.filter(f => f.type && 'section' !== f.type && !f.isDisable);
	const total = answerable.length;

	if (!total) {
		return null;
	}

	const done = answerable.filter(f => isAnswered(formData[f.id])).length;
	const percent = Math.round((done / total) * 100);
	const style = progress.style;

	const label = progress.showLabel && (
		<div className="svbProgressLabel">
			<span className="svbProgressCount">{done} / {total}</span>
			<span className="svbProgressPercent">{percent}%</span>
		</div>
	);

	const premium = applyFilters('svb.progress.render', null, { style, progress, answerable, formData, done, total, percent, label, isAnswered });

	if (premium) {
		return premium;
	}

	// linear + gradient share the same markup.
	return (
		<div className={`svbProgressArea svbProgress-${style} svbProgress-${progress.position}`}>
			<div
				className="svbProgressTrack"
				role="progressbar"
				aria-valuenow={percent}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label="Survey completion"
			>
				<span className="svbProgressFill" style={{ width: `${percent}%` }} />
			</div>
			{label}
		</div>
	);
};

export default ProgressBar;

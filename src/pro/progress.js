/**
 * Premium progress indicator styles: circular, step dots and segmented.
 *
 * Premium build only. Drawn through the `svb.progress.render` filter that
 * `src/Components/FrontEnd/MainEle/ProgressBar.js` calls; the markup moved
 * here unchanged.
 */

import { addFilter } from '@wordpress/hooks';

const render = (element, { style, progress, answerable, formData, done, total, percent, label, isAnswered }) => {
	if ('circular' === style) {
		const radius = 26;
		const circumference = 2 * Math.PI * radius;

		return (
			<div className={`svbProgressArea svbProgress-circular svbProgress-${progress.position}`}>
				<svg className="svbProgressCircle" viewBox="0 0 64 64" role="img" aria-label={`${percent}% complete`}>
					<circle className="svbProgressCircleTrack" cx="32" cy="32" r={radius} />
					<circle
						className="svbProgressCircleValue"
						cx="32" cy="32" r={radius}
						strokeDasharray={circumference}
						strokeDashoffset={circumference - (circumference * percent) / 100}
					/>
				</svg>
				{progress.showLabel && <span className="svbProgressCircleText">{percent}%</span>}
			</div>
		);
	}

	if ('steps' === style) {
		return (
			<div className={`svbProgressArea svbProgress-steps svbProgress-${progress.position}`}>
				<div className="svbProgressSteps" role="img" aria-label={`${done} of ${total} answered`}>
					{answerable.map((field, i) => (
						<span key={field.id} className={`svbProgressStep ${isAnswered(formData[field.id]) ? 'done' : ''}`}>
							<i className="svbProgressStepDot">{i + 1}</i>
						</span>
					))}
				</div>
				{label}
			</div>
		);
	}

	if ('segmented' === style) {
		return (
			<div className={`svbProgressArea svbProgress-segmented svbProgress-${progress.position}`}>
				<div className="svbProgressSegments" role="img" aria-label={`${percent}% complete`}>
					{answerable.map(field => (
						<span key={field.id} className={`svbProgressSegment ${isAnswered(formData[field.id]) ? 'done' : ''}`} />
					))}
				</div>
				{label}
			</div>
		);
	}

	return element;
};

export const registerProProgress = () => addFilter('svb.progress.render', 'svb/pro-design', render);

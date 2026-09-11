/**
 * Completion progress indicator.
 *
 * Purely presentational: it reflects how many answerable questions currently
 * hold a value. No survey logic, pagination or state machine is introduced -
 * the data already exists in `formData`.
 */

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

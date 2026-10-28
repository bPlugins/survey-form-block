import { __ } from '@wordpress/i18n';

import LabelArea from '../MainEle/LabelArea';

/** Keys that move a range input; Tab and the rest must not count as an answer. */
const MOVE_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

/**
 * Range slider.
 *
 * The thumb rests on the author's starting value (`startValue`, the field's
 * own `value` setting), but nothing is recorded until the visitor touches it.
 * Previously the pill showed a number that was never submitted, and a
 * required slider failed while displaying a value. A tap or click on the thumb
 * without moving it also counts, so the starting value can be chosen as-is.
 */
const RangeSlider = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, min = 0, max = 100, step = 1, startValue, value, help, onChange }) => {
	const low = Number(min) || 0;
	const high = Number.isFinite(Number(max)) ? Number(max) : 100;
	const hasStart = undefined !== startValue && null !== startValue && '' !== startValue && Number.isFinite(Number(startValue));
	const resting = hasStart ? Number(startValue) : Math.round((low + high) / 2);

	const isAnswered = undefined !== value && null !== value && '' !== value;
	const shown = isAnswered ? value : resting;

	const record = (e) => onChange(Number(e.target.value));

	return (
		<div className={`fieldMainArea labelPosition-${index}`}>
			<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
			<div className="fieldArea svbRangeSliderArea">
				<div className="svbSliderWrapper">
					<input
						type="range"
						id={`${cId}-${index}`}
						min={low}
						max={high}
						step={step}
						value={shown}
						aria-valuetext={isAnswered ? String(value) : __('Not answered', 'survey-form-block')}
						onChange={record}
						onPointerUp={record}
						onKeyUp={(e) => MOVE_KEYS.includes(e.key) && record(e)}
						className={`svbRangeInput${isAnswered ? '' : ' isUntouched'}`}
					/>
					<div className={`svbSliderValuePill${isAnswered ? '' : ' isEmpty'}`} title={isAnswered ? undefined : __('Not answered', 'survey-form-block')}>
						{isAnswered ? value : '—'}
					</div>
				</div>
				<div className="svbRangeBounds">
					<span>{low}</span>
					<span>{high}</span>
				</div>
			</div>
		</div>
	);
};

export default RangeSlider;

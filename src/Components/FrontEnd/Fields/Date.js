import LabelArea from '../MainEle/LabelArea';
import { dateBounds, isoDateOrEmpty } from '../../../utils/answers';

/**
 * Date question.
 *
 * Was three selects (month, day, year) that wrote "undefined March, undefined"
 * for a partly filled date, threw when the month was set back to "Select
 * Month", listed August twice, accepted 31 February, and stopped at 2023 by
 * default. A native date input fixes all of that, opens the phone's own
 * picker, and is labelled by the question for screen readers.
 *
 * Answers are stored as ISO dates (YYYY-MM-DD). `selectArea` stays on the
 * wrapper for site CSS written against the old markup.
 */
const DateField = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, name, help, classes, value, onChange, end, start }) => {
	const { min, max } = dateBounds(start, end);

	return <div className={`fieldMainArea labelPosition-${index} `}>
		<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
		<div className={`fieldArea ${classes || ''}`}>
			<div className="selectArea svbDateArea">
				<input
					type="date"
					id={`${cId}-${index}`}
					name={name}
					value={isoDateOrEmpty(value)}
					min={min || undefined}
					max={max || undefined}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
		</div>
	</div>;
};

export default DateField;

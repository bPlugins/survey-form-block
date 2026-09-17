import LabelArea from '../MainEle/LabelArea';

/**
 * On/off switch.
 *
 * The value is tracked as a boolean so that "required" keeps meaning "must be
 * switched on". It is converted to `onLabel`/`offLabel` when the form is
 * submitted, so a stored response reads "Yes" rather than "true".
 */
const Toggle = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, value, help, onChange, onLabel, offLabel }) => {
	const isChecked = Boolean(value);
	const stateText = isChecked ? (onLabel || 'Yes') : (offLabel || 'No');

	return (
		<div className={`fieldMainArea labelPosition-${index}`}>
			<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />

			<div className="fieldArea svbToggleArea">
				<label className="svbSwitch">
					<input
						type="checkbox"
						id={`${cId}-${index}`}
						checked={isChecked}
						onChange={(e) => onChange(e.target.checked)}
					/>
					<span className="svbSlider round"></span>
				</label>

				<span className="svbToggleStateText">{stateText}</span>
			</div>
		</div>
	);
};

export default Toggle;

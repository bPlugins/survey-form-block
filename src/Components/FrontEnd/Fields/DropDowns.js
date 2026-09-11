import LabelArea from '../MainEle/LabelArea';

const DropDown = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, isRequired, name, value, classes, options = [], help, onChange }) => {
	return <div className={`fieldMainArea labelPosition-${index} `}>
		<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} />

		<div className={`fieldArea ${classes}`}>
			<select id={`${cId}-${index}`} name={name} value={value || ''} onChange={(e) => onChange(e.target.value)}>
				<option value="">Select</option>
				{options.map((option, childIndex) => (
					<option key={`${option.value}-${childIndex}`} value={option.value}>{option.label}</option>
				))}
			</select>
		</div>
	</div>;
};

export default DropDown;

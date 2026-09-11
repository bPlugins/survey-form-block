import LabelArea from '../MainEle/LabelArea';

const Radio = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, isRequired, id, value, help, classes, options = [], onChange }) => {
	// Every radio group needs its own name, otherwise a second radio question -
	// or a second survey on the same page - would share one selection.
	const groupName = `svb-${cId || 'f'}-${id || index}`;

	return <div className={`fieldMainArea labelPosition-${index} `}>
		<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} />

		<div className={`fieldArea ${classes}  fieldArea-${index}`} role="radiogroup">
			{options.map((option, childIndex) => {
				return <div key={`${groupName}-${childIndex}`} className='field'>
					<input type="radio" id={`${cId}-${index}-${childIndex}`} name={groupName} checked={value === option.value} value={option.value} onChange={() => onChange(option.value)} />
					<label htmlFor={`${cId}-${index}-${childIndex}`}>{option.label}</label>
				</div>;
			})}
		</div>
	</div>;
};

export default Radio;

import LabelArea from '../MainEle/LabelArea';

const NumberField = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, name, placeholder, classes, value, help, min, max, step, onChange }) => {
    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
            <div className={`fieldArea ${classes || ''}`}>
                <input
                    type="number"
                    name={name}
                    id={`${cId}-${index}`}
                    value={value || ''}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step || 'any'}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default NumberField;

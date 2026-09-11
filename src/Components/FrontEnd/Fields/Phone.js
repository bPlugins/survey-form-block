import LabelArea from '../MainEle/LabelArea';

const Phone = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, isRequired, name, placeholder, classes, value, help, onChange }) => {
    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} />
            <div className={`fieldArea ${classes || ''}`}>
                <input
                    type="tel"
                    name={name}
                    id={`${cId}-${index}`}
                    value={value || ''}
                    placeholder={placeholder || '+1 (555) 000-0000'}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Phone;

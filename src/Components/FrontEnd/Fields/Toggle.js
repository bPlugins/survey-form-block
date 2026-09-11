import LabelArea from '../MainEle/LabelArea';

const Toggle = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, isRequired, value, help, onChange }) => {
    const isChecked = Boolean(value);

    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} />
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
                <span className="svbToggleStateText">{isChecked ? 'Yes' : 'No'}</span>
            </div>
        </div>
    );
};

export default Toggle;

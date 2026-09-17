import LabelArea from '../MainEle/LabelArea';

const RangeSlider = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, min = 0, max = 100, step = 1, value = 50, help, onChange }) => {
    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
            <div className="fieldArea svbRangeSliderArea">
                <div className="svbSliderWrapper">
                    <input
                        type="range"
                        id={`${cId}-${index}`}
                        min={min}
                        max={max}
                        step={step}
                        value={value !== undefined && value !== '' ? value : Math.round((Number(min) + Number(max)) / 2)}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="svbRangeInput"
                    />
                    <div className="svbSliderValuePill">
                        {value !== undefined && value !== '' ? value : Math.round((Number(min) + Number(max)) / 2)}
                    </div>
                </div>
                <div className="svbRangeBounds">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;

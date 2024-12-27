
import LabelArea from '../MainEle/LabelArea';

const DropDown = ({ cId, fieldEls, buttonArea, index, isRequired, name, value, classes, options = [], help, onChange }) => {

    return <div className={`fieldMainArea labelPosition-${index} `}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
        <div className={`fieldArea ${classes}`}>

            <select id={`${cId}-${index}`} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">Select</option>
                {options.map((option) => {
                    return <><option value={option.value}>{option.label}</option></>
                })}
            </select>
        </div>
    </div>
}
export default DropDown;
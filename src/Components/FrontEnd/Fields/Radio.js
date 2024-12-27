


import LabelArea from '../MainEle/LabelArea';

const Radio = ({ cId, fieldEls, buttonArea, index, isRequired, value, help, classes, options = [], onChange }) => {
    return <div className={`fieldMainArea labelPosition-${index} `}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
        <div className={`fieldArea ${classes}  fieldArea-${index}`}>

            {options.map((option, childIndex) => {
                return <div key={index} className='field'>
                    <input type="radio" id={`${cId}-${index}-${childIndex}`} name="author" checked={value === option.value} value={option.value} onChange={() => onChange(option.value)} />
                    <label htmlFor={`${cId}-${index}-${childIndex}`}>{option.label}</label>
                </div>
            })}
        </div>
    </div>
}
export default Radio;
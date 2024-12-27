

import LabelArea from '../MainEle/LabelArea';

const TextArea = ({ cId, fieldEls, buttonArea, index, isRequired, name, placeholder, classes, value, help, onChange }) => {
    return <div className={`fieldMainArea labelPosition-${index} `}>

        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
        <div className={`fieldArea ${classes}`}>
            <textarea id={`${cId}-${index}`} value={value} name={name} placeholder={placeholder} onChange={e => onChange(e.target.value)} rows={4} />
        </div>
    </div>
}
export default TextArea;
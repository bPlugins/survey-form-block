

import LabelArea from '../MainEle/LabelArea';

const Email = ({ cId, fieldEls, buttonArea, index, isRequired, name, value, placeholder, classes, help, onChange }) => {
    return <div className={`fieldMainArea labelPosition-${index}`}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
        <div className={`fieldArea ${classes}`}>
            <input type='email' id={`${cId}-${index}`} name={name} value={value} placeholder={placeholder}
                onChange={e => onChange(e.target.value)} />
        </div>
    </div>
}
export default Email;
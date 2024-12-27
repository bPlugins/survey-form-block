

import LabelArea from '../MainEle/LabelArea';

const Text = ({ cId, fieldEls, buttonArea, index, isRequired, name, placeholder, classes, value, help, onChange }) => {

    return <div className={`fieldMainArea labelPosition-${index}`}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />

        <div className={`fieldArea ${classes}`}>
            <input type='text' name={name} id={`${cId}-${index}`} value={value} placeholder={placeholder}
                onChange={e => onChange(e.target.value)} />
        </div>
    </div>
}
export default Text;


import LabelArea from '../MainEle/LabelArea';

const Checkbox = ({ cId, fieldEls, buttonArea, index, isRequired, name, help, classes, options = [], value = [], onChange }) => {

    return <div className={`fieldMainArea labelPosition-${index} `}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />

        <div className={`fieldArea ${classes} fieldArea-${index}`}>
            {options.map((opt, childIndex) => {
                const isInc = value.includes(opt.value);
                return <div key={childIndex} className='field'>
                    <input type="checkbox" id={`${cId}-${index}-${childIndex}`} key={childIndex} name={name + '-' + childIndex} className={classes + '-' + childIndex} checked={isInc} onChange={e => {
                        onChange(e.target.checked ? [...value, opt.value] : value.filter(item => item !== opt.value));
                    }} />
                    <label htmlFor={`${cId}-${index}-${childIndex}`}>{opt.label}</label>
                </div>
            })}
        </div>
    </div>
}
export default Checkbox;
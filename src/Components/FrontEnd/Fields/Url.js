import LabelArea from '../MainEle/LabelArea';

const UrlField = ({ cId, fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, name, placeholder, classes, value, help, onChange }) => {
    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
            <div className={`fieldArea ${classes || ''}`}>
                <input
                    type="url"
                    name={name}
                    id={`${cId}-${index}`}
                    value={value || ''}
                    placeholder={placeholder || 'https://example.com'}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default UrlField;

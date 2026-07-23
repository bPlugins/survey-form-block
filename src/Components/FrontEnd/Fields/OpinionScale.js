import LabelArea from '../MainEle/LabelArea';

const OpinionScale = ({ fieldEls, buttonArea, index, isRequired, value, help, onChange }) => {
    const scalePoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
            <div className="fieldArea svbOpinionScaleArea">
                <div className="svbScaleWrapper">
                    {scalePoints.map((point) => (
                        <button
                            key={point}
                            type="button"
                            className={`svbScaleBtn ${value === point ? 'selected' : ''}`}
                            onClick={() => onChange(point)}
                        >
                            {point}
                        </button>
                    ))}
                </div>
                <div className="svbScaleLabels">
                    <span>Not at all likely</span>
                    <span>Extremely likely</span>
                </div>
            </div>
        </div>
    );
};

export default OpinionScale;

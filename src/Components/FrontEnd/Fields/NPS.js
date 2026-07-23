import LabelArea from '../MainEle/LabelArea';

const NPS = ({ fieldEls, buttonArea, index, isRequired, value, help, onChange }) => {
    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const getScoreCategory = (score) => {
        if (score <= 6) return 'detractor';
        if (score <= 8) return 'passive';
        return 'promoter';
    };

    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
            <div className="fieldArea svbNpsArea">
                <div className="svbNpsGrid">
                    {scores.map((score) => {
                        const category = getScoreCategory(score);
                        const isSelected = value === score;
                        return (
                            <button
                                key={score}
                                type="button"
                                className={`svbNpsBtn ${category} ${isSelected ? 'active' : ''}`}
                                onClick={() => onChange(score)}
                            >
                                {score}
                            </button>
                        );
                    })}
                </div>
                <div className="svbNpsLegend">
                    <span className="detractorLabel">0-6 Detractors</span>
                    <span className="passiveLabel">7-8 Passives</span>
                    <span className="promoterLabel">9-10 Promoters</span>
                </div>
            </div>
        </div>
    );
};

export default NPS;

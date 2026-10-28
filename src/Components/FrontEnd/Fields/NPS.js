import { __ } from '@wordpress/i18n';

import LabelArea from '../MainEle/LabelArea';

const NPS = ({ fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, value, help, onChange }) => {
    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const getScoreCategory = (score) => {
        if (score <= 6) return 'detractor';
        if (score <= 8) return 'passive';
        return 'promoter';
    };

    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />
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
                                aria-pressed={isSelected}
                                onClick={() => onChange(score)}
                            >
                                {score}
                            </button>
                        );
                    })}
                </div>
                <div className="svbNpsLegend">
                    <span className="detractorLabel">{__('0-6 Detractors', 'survey-form-block')}</span>
                    <span className="passiveLabel">{__('7-8 Passives', 'survey-form-block')}</span>
                    <span className="promoterLabel">{__('9-10 Promoters', 'survey-form-block')}</span>
                </div>
            </div>
        </div>
    );
};

export default NPS;

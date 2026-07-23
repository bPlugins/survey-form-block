import LabelArea from '../MainEle/LabelArea';

const StarRating = ({ fieldEls, buttonArea, index, isRequired, maxStars = 5, value = 0, help, onChange }) => {
    const starCount = parseInt(maxStars) || 5;

    return (
        <div className={`fieldMainArea labelPosition-${index}`}>
            <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
            <div className="fieldArea svbStarRatingArea">
                <div className="svbStarsWrapper">
                    {Array.from({ length: starCount }, (_, i) => i + 1).map((starNum) => (
                        <button
                            key={starNum}
                            type="button"
                            className={`svbStarBtn ${starNum <= (value || 0) ? 'active' : ''}`}
                            onClick={() => onChange(starNum)}
                            aria-label={`Rate ${starNum} out of ${starCount}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                {value > 0 && <span className="svbStarValueBadge">{value} / {starCount}</span>}
            </div>
        </div>
    );
};

export default StarRating;

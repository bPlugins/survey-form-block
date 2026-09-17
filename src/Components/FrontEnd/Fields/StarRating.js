import { useState } from 'react';
import LabelArea from '../MainEle/LabelArea';

const StarShape = () => (
	<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
		<path d="m12 2.6 2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.65l-5.9 3.11 1.13-6.57L2.45 9.54l6.6-.96Z" />
	</svg>
);

const StarRating = ({ fieldEls, buttonArea, index, icon, requiredMark, requiredText, isRequired, maxStars = 5, value = 0, help, onChange }) => {
	const starCount = parseInt(maxStars) || 5;
	const [hovered, setHovered] = useState(0);
	const shown = hovered || value || 0;

	return (
		<div className={`fieldMainArea labelPosition-${index}`}>
			<LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} icon={icon} requiredMark={requiredMark} requiredText={requiredText} />

			<div className="fieldArea svbStarRatingArea">
				<div className="svbStarsWrapper" onMouseLeave={() => setHovered(0)}>
					{Array.from({ length: starCount }, (_, i) => i + 1).map((starNum) => (
						<button
							key={starNum}
							type="button"
							className={`svbStarBtn ${starNum <= shown ? 'active' : ''}`}
							onClick={() => onChange(starNum === value ? 0 : starNum)}
							onMouseEnter={() => setHovered(starNum)}
							onFocus={() => setHovered(starNum)}
							onBlur={() => setHovered(0)}
							aria-label={`Rate ${starNum} out of ${starCount}`}
							aria-pressed={starNum <= (value || 0)}
						>
							<StarShape />
						</button>
					))}
				</div>

				{value > 0 && <span className="svbStarValueBadge">{value} / {starCount}</span>}
			</div>
		</div>
	);
};

export default StarRating;

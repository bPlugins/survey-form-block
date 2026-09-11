import { getIcon } from '../../../utils/svbIcons';

const Section = ({ fieldEls, help, icon = '' }) => {
	const iconEl = icon ? getIcon(icon) : null;

	return (
		<div className="svbSectionDivider">
			<div className="svbSectionHeader">
				{iconEl && <span className="svbFieldIcon" aria-hidden="true">{iconEl}</span>}
				{fieldEls.label}
			</div>

			{help && <p className="svbSectionDescription">{help}</p>}

			<hr className="svbSectionLine" />
		</div>
	);
};

export default Section;

import { __ } from '@wordpress/i18n';

import { questions, star } from '../../../utils/icons';
import { getIcon } from '../../../utils/svbIcons';
import Help from '../FieldAttr/Help';

/**
 * @param {Object}  props
 * @param {boolean} props.isRequired  Whether the field is mandatory.
 * @param {Node}    props.labelEl     The rendered label (RichText in the editor).
 * @param {string}  props.help        Help text.
 * @param {Function} props.buttonArea Editor-only duplicate/remove controls.
 * @param {number}  props.index       Field index.
 * @param {string}  props.icon        Optional question icon key (Pro).
 * @param {string}  props.requiredMark How to flag required fields.
 * @param {string}  props.requiredText Wording of the "Required" badge.
 */
const LabelArea = ({ isRequired, labelEl, help, buttonArea, index, icon = '', requiredMark = 'asterisk', requiredText = '' }) => {
	const iconEl = icon ? getIcon(icon) : null;

	return <div className='labelArea'>
		<div className="labelHelp">
			{iconEl && <span className="svbFieldIcon" aria-hidden="true">{iconEl}</span>}

			{labelEl}

			{isRequired && 'asterisk' === requiredMark && <span className="svbRequiredStar">{star}</span>}

			{isRequired && 'badge' === requiredMark && <span className="svbRequiredBadge">
				{requiredText || __('Required', 'survey-form-block')}
			</span>}

			{help && <div className='help'>
				{questions}
				<Help help={help} />
			</div>}
		</div>

		{buttonArea(index)}
	</div>;
};

export default LabelArea;

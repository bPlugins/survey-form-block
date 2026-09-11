import { getBoxValue } from '../../bpl-tools/utils/functions';
import { getBorderCSS, getColorsCSS, getTypoCSS } from '../../bpl-tools/utils/getCSS';
import { getDesignCSS, TEXT_INPUTS } from './utils/designCSS';

const Style = ({ attributes, id, isPremium = false }) => {
	const { fields, labelS, input, radioCheckLabelTypo, radioCheckLabelColor, button, form } = attributes;
	const { bgColor, padding, border, titleTypo, titleColor, titleAlign, titleMargin, descriptionTypo, descriptionColor, descriptionAlign, descriptionMargin, successMsgColor } = form;

	const mainWrapper = `#${id}`;
	const fieldArea = `${mainWrapper} .svbMainArea .fieldItem .fieldArea`;

	// Historically only text/email/textarea/select were styled, which left the
	// number, phone, url and date fields with raw browser chrome. One list now
	// drives every text-like control.
	const inputSelectors = TEXT_INPUTS.map(sel => `${fieldArea} ${sel}`).join(', ');

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', descriptionTypo)?.googleFontLink}
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', button?.Typo)?.googleFontLink}
		${getTypoCSS('', radioCheckLabelTypo)?.googleFontLink}
		${getTypoCSS('', input?.typo)?.googleFontLink}
		${getTypoCSS('', labelS?.typo)?.googleFontLink}

		${getTypoCSS(`${mainWrapper} .svbMainArea .descriptionArea .description`, descriptionTypo)?.styles}
		${getTypoCSS(`${mainWrapper} .svbMainArea .titleArea .title`, titleTypo)?.styles}
		${getTypoCSS(`${mainWrapper} .subBtn`, button?.typo)?.styles}
		${getTypoCSS(`${fieldArea} .field label`, radioCheckLabelTypo)?.styles}
		${getTypoCSS(inputSelectors, input?.typo)?.styles}
		${getTypoCSS(`${mainWrapper} .svbMainArea .fieldItem .labelArea .labelHelp label`, labelS?.typo)?.styles}

		${mainWrapper} form {
			padding:${getBoxValue(padding)};
			background-color:${bgColor};
			${getBorderCSS(border)};
		}

		${mainWrapper} .svbMainArea .titleArea .title {
			color:${titleColor};
			text-align:${titleAlign};
			margin:${getBoxValue(titleMargin)};
		}

		${mainWrapper} .svbMainArea .descriptionArea .description {
			color:${descriptionColor};
			text-align:${descriptionAlign};
			margin:${getBoxValue(descriptionMargin)};
		}

		${mainWrapper} .subBtn {
			${getColorsCSS(button.colors)};
			padding:${getBoxValue(button?.padding)};
		}

		${fieldArea} .field label {
			color:${radioCheckLabelColor};
		}

		${inputSelectors} {
			color:${input?.color};
			padding:${getBoxValue(input?.padding)};
			${getBorderCSS(input?.border)};
		}

		${mainWrapper} .svbMainArea .fieldItem .labelArea .labelHelp label {
			color:${labelS?.color};
		}

		${mainWrapper} .successArea .message {
			color:${successMsgColor};
		}

		${fields.map(({ column, labelPosition }, index) => {
			return `

			${mainWrapper} .labelPosition-${index} {
				flex-direction:${labelPosition};
			}

			${mainWrapper} .fieldArea-${index} {
				grid-template-columns: repeat(${column}, 1fr);
			}

			`;
		}).join(' ')}

		${getDesignCSS(attributes, id, isPremium)}

	`}} />;
};

export default Style;


import { getBoxValue } from '../../bpl-tools/utils/functions';
import { getBorderCSS, getColorsCSS, getTypoCSS } from '../../bpl-tools/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { fields, labelS, input, radioCheckLabelTypo, radioCheckLabelColor, button, form } = attributes;
	const { bgColor, padding, border, titleTypo, titleColor, titleAlign, titleMargin, descriptionTypo, descriptionColor, descriptionAlign, descriptionMargin, successMsgColor } = form;

	const mainWrapper = `#svbMainArea-${clientId}`;
	const fieldArea = `${mainWrapper} .svbMainArea .fieldItem .fieldArea`;
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
		${getTypoCSS(`${fieldArea} select`, input?.typo)?.styles}
		${getTypoCSS(`${fieldArea} textarea`, input?.typo)?.styles}
		${getTypoCSS(`${fieldArea} input[type=email]`, input?.typo)?.styles}
		${getTypoCSS(`${fieldArea} input[type=text]`, input?.typo)?.styles}
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

		${fieldArea} input[type=text], ${fieldArea} input[type=email], ${fieldArea} textarea, ${fieldArea} select {
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
			
			`
		}).join(' ')}
		 
	`}} />;
}
export default Style;
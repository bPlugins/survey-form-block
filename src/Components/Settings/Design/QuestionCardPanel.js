/**
 * Question container designer (Pro).
 *
 * Deliberately compact: background, border, radius, shadow, padding and one
 * hover treatment. Enough to art-direct the card without turning the panel into
 * a wall of sliders.
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalBoxControl as BoxControl } from '@wordpress/components';
import { produce } from 'immer';

import { CARD_HOVERS, DEFAULT_GRADIENT } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { ColorControl, ShadowControl, BtnGroup } from '../../../../../bpl-tools/Components';
import { BorderControl } from '../../../../../bpl-tools/Components/Deprecated';
import { emUnit, pxUnit } from '../../../../../bpl-tools/utils/options';
import GradientField from './GradientField';

const QuestionCardPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { card } = design;

	return (
		<PanelBody
			className="bPlPanelBody svbDesignPanel"
			title={<>{__('Question Card', 'survey-form-block')} <ProTag /></>}
			initialOpen={false}
		>
			<ProGate isPremium={isPremium} onProClick={onProClick}>
				<>
					<ToggleControl
						label={__('Style question containers', 'survey-form-block')}
						help={__('Turns each question into a designed card.', 'survey-form-block')}
						checked={Boolean(card.enable)}
						onChange={val => setSection('card', { enable: val })}
					/>

					{card.enable && <>
						<BtnGroup
							className="mt15"
							label={__('Background', 'survey-form-block')}
							value={card.bgType || 'solid'}
							options={[
								{ value: 'solid', label: __('Solid', 'survey-form-block') },
								{ value: 'gradient', label: __('Gradient', 'survey-form-block') }
							]}
							onChange={val => setSection('card', { bgType: val || 'solid' })}
						/>

						{'gradient' === card.bgType
							? <GradientField
								value={card.gradient || DEFAULT_GRADIENT}
								onChange={val => setSection('card', { gradient: val })}
							/>
							: <ColorControl
								className="mb10 mt10"
								label={__('Colour', 'survey-form-block')}
								value={card.bg}
								onChange={val => setSection('card', { bg: val })}
							/>}

						<BorderControl
							label={__('Border', 'survey-form-block')}
							value={card.border}
							onChange={val => setSection('card', { border: val })}
						/>

						<BoxControl
							label={__('Padding', 'survey-form-block')}
							values={card.padding}
							onChange={val => setSection('card', { padding: val })}
							units={[pxUnit(3), emUnit(2)]}
						/>

						<ShadowControl
							label={__('Shadow', 'survey-form-block')}
							value={card.shadow}
							onChange={val => setSection('card', { shadow: val })}
							produce={produce}
						/>

						<OptionGrid
							label={__('Hover Effect', 'survey-form-block')}
							options={CARD_HOVERS}
							value={card.hoverEffect || 'none'}
							onChange={val => setSection('card', { hoverEffect: val })}
							isPremium={isPremium}
							onProClick={onProClick}
						/>
					</>}
				</>
			</ProGate>
		</PanelBody>
	);
};

export default QuestionCardPanel;

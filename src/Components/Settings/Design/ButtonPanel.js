import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BUTTON_VARIANTS, BUTTON_HOVERS, BUTTON_WIDTHS, ALIGNMENTS, DEFAULT_GRADIENT } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { BtnGroup, ColorsControl } from '../../../../../bpl-tools/Components';
import GradientField from './GradientField';

const ButtonPreview = ({ type }) => (
	<span className={`svbBtnPreview svbBp-${type}`}>Aa</span>
);

const ButtonPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { button } = design;

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Submit Button', 'survey-form-block')} initialOpen={false}>
			<TextControl
				label={__('Button Label', 'survey-form-block')}
				value={button.label || ''}
				placeholder={__('Submit', 'survey-form-block')}
				onChange={val => setSection('button', { label: val })}
			/>

			<OptionGrid
				label={__('Style', 'survey-form-block')}
				options={BUTTON_VARIANTS.map(v => ({ ...v, preview: <ButtonPreview type={v.value} /> }))}
				value={button.variant}
				onChange={val => setSection('button', { variant: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			{'gradient' === button.variant && isPremium && (
				<GradientField
					label={__('Button Gradient', 'survey-form-block')}
					value={button.gradient || DEFAULT_GRADIENT}
					onChange={val => setSection('button', { gradient: val })}
				/>
			)}

			<BtnGroup
				className="mt15"
				label={__('Width', 'survey-form-block')}
				value={button.width || 'full'}
				options={BUTTON_WIDTHS}
				onChange={val => setSection('button', { width: val || 'full' })}
			/>

			{'auto' === button.width && (
				<BtnGroup
					className="mt10"
					label={__('Align', 'survey-form-block')}
					value={button.align || 'left'}
					options={ALIGNMENTS}
					onChange={val => setSection('button', { align: val || 'left' })}
				/>
			)}

			<UnitControl
				className="mt15"
				label={__('Corner Radius', 'survey-form-block')}
				value={button.radius || ''}
				onChange={val => setSection('button', { radius: val })}
				placeholder={__('Inherit', 'survey-form-block')}
				units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: '%', label: '%' }]}
			/>

			<OptionGrid
				label={__('Hover Effect', 'survey-form-block')}
				options={BUTTON_HOVERS}
				value={button.hoverEffect || 'none'}
				onChange={val => setSection('button', { hoverEffect: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			<div className="svbPanelDivider">
				<span>{__('Hover Colours', 'survey-form-block')}</span>
				<ProTag />
			</div>

			<ProGate isPremium={isPremium} onProClick={onProClick}>
				<>
					<ColorsControl
						className="mb10"
						label={__('On Hover', 'survey-form-block')}
						value={button.hoverColors}
						onChange={val => setSection('button', { hoverColors: val })}
					/>

					<RangeControl
						label={__('Transition Speed (ms)', 'survey-form-block')}
						value={parseInt(button.transition) || 250}
						onChange={val => setSection('button', { transition: val })}
						min={0}
						max={1000}
						step={25}
					/>
				</>
			</ProGate>
		</PanelBody>
	);
};

export default ButtonPanel;

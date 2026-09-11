import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { INPUT_STYLES } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { ColorControl } from '../../../../../bpl-tools/Components';

const InputPreview = ({ type }) => (
	<span className={`svbInputPreview svbIp-${type}`}><i /></span>
);

const InputStylePanel = ({ design, setDesign, setSection, isPremium, onProClick }) => {
	const { input } = design;
	const options = INPUT_STYLES.map(o => ({ ...o, preview: <InputPreview type={o.value} /> }));

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Input Style', 'survey-form-block')} initialOpen={false}>
			<OptionGrid
				label={__('Field Appearance', 'survey-form-block')}
				options={options}
				value={design.inputStyle}
				onChange={val => setDesign({ inputStyle: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			<UnitControl
				className="mt15"
				label={__('Corner Radius', 'survey-form-block')}
				value={input.radius || ''}
				onChange={val => setSection('input', { radius: val })}
				placeholder={__('Inherit', 'survey-form-block')}
				units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: '%', label: '%' }]}
			/>

			<ToggleControl
				className="mt10"
				label={__('Visible Focus Ring', 'survey-form-block')}
				help={__('Keeps keyboard navigation obvious. Recommended.', 'survey-form-block')}
				checked={false !== input.focusRing}
				onChange={val => setSection('input', { focusRing: val })}
			/>

			<div className="svbPanelDivider">
				<span>{__('Advanced', 'survey-form-block')}</span>
				<ProTag />
			</div>

			<ProGate isPremium={isPremium} onProClick={onProClick}>
				<>
					<ColorControl
						className="mb10"
						label={__('Field Background', 'survey-form-block')}
						value={input.bg}
						onChange={val => setSection('input', { bg: val })}
					/>

					<ColorControl
						className="mb10"
						label={__('Focus Colour', 'survey-form-block')}
						value={input.focusColor}
						onChange={val => setSection('input', { focusColor: val })}
					/>

					<ColorControl
						className="mb10"
						label={__('Placeholder Colour', 'survey-form-block')}
						value={input.placeholderColor}
						onChange={val => setSection('input', { placeholderColor: val })}
					/>
				</>
			</ProGate>
		</PanelBody>
	);
};

export default InputStylePanel;

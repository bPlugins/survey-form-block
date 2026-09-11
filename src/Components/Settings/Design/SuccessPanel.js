import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';

import { SUCCESS_STYLES, SUCCESS_ANIMATIONS } from '../../../utils/design';
import { SUCCESS_ICON_OPTIONS, getIcon } from '../../../utils/svbIcons';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { ColorControl } from '../../../../../bpl-tools/Components';

const SuccessPanel = ({ design, setSection, form, updateObject, isPremium, onProClick }) => {
	const { success } = design;

	const iconOptions = SUCCESS_ICON_OPTIONS.map(o => ({
		value: o.value,
		label: o.label,
		preview: 'none' === o.value ? <span className="svbIconPreview svbIconNone">—</span> : <span className="svbIconPreview">{getIcon(o.value)}</span>
	}));

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Success State', 'survey-form-block')} initialOpen={false}>
			<TextControl
				label={__('Headline', 'survey-form-block')}
				value={success.title || ''}
				placeholder={__('Optional, e.g. “Thank you!”', 'survey-form-block')}
				onChange={val => setSection('success', { title: val })}
			/>

			<TextControl
				label={__('Message', 'survey-form-block')}
				value={form.successMsg}
				onChange={val => updateObject('form', 'successMsg', val)}
			/>

			<OptionGrid
				label={__('Presentation', 'survey-form-block')}
				options={SUCCESS_STYLES}
				value={success.style}
				onChange={val => setSection('success', { style: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				help={__('“Replace Form” swaps the questions for the thank-you panel on the frontend.', 'survey-form-block')}
			/>

			<OptionGrid
				label={__('Icon', 'survey-form-block')}
				options={iconOptions}
				value={success.icon}
				onChange={val => setSection('success', { icon: val })}
				isPremium={true}
				onProClick={onProClick}
				columns="three"
			/>

			<ColorControl
				className="mb10"
				label={__('Icon Colour', 'survey-form-block')}
				value={success.iconColor}
				onChange={val => setSection('success', { iconColor: val })}
			/>

			<RangeControl
				label={__('Visible For (ms)', 'survey-form-block')}
				value={parseInt(success.duration) || 2000}
				onChange={val => setSection('success', { duration: val })}
				min={1000}
				max={15000}
				step={500}
			/>

			<div className="svbPanelDivider">
				<span>{__('Motion & Surface', 'survey-form-block')}</span>
				{!isPremium && <ProTag />}
			</div>

			<OptionGrid
				label={__('Animation', 'survey-form-block')}
				options={SUCCESS_ANIMATIONS}
				value={success.animation}
				onChange={val => setSection('success', { animation: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			<ProGate isPremium={isPremium} onProClick={onProClick}>
				<ColorControl
					className="mb10"
					label={__('Panel Background', 'survey-form-block')}
					value={success.bg}
					onChange={val => setSection('success', { bg: val })}
				/>
			</ProGate>
		</PanelBody>
	);
};

export default SuccessPanel;

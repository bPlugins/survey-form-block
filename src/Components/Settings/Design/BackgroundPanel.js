/**
 * Backdrop behind the form (Pro).
 *
 * Distinct from the form's own background colour in the Style tab: this paints
 * the area *around* the survey so a gradient or photo can frame it.
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';

import { DEFAULT_GRADIENT } from '../../../utils/design';
import { ProGate, ProTag } from './Shared';
import { BtnGroup, ColorControl, InlineMediaUpload } from '../../../../../bpl-tools/Components';
import GradientField from './GradientField';

const BackgroundPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { background: bg } = design;

	return (
		<PanelBody
			className="bPlPanelBody svbDesignPanel"
			title={<>{__('Survey Backdrop', 'survey-form-block')} <ProTag /></>}
			initialOpen={false}
		>
			<ProGate isPremium={isPremium} onProClick={onProClick}>
				<>
					<ToggleControl
						label={__('Enable backdrop', 'survey-form-block')}
						help={__('Paints the area around the survey card.', 'survey-form-block')}
						checked={Boolean(bg.enable)}
						onChange={val => setSection('background', { enable: val })}
					/>

					{bg.enable && <>
						<BtnGroup
							className="mt15"
							label={__('Type', 'survey-form-block')}
							value={bg.type || 'solid'}
							options={[
								{ value: 'solid', label: __('Solid', 'survey-form-block') },
								{ value: 'gradient', label: __('Gradient', 'survey-form-block') },
								{ value: 'image', label: __('Image', 'survey-form-block') }
							]}
							onChange={val => setSection('background', { type: val || 'solid' })}
						/>

						{'solid' === bg.type && (
							<ColorControl
								className="mb10 mt10"
								label={__('Colour', 'survey-form-block')}
								value={bg.color}
								onChange={val => setSection('background', { color: val })}
							/>
						)}

						{'gradient' === bg.type && (
							<GradientField
								value={bg.gradient || DEFAULT_GRADIENT}
								onChange={val => setSection('background', { gradient: val })}
							/>
						)}

						{'image' === bg.type && <>
							<InlineMediaUpload
								className="mt10"
								label={__('Image', 'survey-form-block')}
								value={bg.image?.url || ''}
								types={['image']}
								onChange={url => setSection('background', { image: { url } })}
							/>

							<SelectControl
								className="mt10"
								label={__('Size', 'survey-form-block')}
								value={bg.size || 'cover'}
								options={[
									{ label: __('Cover', 'survey-form-block'), value: 'cover' },
									{ label: __('Contain', 'survey-form-block'), value: 'contain' },
									{ label: __('Auto', 'survey-form-block'), value: 'auto' }
								]}
								onChange={val => setSection('background', { size: val })}
							/>

							<SelectControl
								label={__('Position', 'survey-form-block')}
								value={bg.position || 'center center'}
								options={[
									{ label: __('Center', 'survey-form-block'), value: 'center center' },
									{ label: __('Top', 'survey-form-block'), value: 'center top' },
									{ label: __('Bottom', 'survey-form-block'), value: 'center bottom' },
									{ label: __('Left', 'survey-form-block'), value: 'left center' },
									{ label: __('Right', 'survey-form-block'), value: 'right center' }
								]}
								onChange={val => setSection('background', { position: val })}
							/>

							<ColorControl
								className="mb10"
								label={__('Readability Overlay', 'survey-form-block')}
								value={bg.overlayColor}
								onChange={val => setSection('background', { overlayColor: val })}
							/>
						</>}

						<RangeControl
							className="mt10"
							label={__('Glass Blur', 'survey-form-block')}
							help={__('Frosts the form over the backdrop. 0 disables it.', 'survey-form-block')}
							value={parseInt(bg.blur) || 0}
							onChange={val => setSection('background', { blur: val })}
							min={0}
							max={30}
						/>
					</>}
				</>
			</ProGate>
		</PanelBody>
	);
};

export default BackgroundPanel;

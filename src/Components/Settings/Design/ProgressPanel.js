/**
 * Completion progress indicator.
 *
 * Presentation only - it visualises how many questions already hold an answer.
 * No pagination or multi-step logic is introduced.
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { PROGRESS_STYLES, PROGRESS_POSITIONS, DEFAULT_GRADIENT } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { BtnGroup, ColorControl } from '../../../../../bpl-tools/Components';
import GradientField from './GradientField';

const ProgressPreview = ({ type }) => (
	<span className={`svbProgPreview svbPp-${type}`}><i /><i /><i /></span>
);

const ProgressPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { progress } = design;

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Progress Indicator', 'survey-form-block')} initialOpen={false}>
			<ToggleControl
				label={__('Show completion progress', 'survey-form-block')}
				help={__('Reflects how many questions have been answered.', 'survey-form-block')}
				checked={Boolean(progress.enable)}
				onChange={val => setSection('progress', { enable: val })}
			/>

			{progress.enable && <>
				<OptionGrid
					label={__('Style', 'survey-form-block')}
					options={PROGRESS_STYLES.map(p => ({ ...p, preview: <ProgressPreview type={p.value} /> }))}
					value={progress.style}
					onChange={val => setSection('progress', { style: val })}
					isPremium={isPremium}
					onProClick={onProClick}
					columns="three"
				/>

				<BtnGroup
					className="mt15"
					label={__('Position', 'survey-form-block')}
					value={progress.position || 'top'}
					options={PROGRESS_POSITIONS}
					onChange={val => setSection('progress', { position: val || 'top' })}
				/>

				<ToggleControl
					className="mt10"
					label={__('Show counter', 'survey-form-block')}
					checked={false !== progress.showLabel}
					onChange={val => setSection('progress', { showLabel: val })}
				/>

				<div className="svbPanelDivider">
					<span>{__('Progress Colours', 'survey-form-block')}</span>
					{!isPremium && <ProTag />}
				</div>

				<ProGate isPremium={isPremium} onProClick={onProClick}>
					<>
						{'gradient' === progress.style
							? <GradientField
								label={__('Fill Gradient', 'survey-form-block')}
								value={progress.gradient || DEFAULT_GRADIENT}
								onChange={val => setSection('progress', { gradient: val })}
							/>
							: <ColorControl
								className="mb10"
								label={__('Fill', 'survey-form-block')}
								value={progress.color}
								onChange={val => setSection('progress', { color: val })}
							/>}

						<ColorControl
							className="mb10"
							label={__('Track', 'survey-form-block')}
							value={progress.trackColor}
							onChange={val => setSection('progress', { trackColor: val })}
						/>

						<UnitControl
							label={__('Thickness', 'survey-form-block')}
							value={progress.height || '6px'}
							onChange={val => setSection('progress', { height: val })}
							units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }]}
						/>
					</>
				</ProGate>
			</>}
		</PanelBody>
	);
};

export default ProgressPanel;

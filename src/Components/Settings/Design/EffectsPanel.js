import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, Notice } from '@wordpress/components';

import { ANIMATIONS } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';

const EffectsPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { animation } = design;

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Effects & Motion', 'survey-form-block')} initialOpen={false}>
			<OptionGrid
				label={__('Question Entrance', 'survey-form-block')}
				options={ANIMATIONS}
				value={animation.type}
				onChange={val => setSection('animation', { type: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			{'none' !== animation.type && <>
				<div className="svbPanelDivider">
					<span>{__('Timing', 'survey-form-block')}</span>
					{!isPremium && <ProTag />}
				</div>

				<ProGate isPremium={isPremium} onProClick={onProClick}>
					<>
						<RangeControl
							label={__('Duration (ms)', 'survey-form-block')}
							value={parseInt(animation.duration) || 500}
							onChange={val => setSection('animation', { duration: val })}
							min={100}
							max={2000}
							step={50}
						/>

						<RangeControl
							label={__('Stagger Between Questions (ms)', 'survey-form-block')}
							value={parseInt(animation.stagger) || 0}
							onChange={val => setSection('animation', { stagger: val })}
							min={0}
							max={300}
							step={10}
						/>
					</>
				</ProGate>
			</>}

			<Notice status="info" isDismissible={false} className="svbInlineNotice">
				{__('Animations are automatically disabled for visitors who prefer reduced motion.', 'survey-form-block')}
			</Notice>
		</PanelBody>
	);
};

export default EffectsPanel;

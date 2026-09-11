import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { LAYOUTS } from '../../../utils/design';
import { OptionGrid } from './Shared';
import { BDevice } from '../../../../../bpl-tools/Components/Deprecated';

/** Tiny wireframe drawn for each layout so the choice reads at a glance. */
const LayoutPreview = ({ type }) => (
	<span className={`svbLayoutPreview svbLp-${type}`}>
		<i /><i /><i />
	</span>
);

const UNITS = [{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }];

const LayoutPanel = ({ design, setDesign, setSection, isPremium, onProClick, device, setDevice }) => {
	const options = LAYOUTS.map(l => ({ ...l, preview: <LayoutPreview type={l.value} /> }));

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Layout', 'survey-form-block')} initialOpen={false}>
			<OptionGrid
				label={__('Survey Layout', 'survey-form-block')}
				options={options}
				value={design.layout}
				onChange={val => setDesign({ layout: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			<div className="svbDeviceRow">
				<span className="svbDeviceRowLabel">{__('Question Spacing', 'survey-form-block')}</span>
				<BDevice device={device} onChange={setDevice} />
			</div>

			<UnitControl
				value={design.gap?.[device] || ''}
				onChange={val => setSection('gap', { [device]: val })}
				placeholder={__('16px', 'survey-form-block')}
				units={UNITS}
			/>

			<UnitControl
				className="mt15"
				label={__('Max Width', 'survey-form-block')}
				value={design.maxWidth || ''}
				onChange={val => setDesign({ maxWidth: val })}
				placeholder={__('Full width', 'survey-form-block')}
				units={[{ value: 'px', label: 'px' }, { value: '%', label: '%' }, { value: 'rem', label: 'rem' }]}
			/>

			<RangeControl
				className="mt15"
				label={__('Stack Columns Below', 'survey-form-block')}
				help={__('Screen width at which multi-column questions become full width.', 'survey-form-block')}
				value={parseInt(design.stackBreakpoint) || 768}
				onChange={val => setDesign({ stackBreakpoint: val })}
				min={320}
				max={1200}
				step={4}
			/>
		</PanelBody>
	);
};

export default LayoutPanel;

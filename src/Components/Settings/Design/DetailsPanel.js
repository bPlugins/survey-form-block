/**
 * Small visual details: how required fields are flagged, and how section
 * dividers are drawn.
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalUnitControl as UnitControl, TextControl } from '@wordpress/components';

import { REQUIRED_MARKS, DIVIDER_STYLES } from '../../../utils/design';
import { OptionGrid, ProGate, ProTag } from './Shared';
import { ColorControl } from '../../../../../bpl-tools/Components';

const DetailsPanel = ({ design, setSection, isPremium, onProClick }) => {
	const { divider, label } = design;

	return (
		<PanelBody className="bPlPanelBody svbDesignPanel" title={__('Labels & Dividers', 'survey-form-block')} initialOpen={false}>
			<OptionGrid
				label={__('Required Field Marker', 'survey-form-block')}
				options={REQUIRED_MARKS}
				value={label.requiredMark || 'asterisk'}
				onChange={val => setSection('label', { requiredMark: val })}
				isPremium={true}
				onProClick={onProClick}
				columns="three"
			/>

			{'badge' === (label.requiredMark || 'asterisk') && <TextControl
				label={__('Required Badge Text', 'survey-form-block')}
				value={label.requiredText ?? ''}
				placeholder={__('Required', 'survey-form-block')}
				help={__('Shown beside the label of every required question.', 'survey-form-block')}
				onChange={val => setSection('label', { requiredText: val })}
			/>}

			{'none' !== (label.requiredMark || 'asterisk') && <ColorControl
				className="mb10"
				label={__('Required Marker Colour', 'survey-form-block')}
				value={label.requiredColor}
				onChange={val => setSection('label', { requiredColor: val })}
			/>}

			<ColorControl
				className="mb10"
				label={__('Help Icon Colour', 'survey-form-block')}
				value={label.helpColor}
				onChange={val => setSection('label', { helpColor: val })}
			/>

			<div className="svbPanelDivider"><span>{__('Section Divider', 'survey-form-block')}</span></div>

			<OptionGrid
				label={__('Line Style', 'survey-form-block')}
				options={DIVIDER_STYLES}
				value={divider.style || 'solid'}
				onChange={val => setSection('divider', { style: val })}
				isPremium={isPremium}
				onProClick={onProClick}
				columns="three"
			/>

			<ColorControl
				className="mb10"
				label={__('Line Colour', 'survey-form-block')}
				value={divider.color}
				onChange={val => setSection('divider', { color: val })}
			/>

			<UnitControl
				label={__('Line Thickness', 'survey-form-block')}
				value={divider.thickness || '2px'}
				onChange={val => setSection('divider', { thickness: val })}
				units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }]}
			/>

			<ColorControl
				className="mb10 mt15"
				label={__('Section Heading Colour', 'survey-form-block')}
				value={divider.headingColor}
				onChange={val => setSection('divider', { headingColor: val })}
			/>

			<ColorControl
				className="mb10"
				label={__('Section Description Colour', 'survey-form-block')}
				value={divider.descriptionColor}
				onChange={val => setSection('divider', { descriptionColor: val })}
			/>

			<div className="svbPanelDivider">
				<span>{__('Question Icons', 'survey-form-block')}</span>
				{!isPremium && <ProTag />}
			</div>

			<ProGate isPremium={isPremium} onProClick={onProClick} label={__('Pro', 'survey-form-block')}>
				<p className="svbControlHelp">
					{__('Pick an icon per question in the General tab → Fields panel.', 'survey-form-block')}
				</p>
			</ProGate>
		</PanelBody>
	);
};

export default DetailsPanel;

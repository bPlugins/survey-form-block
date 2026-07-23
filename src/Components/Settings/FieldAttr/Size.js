

import { PanelRow, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Label } from '../../../../../bpl-tools/Components';

const Size = ({ value, onChange }) => {
    return <PanelRow>
        <Label htmlFor="size" className=''>{__('Size:', 'survey-form-block')}</Label>

        <SelectControl id='size' value={value} onChange={val => onChange(Number(val))} options={[
            { label: __('Full Width (100%)', 'survey-form-block'), value: 100 },
            { label: __('Two Thirds (66%)', 'survey-form-block'), value: 66 },
            { label: __('Half Width (50%)', 'survey-form-block'), value: 50 },
            { label: __('One Third (33%)', 'survey-form-block'), value: 33 },
            { label: __('One Fourth (25%)', 'survey-form-block'), value: 25 },
        ]} />
    </PanelRow>
}
export default Size;
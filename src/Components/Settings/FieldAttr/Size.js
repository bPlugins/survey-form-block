

import { PanelRow, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Label } from '../../../../../bpl-tools/Components';

const Size = ({ value, onChange }) => {
    return <PanelRow>
        <Label htmlFor="size" className=''>{__('Size:', 'survey-form-block')}</Label>

        <SelectControl id='size' value={value} onChange={val => onChange(val)} options={[
            { label: __('Full', 'survey-form-block'), value: 100 },
            { label: __('Half', 'survey-form-block'), value: 50 },
            { label: __('One Third', 'survey-form-block'), value: 33 }
        ]} />
    </PanelRow>
}
export default Size;
import { __ } from '@wordpress/i18n';



export const titleAlignOpt = [
	{ label: __('Left', 'survey-form-block'), value: 'left' },
	{ label: __('Center', 'survey-form-block'), value: 'center' },
	{ label: __('Right', 'survey-form-block'), value: 'right' }
]

export const LabelPositionOpt = [
	{ label: __('Top', 'survey-form-block'), value: 'column' },
	{ label: __('Left', 'survey-form-block'), value: 'row' },
]

export const fieldTypeOpt = [
	{ label: __('Text', 'survey-form-block'), value: 'text' },
	{ label: __('Paragraph', 'survey-form-block'), value: 'paragraph' },
	{ label: __('Checkbox', 'survey-form-block'), value: 'checkbox' },
	{ label: __('Radio Buttons', 'survey-form-block'), value: 'radio' },
	{ label: __('Email', 'survey-form-block'), value: 'email' },
	{ label: __('Dropdown', 'survey-form-block'), value: 'select' },
	{ label: __('Date', 'survey-form-block'), value: 'date' },
]

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'survey-form-block') },
	{ name: 'style', title: __('Style', 'survey-form-block') }
];

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
	// General Fields
	{ label: __('Text (Single Line)', 'survey-form-block'), value: 'text' },
	{ label: __('Paragraph (Multi Line)', 'survey-form-block'), value: 'paragraph' },
	{ label: __('Email', 'survey-form-block'), value: 'email' },
	{ label: __('Number', 'survey-form-block'), value: 'number' },
	{ label: __('Phone', 'survey-form-block'), value: 'phone' },
	{ label: __('Website / URL', 'survey-form-block'), value: 'url' },
	// Choice & Selection
	{ label: __('Checkbox Group', 'survey-form-block'), value: 'checkbox' },
	{ label: __('Radio Buttons', 'survey-form-block'), value: 'radio' },
	{ label: __('Dropdown Menu', 'survey-form-block'), value: 'select' },
	{ label: __('Switch / Toggle', 'survey-form-block'), value: 'toggle' },
	// Survey & Feedback Fields
	{ label: __('Star Rating', 'survey-form-block'), value: 'star_rating' },
	{ label: __('Opinion Scale (1-10)', 'survey-form-block'), value: 'opinion_scale' },
	{ label: __('NPS (Net Promoter Score)', 'survey-form-block'), value: 'nps' },
	{ label: __('Range Slider', 'survey-form-block'), value: 'range_slider' },
	// Date & Structural
	{ label: __('Date Picker', 'survey-form-block'), value: 'date' },
	{ label: __('Section Divider Header', 'survey-form-block'), value: 'section' },
]

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'survey-form-block') },
	{ name: 'style', title: __('Style', 'survey-form-block') }
];

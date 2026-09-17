import { gutenbergTabIcon } from './icon';

const slug = 'survey-form-block';

/**
 * Freemius identifiers for this product.
 * plan_id 57870 is the "Pro" plan of product 35195.
 */
const FREEMIUS = {
	product_id: 35195,
	plan_id: 57870,
	public_key: 'pk_660660b3d70119a9c86194b0854c1'
};

export const dashboardInfo = (info) => {
	const { version, isPremium, hasPro, licenseActiveNonce, adminUrl } = info;

	const proSuffix = isPremium ? ' Pro' : '';

	return {
		name: `Survey Form Block${proSuffix}`,
		displayName: `Survey Form Block${proSuffix} — Beautiful Gutenberg Surveys & Forms`,
		description:
			'Build surveys, feedback forms and lead-capture forms directly in the block editor, then art-direct them with themes, layouts, input styles, motion and progress indicators — no CSS required.',
		slug,
		version,
		isPremium,
		hasPro,
		adminUrl,
		displayOurPlugins: true,
		media: {
			logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
			banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
			thumbnail: `https://ps.w.org/${slug}/assets/banner-772x250.png`
		},
		// Only links that actually resolve today. The product landing and docs
		// pages are not published yet, so they are deliberately absent rather
		// than shipped as dead links (both are optional in the components).
		pages: {
			org: `https://wordpress.org/plugins/${slug}/`
		},
		freemius: FREEMIUS,
		licenseActiveNonce,

		startButton: {
			label: 'Create a Survey',
			url: 'post-new.php?post_type=survey-form-block'
		}
	};
};

/**
 * Live demos shown on the Demos tab.
 *
 * Empty for now: no survey-form-block demo pages are published on
 * bblockswp.com yet, and the tab hides itself rather than shipping links that
 * 404. Add entries here and it appears on its own.
 *
 * Shape, matching the sibling offcanvas-block plugin:
 *   { icon, title, description, category, type: 'iframe', url }
 */
export const demoInfo = {
	allInOneLabel: 'View All Live Demos',
	allInOneLink: '/survey-demos/',
	demos: [
		{
			icon: '',
			title: 'Customer Satisfaction & NPS',
			description: 'Measure CSAT and NPS scores with interactive 5-star ratings, NPS 0-10 scale, and multi-select tags.',
			category: 'Feedback & Evaluation',
			type: 'iframe',
			url: '/customer-satisfaction-survey/',
		},
		{
			icon: '',
			title: 'Product Feedback & Roadmap',
			description: 'Collect feature requests and roadmap feedback with 1-10 opinion scale, range slider, and beta tester opt-in.',
			category: 'Product Management',
			type: 'iframe',
			url: '/product-feedback-survey/',
		},
		{
			icon: '',
			title: 'Event & Conference Registration',
			description: 'Multi-section registration with attendee details, attendance format, session tracks, and arrival date.',
			category: 'Events & Community',
			type: 'iframe',
			url: '/event-registration-survey/',
		},
		{
			icon: '',
			title: 'Job Application & Candidate Screening',
			description: 'Engineering job application with portfolio URLs, years experience, technical proficiency scale, and work authorization.',
			category: 'Hiring & Recruiting',
			type: 'iframe',
			url: '/job-application-survey/',
		},
		{
			icon: '',
			title: 'Website Usability & Bug Tracker',
			description: 'Bug reporting tool with page URL capture, issue category, urgency selector, and reproduction steps.',
			category: 'QA & Support',
			type: 'iframe',
			url: '/website-bug-report-survey/',
		},
		{
			icon: '',
			title: 'Employee Onboarding & Pulse Check',
			description: '30-day new hire pulse check evaluating tooling access, team mentorship, and role clarity.',
			category: 'Internal Culture',
			type: 'iframe',
			url: '/employee-onboarding-survey/',
		},
	],
};
export const pricingInfo = {
	logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
	pluginId: FREEMIUS.product_id,
	planId: FREEMIUS.plan_id,
	licenses: [1, 3, null],
	button: {
		label: 'Buy Now ➜'
	},
	featured: {
		selected: 3,
		text: 'Best Value'
	}
};

export const welcomeInfo = (adminUrl) => ({
	keywords: ['Themes & Presets', 'Layouts', 'Input Styles', 'Motion & Progress'],
	keywordsLabel: 'Design',
	gettingStarted: {
		tabs: [
			{
				key: 'gutenberg',
				label: 'Gutenberg',
				icon: gutenbergTabIcon,
				steps: [
					{
						num: 1,
						title: 'Add the block',
						body: 'Open any page or post, click <strong>+</strong> and search for <strong>Survey Form Block</strong>. The inserter also offers ready-styled variations such as <strong>Modern Minimal</strong> and <strong>Soft Card</strong>.',
						link: { url: `${adminUrl}post-new.php?post_type=page`, label: 'Open Editor' }
					},
					{
						num: 2,
						title: 'Build your questions',
						body: 'Use the <strong>General</strong> tab to add fields — text, email, rating, NPS, opinion scale, slider, dropdown and more — and to reorder them.'
					},
					{
						num: 3,
						title: 'Pick a look',
						body: 'Open the <strong>Design</strong> tab and choose a theme. Layout, input style, buttons, motion and the progress indicator all live there.'
					},
					{
						num: 4,
						title: 'Publish & collect',
						body: 'Publish the page. Responses appear under <strong>Survey Forms → Survey List</strong>.',
						link: { url: `${adminUrl}admin.php?page=survey-form-block`, label: 'View Responses' }
					}
				]
			}
		]
	},
	changelogs: [
		{
			version: '1.1.0',
			type: 'update',
			list: [
				'New: Design tab in the block inspector, grouping Theme, Layout, Question Card, Input Style, Button, Progress, Effects, Backdrop, Success State and Labels & Dividers.',
				'New: 11 survey themes — Classic, Modern Minimal, Soft Card and Clean Professional are free; Glassmorphism, Bold Gradient, Midnight Dark, Elegant, Neumorphic, Sunset Warm and Ocean Cool are Pro.',
				'New: Six survey layouts — Classic, Card and Minimal (free) plus Floating, Split and Full Width (Pro).',
				'New: Six input styles — Classic and Outlined (free) plus Filled, Underline, Rounded and Floating Label (Pro).',
				'New: Button design system with Classic, Filled and Outline (free) plus Gradient, Soft and Minimal (Pro), including width, alignment, radius and hover effects.',
				'New: Completion progress indicator with Linear (free) plus Gradient, Segmented, Circular and Step Dots (Pro).',
				'New: Entrance animations with stagger control, automatically disabled for visitors who prefer reduced motion.',
				'New: Redesigned success state with icons, headline, card/banner presentations and animation.',
				'New: Question icons, section divider styles and required-field marker options.',
				'New: Survey backdrop with gradient, image, overlay and glass blur (Pro).',
				'New: Block variations so the inserter offers ready-styled surveys.',
				'Fixed: Radio groups now get a unique name — two radio questions, or two surveys on one page, no longer share a selection.',
				'Fixed: Number, phone, URL and date fields now inherit the same styling as text fields instead of raw browser chrome.',
				'Fixed: Inputs now have a visible focus ring; the old rule removed the outline without replacing it.',
				'Fixed: Help tooltips no longer push a horizontal scrollbar onto narrow screens.',
				'Fixed: Multi-column rows now pack from the start with a real gutter instead of spreading to the edges, and fields in a row align to the top.',
				'Fixed: "Add New Field" no longer submits the form in the editor.',
				'Improved: Star rating redrawn as a crisp SVG with hover preview and keyboard focus states.',
				'Improved: Unanswered required fields are highlighted individually after a failed submit.'
			]
		},
		{
			version: '1.0.2 – 8 April 2026',
			type: 'fix',
			list: ['Wordfence problem has been solved.']
		},
		{
			version: '1.0.1 – 25 April 2025',
			type: 'update',
			list: ['Compatible with WordPress 6.8.']
		},
		{
			version: '1.0.0 – 13 January 2025',
			type: 'update',
			list: ['Initial release.']
		}
	],
	proFeatures: [
		'7 premium themes: Glassmorphism, Bold Gradient, Midnight Dark, Elegant, Neumorphic, Sunset Warm, Ocean Cool',
		'Floating, Split and Full-Width survey layouts',
		'Question card designer — background or gradient, border, radius, shadow, padding and hover states',
		'Filled, Underline, Rounded and Floating Label input styles',
		'Focus colour, field background and placeholder colour controls',
		'Gradient, Soft and Minimal button styles with lift, scale, glow and slide-fill hovers',
		'Entrance animations with duration and stagger control',
		'Gradient, Segmented, Circular and Step-Dot progress indicators',
		'Survey backdrop: gradient, image, readability overlay and glass blur',
		'Banner and full-replace success states with pop, scale and slide animations',
		'Question icons and decorative divider styles'
	]
});




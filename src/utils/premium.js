/**
 * Premium detection.
 *
 * PHP injects `svbIsPremium` and `svbPricingUrl` before the editor and view
 * scripts run (see `inc/Pro.php`). The globals may be absent when the block is
 * rendered outside the plugin bootstrap (unit tests, block previews), so every
 * read is defensive and defaults to the free experience.
 */

/* global svbIsPremium, svbPricingUrl */

export const isPremium = () => {
	try {
		if ('undefined' !== typeof svbIsPremium) {
			return Boolean(svbIsPremium);
		}
	} catch (e) {
		// `typeof` on an undeclared identifier is safe, but keep the guard for
		// bundlers that rewrite the reference.
	}

	return Boolean(window?.svbIsPremium);
};

export const PRICING_URL = 'https://bplugins.com/products/survey-form-block';

export const getPricingUrl = () => {
	try {
		if ('undefined' !== typeof svbPricingUrl && svbPricingUrl) {
			return svbPricingUrl;
		}
	} catch (e) {
		// Fall through to the public product page.
	}

	return window?.svbPricingUrl || PRICING_URL;
};

export const PRO_FEATURES = [
	'7 extra premium themes (Glass, Dark, Gradient…)',
	'Floating, Split & Full-Width layouts',
	'Question card designer with hover states',
	'Filled, Underline, Rounded & Floating inputs',
	'Gradient / Soft / Minimal button system',
	'Entrance animations with stagger control'
];

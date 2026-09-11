<?php
/**
 * Premium gate for Survey Form Block.
 *
 * One source of truth for "may the premium design tools run", backed by Freemius
 * (`bpsvb_fs()`), plus the plumbing that publishes that flag to the editor and to
 * the frontend renderer.
 *
 * The design system degrades rather than breaks: attributes saved while Pro was
 * active are preserved verbatim, and `resolveDesign()` on the JS side falls each
 * Pro-only value back to its closest free equivalent.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'BPSVB_Pro' ) ) {
	/**
	 * BPSVB_Pro class.
	 */
	class BPSVB_Pro {

		/**
		 * Public product page, used as the upgrade destination in the editor.
		 */
		const PRICING_URL = 'https://bplugins.com/products/survey-form-block';

		public function __construct() {
			// Runs late so the block's generated script handles already exist.
			add_action( 'enqueue_block_assets', [ $this, 'injectPremiumFlag' ], 20 );
		}

		/**
		 * Whether the premium feature set may be used.
		 *
		 * @return bool
		 */
		public static function isPremium() {
			$isPremium = false;

			if ( defined( 'BPSVB_HAS_PRO' ) && BPSVB_HAS_PRO && function_exists( 'bpsvb_fs' ) && bpsvb_fs() ) {
				$isPremium = (bool) bpsvb_fs()->can_use_premium_code();
			}

			/**
			 * Final say on whether the premium design tools may run.
			 *
			 * Filtered in both directions on purpose: a bundle can unlock Pro
			 * without the premium SDK, and a developer with the premium SDK
			 * vendored locally can force the free experience to check it.
			 *
			 * @param bool $isPremium
			 */
			return (bool) apply_filters( 'svb_is_premium', $isPremium );
		}

		/**
		 * URL the editor's "Get Pro" buttons point at.
		 *
		 * @return string
		 */
		public static function pricingUrl() {
			$url = self::PRICING_URL;

			if ( defined( 'BPSVB_DASHBOARD_SLUG' ) && ! self::isPremium() ) {
				$url = admin_url( 'admin.php?page=' . BPSVB_DASHBOARD_SLUG . '#/pricing' );
			}

			return (string) apply_filters( 'svb_pricing_url', $url );
		}

		/**
		 * Publishes the premium flag to the editor and the frontend renderer.
		 *
		 * The frontend needs it too: `view.js` re-renders the survey with React and
		 * has to know whether Pro-only styling may be applied.
		 *
		 * @return void
		 */
		public function injectPremiumFlag() {
			$data = sprintf(
				'var svbIsPremium = %s; var svbPricingUrl = %s;',
				wp_json_encode( self::isPremium() ),
				wp_json_encode( self::pricingUrl() )
			);

			foreach ( [ 'svb-survey-block-view-script', 'svb-survey-block-editor-script' ] as $handle ) {
				if ( wp_script_is( $handle, 'registered' ) ) {
					wp_add_inline_script( $handle, $data, 'before' );
				}
			}
		}
	}

	new BPSVB_Pro();
}

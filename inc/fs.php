<?php
/**
 * Freemius bootstrap.
 *
 * Follows the same shape as the other bPlugins products: the premium build ships
 * `vendor/freemius`, the wp.org build ships `vendor/freemius-lite`, and the same
 * configuration array drives both.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'bpsvb_fs' ) ) {
	/**
	 * Freemius SDK accessor.
	 *
	 * @return Freemius|null Null when neither SDK is present (e.g. a source
	 *                       checkout without vendor/), so the plugin still boots.
	 */
	function bpsvb_fs() {
		global $bpsvb_fs;

		if ( ! isset( $bpsvb_fs ) ) {
			$fsPath     = BPSVB_PATH . 'vendor/freemius/start.php';
			$fsLitePath = BPSVB_PATH . 'vendor/freemius-lite/start.php';

			if ( BPSVB_HAS_PRO ) {
				require_once $fsPath;
			} elseif ( file_exists( $fsLitePath ) ) {
				require_once $fsLitePath;
			} else {
				return null;
			}

			$config = [
				'id'                  => '35195',
				'slug'                => 'survey-form-block',
				'premium_slug'        => 'survey-form-block-pro',
				'type'                => 'plugin',
				'public_key'          => 'pk_660660b3d70119a9c86194b0854c1',
				'is_premium'          => true,
				'premium_suffix'      => 'Pro',
				// If your plugin is a serviceware, set this option to false.
				'has_premium_version' => true,
				'has_addons'          => false,
				'has_paid_plans'      => true,
				'is_org_compliant'    => true,
				// Automatically removed in the free version. If you're not using the
				// auto-generated free version, delete this line before uploading to wp.org.
				'wp_org_gatekeeper'   => 'OA7#BoRiBNqdf52FvzEf!!074aRLPs8fspif$7K1#4u4Csys1fQlCecVcUTOs2mcpeVHi#C2j9d09fOTvbC0HloPT7fFee5WdS3G',
				'trial'               => [
					'days'               => 7,
					'is_require_payment' => true,
				],
				'menu'                => [
					'slug'       => BPSVB_MENU_SLUG,
					'first-path' => 'admin.php?page=' . BPSVB_DASHBOARD_SLUG . '#/welcome',
					'contact'    => false,
					'support'    => false,
				],
			];

			$bpsvb_fs = ( BPSVB_HAS_PRO && function_exists( 'fs_dynamic_init' ) )
				? fs_dynamic_init( $config )
				: fs_lite_dynamic_init( $config );
		}

		return $bpsvb_fs;
	}

	// Init Freemius.
	bpsvb_fs();
	// Signal that SDK was initiated.
	do_action( 'bpsvb_fs_loaded' );
}

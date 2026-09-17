<?php
/**
 * Plugin Name: Survey Form Block
 * Description: Create custom survey forms easily with the Survey Form Block plugin.
 * Version: 1.1.0
 * Author: bPlugins
 * Author URI: http://bplugins.com
 * Plugin URI: https://bplugins.com/products/survey-form-block
 * Requires at least: 6.5
 * Requires PHP: 7.1
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: survey-form-block
 * @fs_premium_only /vendor/freemius, /includes/LicenseActivation.php
 * @fs_free_only /vendor/freemius-lite
 */

// ABS PATH
if (!defined('ABSPATH')) {exit;}

if ( function_exists( 'bpsvb_fs' ) ) {
    // A second copy of the plugin (free + premium) is present; hand this file to
    // the already-booted SDK instead of initialising twice.
    if ( bpsvb_fs() ) {
        bpsvb_fs()->set_basename( true, __FILE__ );
    }
} else {
    // Constant
    define( 'BPSVB_PLUGIN_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.1.0' );
    define( 'BPSVB_PLUGIN_FILE', __FILE__ );
    define( 'BPSVB_DIR', plugin_dir_url( __FILE__ ) );
    define( 'BPSVB_PATH', plugin_dir_path( __FILE__ ) );
    define( 'BPSVB_ASSETS_DIR', plugin_dir_url( __FILE__ ) . 'assets/' );
    define( 'BPSVB_HAS_PRO', file_exists( plugin_dir_path( __FILE__ ) . 'vendor/freemius/start.php' ) );

    // Admin menu slugs, shared with the Freemius menu configuration.
    //
    // The Surveys post type is the plugin's top-level menu, and everything else
    // hangs off it. Freemius is told the same, so its opt-in screen and its
    // Account page land in the same place - see the Freemius config below.
    define( 'BPSVB_CPT_SLUG', 'survey-form-block' );
    define( 'BPSVB_MENU_SLUG', 'survey-form-block' );
    define( 'BPSVB_DASHBOARD_SLUG', 'survey-form-block-dashboard' );
    define( 'BPSVB_MENU_PARENT', 'edit.php?post_type=' . BPSVB_CPT_SLUG );

    if ( ! function_exists( 'bpsvb_fs' ) ) {
        /**
         * Freemius SDK accessor.
         *
         * Defined here rather than in an included file on purpose: the SDK
         * identifies its plugin from the backtrace of the fs_dynamic_init()
         * call, so calling it from includes/ makes it believe the plugin lives
         * in that subdirectory, and every admin URL it builds afterwards is
         * wrong. Keep this in the main plugin file.
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
                    // A CPT menu, because that is what the plugin registers. Given
                    // a plain page slug the SDK builds its post-opt-in URLs against
                    // a top-level page that does not exist.
                    //
                    // first-path is where Allow & Continue and Skip both end up, on
                    // the free plan and the paid one alike: the Demo & Help screen.
                    'menu'                => [
                        'slug'       => BPSVB_MENU_PARENT,
                        'first-path' => BPSVB_MENU_PARENT . '&page=' . BPSVB_DASHBOARD_SLUG . '#/welcome',
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

    require_once BPSVB_PATH . 'includes/PostType.php';
    require_once BPSVB_PATH . 'includes/Pro.php';

    if ( BPSVB_HAS_PRO && file_exists( BPSVB_PATH . 'includes/LicenseActivation.php' ) ) {
        require_once BPSVB_PATH . 'includes/LicenseActivation.php';
    }

    // Survey Block
    class BPSVB_Survey_Form_Block
    {
        public function __construct()
        {
            add_action( 'enqueue_block_assets', [$this, 'enqueueBlockAssets'] );
            add_action( 'wp_enqueue_scripts', [$this, 'enqueueFrontendStyles'] );
            add_action( 'init', [$this, 'onInit'] );
            add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [$this, 'pluginActionLinks'] );
        }

        public function enqueueBlockAssets()
        {

            wp_localize_script('svb-survey-block-view-script', 'svbData', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('wp_ajax'),
            ]);

            wp_localize_script('svb-survey-block-editor-script', 'svbData', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('wp_ajax'),
            ]);
        }

        public function enqueueFrontendStyles()
        {
            if ( file_exists( BPSVB_PATH . 'assets/demo-pages.css' ) ) {
                wp_enqueue_style( 'svb-demo-pages', BPSVB_ASSETS_DIR . 'demo-pages.css', [], BPSVB_PLUGIN_VERSION );
            }
        }

        public function onInit() {
            register_block_type( __DIR__ . '/build' );
        }

        /**
         * Adds Help & Demos / Go Pro links to the plugins list row.
         *
         * @param array $links Existing action links.
         * @return array
         */
        public function pluginActionLinks( $links ) {
            $links['svb-help-and-demos'] = sprintf(
                '<a href="%s">%s</a>',
                esc_url( admin_url( 'admin.php?page=' . BPSVB_DASHBOARD_SLUG . '#/welcome' ) ),
                esc_html__( 'Help & Demos', 'survey-form-block' )
            );

            if ( ! BPSVB_Pro::isPremium() ) {
                $links['svb-go-pro'] = sprintf(
                    '<a href="%s" target="_blank" rel="noopener noreferrer" style="color:#FF7A00;font-weight:bold">%s</a>',
                    esc_url( BPSVB_Pro::pricingUrl() ),
                    esc_html__( 'Go Pro', 'survey-form-block' )
                );
            }

            return $links;
        }
    }
    new BPSVB_Survey_Form_Block();

    // Schema hooks only; the table classes load when there is work to do.
    require_once BPSVB_PATH . 'includes/Init.php';
    BPSVB_Init::boot( __FILE__ );

    // Front end too: the Surveys post type has to exist on every request for
    // [survey-form-block id="..."] to resolve, and the shortcode itself runs
    // wherever it is used.
    require_once BPSVB_PATH . 'includes/Shortcode.php';
    require_once BPSVB_PATH . 'includes/Patterns.php';

    // Everything below is admin- or AJAX-only. admin-ajax.php sets WP_ADMIN, so
    // is_admin() covers the public form endpoint too.
    if ( is_admin() || wp_doing_ajax() ) {
        require_once BPSVB_PATH . 'includes/AdminMenu.php';
        require_once BPSVB_PATH . 'includes/SVBAjax.php';
    }
}

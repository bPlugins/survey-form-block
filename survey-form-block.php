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
    define( 'BPSVB_MENU_SLUG', 'survey-form-block' );
    define( 'BPSVB_DASHBOARD_SLUG', 'survey-form-block-dashboard' );

    require_once BPSVB_PATH . 'includes/fs.php';
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
    require_once BPSVB_PATH . 'includes/PostType.php';

    // Everything below is admin- or AJAX-only. admin-ajax.php sets WP_ADMIN, so
    // is_admin() covers the public form endpoint too.
    if ( is_admin() || wp_doing_ajax() ) {
        require_once BPSVB_PATH . 'includes/AdminMenu.php';
        require_once BPSVB_PATH . 'includes/SVBAjax.php';
    }
}

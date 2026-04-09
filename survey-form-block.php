<?php
/**
 * Plugin Name: Survey Form Block
 * Description: Create custom survey forms easily with the Survey Form Block plugin.
 * Version: 1.0.2
 * Author: bPlugins
 * Author URI: http://bplugins.com
 * Requires at least: 6.5
 * Requires PHP: 7.1
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: survey-form-block
 */

// ABS PATH
if (!defined('ABSPATH')) {exit;}

// Constant
define( 'BPSVB_PLUGIN_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.0.2' );
define( 'BPSVB_DIR', plugin_dir_url( __FILE__ ) );
define( 'BPSVB_ASSETS_DIR', plugin_dir_url( __FILE__ ) . 'assets/' );

// Survey Block
class BPSVB_Survey_Form_Block
{
    public function __construct()
    {
        add_action( 'enqueue_block_assets', [$this, 'enqueueBlockAssets'] );
        add_action( 'init', [$this, 'onInit'] );
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
}
new BPSVB_Survey_Form_Block();

require_once plugin_dir_path(__FILE__) . 'inc/AdminMenu.php';
require_once __DIR__ . '/inc/Init.php';
require_once __DIR__ . '/inc/SVBAjax.php';
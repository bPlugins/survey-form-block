<?php
/**
 * Plugin Name: Survey Form Block
 * Description: Create custom survey forms easily with the Survey Form Block plugin.
 * Version: 1.0.1
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
define( 'BPSVB_PLUGIN_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.0.1' );
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
        wp_register_style('svb-survey-style', plugins_url('dist/style.css', __FILE__), [], BPSVB_PLUGIN_VERSION);
        wp_register_script('svb-survey-script', BPSVB_DIR . 'dist/script.js', ['react', 'react-dom'], BPSVB_PLUGIN_VERSION, true);

        wp_localize_script('svb-survey-script', 'svbData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('wp_ajax'),
        ]);
        wp_localize_script('svb-survey-block-editor-script', 'svbData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('wp_ajax'),
        ]);
    }

    public function onInit()
    {
        wp_register_style('svb-survey-block-editor-style', plugins_url('dist/editor.css', __FILE__), ['svb-survey-style'], BPSVB_PLUGIN_VERSION); // Backend Style

        register_block_type(__DIR__, [
            'editor_style' => 'svb-survey-block-editor-style',
            'render_callback' => [$this, 'render'],
        ]); // Register Block

        wp_set_script_translations('svb-survey-block-editor-script', 'survey-form-block', plugin_dir_path(__FILE__) . 'languages'); // Translate
    }

    public function render($attributes)
    {
        extract($attributes);

        $className = $className ?? '';
        $svbBlockClassName = 'wp-block-svb-survey-block ' . $className . ' align' . $align;

        wp_enqueue_style('svb-survey-style');
        wp_enqueue_script('svb-survey-script');

        ob_start();?>
		<div class='<?php echo esc_attr($svbBlockClassName); ?>' id='svbMainArea-<?php echo esc_attr($cId) ?>' data-attributes='<?php echo esc_attr(wp_json_encode($attributes)); ?>'></div>

		<?php return ob_get_clean();
    } // Render
}
new BPSVB_Survey_Form_Block();

require_once plugin_dir_path(__FILE__) . 'inc/AdminMenu.php';
require_once __DIR__ . '/inc/Init.php';
require_once __DIR__ . '/inc/SVBAjax.php';
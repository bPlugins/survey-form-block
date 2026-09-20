<?php
/**
 * Plugin options.
 *
 * Currently just the one: whether deleting the plugin should also delete the
 * data it collected. Off by default - responses are the site owner's data, and
 * removing a plugin should not silently destroy them.
 *
 * Same arrangement as the sibling advanced-post-block plugin.
 */

if (!defined('ABSPATH')) {exit;}

if (!class_exists('BPSVB_Options')) {
    class BPSVB_Options
    {
        const KEY = 'bpsvb_options';

        const AJAX_ACTION = 'svb_save_uninstall_option';

        public function __construct()
        {
            add_action('wp_ajax_' . self::AJAX_ACTION, [$this, 'saveUninstallOption']);
        }

        /**
         * Every option, merged over the defaults.
         *
         * @return array
         */
        public static function getOptions()
        {
            $defaults = [
                'delete_data_on_uninstall' => false,
            ];

            $options = get_option(self::KEY, []);

            return wp_parse_args(is_array($options) ? $options : [], $defaults);
        }

        /**
         * @param array $new_options
         * @return bool
         */
        public static function updateOptions($new_options)
        {
            return update_option(self::KEY, array_merge(self::getOptions(), $new_options), false);
        }

        /**
         * @return bool Whether the site owner asked for their data to go too.
         */
        public static function shouldDeleteData()
        {
            return (bool) self::getOptions()['delete_data_on_uninstall'];
        }

        /**
         * Saves the toggle from the Demo & Help screen.
         *
         * @return void
         */
        public function saveUninstallOption()
        {
            check_ajax_referer(self::AJAX_ACTION, 'nonce');

            if (!current_user_can('manage_options')) {
                wp_send_json_error(__('Permission denied.', 'survey-form-block'));
            }

            $enabled = isset($_POST['enabled']) && 'true' === sanitize_text_field(wp_unslash($_POST['enabled']));

            self::updateOptions(['delete_data_on_uninstall' => $enabled]);

            wp_send_json_success([
                'enabled' => $enabled,
                'message' => $enabled
                    ? __('Surveys and their responses will be deleted when the plugin is uninstalled.', 'survey-form-block')
                    : __('Surveys and their responses will be kept when the plugin is uninstalled.', 'survey-form-block'),
            ]);
        }
    }

    new BPSVB_Options();
}

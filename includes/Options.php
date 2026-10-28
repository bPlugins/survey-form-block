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

        const NOTIFY_ACTION = 'svb_save_notify_settings';

        /** When to email: a survey's first response, every response, or never. */
        const NOTIFY_MODES = ['first', 'each', 'off'];

        public function __construct()
        {
            add_action('wp_ajax_' . self::AJAX_ACTION, [$this, 'saveUninstallOption']);
            add_action('wp_ajax_' . self::NOTIFY_ACTION, [$this, 'saveNotifySettings']);
        }

        /**
         * Every option, merged over the defaults.
         *
         * Response emails default to "first": one email when a survey receives
         * its first ever response. That cannot flood a site after an update,
         * since surveys that already have responses never trigger it.
         *
         * @return array
         */
        public static function getOptions()
        {
            $defaults = [
                'delete_data_on_uninstall' => false,
                'notify_mode' => 'first',
                // Empty means the site's admin email.
                'notify_email' => '',
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

        /**
         * Validates a comma-separated list of email addresses.
         *
         * @param string $raw Submitted text.
         * @return string|false The cleaned list ('' for "use the admin email"),
         *                      or false when any address is invalid.
         */
        public static function cleanEmailList($raw)
        {
            $emails = array_filter(array_map('trim', explode(',', (string) $raw)), 'strlen');
            $clean = [];

            foreach ($emails as $email) {
                $email = sanitize_email($email);

                if (!is_email($email)) {
                    return false;
                }

                $clean[] = $email;
            }

            return implode(', ', array_unique($clean));
        }

        /**
         * Saves the response-email settings from the Survey List screen.
         *
         * @return void
         */
        public function saveNotifySettings()
        {
            check_ajax_referer(self::NOTIFY_ACTION, 'nonce');

            if (!current_user_can('manage_options')) {
                wp_send_json_error(__('Permission denied.', 'survey-form-block'), 403);
            }

            $mode = isset($_POST['mode']) ? sanitize_key(wp_unslash($_POST['mode'])) : '';
            $email = self::cleanEmailList(isset($_POST['email']) ? sanitize_text_field(wp_unslash($_POST['email'])) : '');

            if (!in_array($mode, self::NOTIFY_MODES, true)) {
                wp_send_json_error(__('Choose when to send emails.', 'survey-form-block'));
            }

            if (false === $email) {
                wp_send_json_error(__('Enter valid email addresses, separated by commas.', 'survey-form-block'));
            }

            self::updateOptions(['notify_mode' => $mode, 'notify_email' => $email]);

            wp_send_json_success(['mode' => $mode, 'email' => $email]);
        }
    }

    new BPSVB_Options();
}

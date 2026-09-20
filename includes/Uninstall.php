<?php
/**
 * Uninstall cleanup.
 *
 * Deliberately NOT an uninstall.php in the plugin root. WordPress gives
 * uninstall.php precedence over any callback registered with
 * register_uninstall_hook(), and the Freemius SDK registers one of those for
 * its own teardown - so shipping uninstall.php silently stops the SDK from ever
 * learning the plugin was removed. The logic lives here instead and is hung on
 * the SDK's after_uninstall action, which is what Freemius asks for.
 *
 * @see https://freemius.com/help/documentation/release-management/deployment/#uninstallphp-file
 */

if (!defined('ABSPATH')) {exit;}

if (!class_exists('BPSVB_Uninstall')) {
    class BPSVB_Uninstall
    {
        /**
         * The tables this plugin creates, without the site prefix.
         *
         * @var array
         */
        const TABLES = ['svb_data', 'svb_columns'];

        /**
         * Removes everything the plugin stored, if the site owner asked for it.
         *
         * Off unless explicitly switched on: responses are the site owner's
         * data, and removing a plugin should not quietly destroy them.
         *
         * @return bool Whether anything was deleted.
         */
        public static function run()
        {
            if (!self::shouldRun()) {
                return false;
            }

            self::deleteSurveys();
            self::dropTables();
            self::deleteOptions();

            return true;
        }

        /**
         * @return bool
         */
        private static function shouldRun()
        {
            if (!class_exists('BPSVB_Options')) {
                $options = BPSVB_PATH . 'includes/Options.php';

                if (!file_exists($options)) {
                    return false;
                }

                require_once $options;
            }

            return BPSVB_Options::shouldDeleteData();
        }

        /**
         * Every saved survey, with its revisions and meta.
         *
         * Every status explicitly, because 'any' quietly skips trash.
         *
         * @return void
         */
        private static function deleteSurveys()
        {
            $ids = get_posts([
                'post_type'      => BPSVB_CPT_SLUG,
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'post_status'    => array_keys(get_post_stati()),
            ]);

            foreach ($ids as $id) {
                wp_delete_post($id, true); // Force delete (bypass trash).
            }
        }

        /**
         * @return void
         */
        private static function dropTables()
        {
            global $wpdb;

            foreach (self::TABLES as $table) {
                // Built from the site's own prefix, never from user input.
                $wpdb->query('DROP TABLE IF EXISTS `' . $wpdb->prefix . $table . '`'); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery
            }
        }

        /**
         * @return void
         */
        private static function deleteOptions()
        {
            delete_option(BPSVB_Options::KEY);
            delete_option('bpsvb_db_version'); // Schema version, so a reinstall rebuilds.
        }
    }
}

<?php
/**
 * Schema installer.
 *
 * Previously this file required the whole database layer and ran the installer
 * on every single request, front end included. Now it registers two hooks and
 * pulls the table classes in only when there is actually something to install.
 */

if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_Init')) {
    class BPSVB_Init
    {
        /**
         * Umbrella schema version.
         *
         * Cheap gate: one option read tells us whether any table needs looking
         * at. The per-table versions still decide what actually runs, so this
         * can be bumped freely without forcing a rebuild.
         */
        const DB_VERSION = '2';

        const VERSION_OPTION = 'bpsvb_db_version';

        /**
         * Registers installation hooks. Called once from the main plugin file.
         *
         * @param string $plugin_file Absolute path to the main plugin file.
         * @return void
         */
        public static function boot($plugin_file)
        {
            register_activation_hook($plugin_file, [__CLASS__, 'install']);

            // Covers sites updated in place (FTP, WP-CLI, auto-update), where no
            // activation hook fires. Admin-side only: the front end never needs
            // to think about the schema.
            add_action('admin_init', [__CLASS__, 'maybeUpgrade']);
        }

        /**
         * Runs the installer only when the recorded version is behind.
         *
         * @return void
         */
        public static function maybeUpgrade()
        {
            if (self::DB_VERSION === get_option(self::VERSION_OPTION)) {
                return;
            }

            self::install();
        }

        /**
         * Creates or upgrades every table. Idempotent.
         *
         * @return void
         */
        public static function install()
        {
            foreach (self::getTables() as $table) {
                $table->install();
            }

            update_option(self::VERSION_OPTION, self::DB_VERSION, false);
        }

        /**
         * Drops every table. Not wired to uninstall - submissions are user data,
         * and removing them is a decision for a future opt-in setting.
         *
         * @return bool
         */
        public static function drop()
        {
            foreach (self::getTables() as $table) {
                $table->uninstall();
            }

            delete_option(self::VERSION_OPTION);

            return true;
        }

        /**
         * @return array Table definition objects.
         */
        private static function getTables()
        {
            require_once __DIR__ . '/Table.php';
            require_once __DIR__ . '/SurveyData.php';
            require_once __DIR__ . '/SurveyColumns.php';

            $table = new BPSVB_Table();

            return [
                new BPSVB_Survey_Data($table),
                new BPSVB_Survey_Columns($table),
            ];
        }
    }
}

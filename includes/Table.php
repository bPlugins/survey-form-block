<?php
/**
 * Thin dbDelta wrapper used by the table definitions.
 */

if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_Table')) {
    class BPSVB_Table
    {
        /**
         * Creates or upgrades a table, remembering the schema version it applied.
         *
         * dbDelta is idempotent: it adds missing columns and indexes and leaves
         * existing data alone, so bumping $version is a safe migration.
         *
         * @param string $name    Table name without the site prefix.
         * @param string $columns Column and key definitions.
         * @param mixed  $version Schema version; a change triggers the upgrade.
         * @param array  $opts    Reserved: 'table_options' appended to the DDL.
         * @return void
         */
        public function create($name, $columns, $version = 1, $opts = [])
        {
            $current_version = get_option("{$name}_database_version", 0);

            // Loose compare: the stored option is a string, the declared version
            // may be an int or a float.
            if ($version == $current_version) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- mixed types by design.
                return;
            }

            global $wpdb;

            $full_table_name = $wpdb->prefix . $name;

            $opts = wp_parse_args($opts, ['table_options' => '']);

            $charset_collate = '';

            if ($wpdb->has_cap('collation')) {
                if (!empty($wpdb->charset)) {
                    $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
                }
                if (!empty($wpdb->collate)) {
                    $charset_collate .= " COLLATE $wpdb->collate";
                }
            }

            $table_options = $charset_collate . ' ' . $opts['table_options'];

            require_once ABSPATH . 'wp-admin/includes/upgrade.php';

            // dbDelta parses the DDL itself and cannot take a prepared statement;
            // every interpolated part is plugin-controlled, not user input.
            dbDelta("CREATE TABLE $full_table_name ( $columns ) $table_options");

            update_option("{$name}_database_version", $version, false);
        }

        /**
         * Drops the table and forgets its schema version.
         *
         * @param string $name Table name without the site prefix.
         * @return void
         */
        public function drop($name)
        {
            global $wpdb;

            // %s quotes the value as a string literal, which made this a syntax
            // error and silently left the table behind. Identifiers need %i.
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            $wpdb->query($wpdb->prepare("DROP TABLE IF EXISTS %i", $wpdb->prefix . $name));

            delete_option("{$name}_database_version");
        }
    }
}

<?php
/**
 * CSV export of one survey's responses.
 *
 * Free, and deliberately so: responses are the site owner's data. Served from
 * admin-post.php to people who can manage options, streamed in batches so a
 * long-running survey exports in full - unlike the Survey List screen, which
 * loads only the newest responses.
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';

if (!class_exists('BPSVB_Export')) {
    class BPSVB_Export
    {
        const ACTION = 'svb_export_csv';

        /** Rows read per query while streaming. */
        const BATCH = 500;

        /** Keys the submit endpoint stores beside the answers. */
        const BOOKKEEPING = ['id', 'creator_id', 'title'];

        public function __construct()
        {
            add_action('admin_post_' . self::ACTION, [$this, 'download']);
        }

        /**
         * Streams the CSV for the requested survey.
         *
         * @return void
         */
        public function download()
        {
            if (!current_user_can('manage_options')) {
                wp_die(esc_html__('You do not have permission to export responses.', 'survey-form-block'), '', ['response' => 403]);
            }

            check_admin_referer(self::ACTION);

            $form_id = isset($_GET['form_id']) ? sanitize_text_field(wp_unslash($_GET['form_id'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- verified above.

            if ('' === $form_id) {
                wp_die(esc_html__('No survey was chosen to export.', 'survey-form-block'), '', ['response' => 400]);
            }

            self::stream($form_id, true);
            exit;
        }

        /**
         * Writes the CSV for one survey to the output.
         *
         * @param string $form_id     Survey id.
         * @param bool   $sendHeaders Whether to send the download headers.
         * @return void
         */
        public static function stream($form_id, $sendHeaders = false)
        {
            global $wpdb;

            $columns_table = $wpdb->prefix . 'svb_columns';

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            $map_row = $wpdb->get_row($wpdb->prepare('SELECT form_name, columns FROM %i WHERE form_id = %s LIMIT 1', $columns_table, $form_id), ARRAY_A);
            $labels = $map_row ? BPSVB_Survey_Data_Model::decodePayload($map_row['columns']) : [];

            // First pass: answers can hold keys the column map no longer lists
            // (a question deleted after people answered it). Keep those too.
            $extra = [];
            BPSVB_Survey_Data_Model::forEachResponse($form_id, function ($row) use (&$extra, $labels) {
                foreach (array_keys(BPSVB_Survey_Data_Model::decodePayload($row['data'])) as $key) {
                    if (!array_key_exists($key, $labels) && !in_array($key, self::BOOKKEEPING, true)) {
                        $extra[$key] = $key;
                    }
                }
            }, self::BATCH);

            $columns = self::columns($labels, array_values($extra));
            $name = $map_row && $map_row['form_name'] ? $map_row['form_name'] : $form_id;

            if ($sendHeaders) {
                nocache_headers();
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="' . self::filename($name, wp_date('Y-m-d')) . '"');
                header('X-Content-Type-Options: nosniff');
            }

            $out = fopen('php://output', 'w'); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen -- streaming the download.

            // A byte-order mark so Excel opens UTF-8 answers correctly.
            fwrite($out, "\xEF\xBB\xBF"); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fwrite
            self::put($out, array_merge([__('Response ID', 'survey-form-block'), __('Submitted', 'survey-form-block')], array_values($columns)));

            BPSVB_Survey_Data_Model::forEachResponse($form_id, function ($row) use ($out, $columns) {
                $answers = BPSVB_Survey_Data_Model::decodePayload($row['data']);
                $line = [$row['id'], $row['created_at']];

                foreach (array_keys($columns) as $key) {
                    $line[] = self::cell(array_key_exists($key, $answers) ? $answers[$key] : '');
                }

                self::put($out, $line);
            }, self::BATCH);

            fclose($out); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
        }

        /**
         * Column keys mapped to header labels, in column-map order, then any
         * answer keys the map does not know.
         *
         * @param array $labels Field id => label, from the column map.
         * @param array $extra  Answer keys missing from the map.
         * @return array Field id => header text.
         */
        public static function columns($labels, $extra = [])
        {
            $columns = [];

            foreach ((array) $labels as $key => $label) {
                $text = trim(html_entity_decode(wp_strip_all_tags((string) $label), ENT_QUOTES, 'UTF-8'));
                $columns[$key] = '' === $text ? (string) $key : $text;
            }

            foreach ((array) $extra as $key) {
                if (!array_key_exists($key, $columns)) {
                    $columns[$key] = (string) $key;
                }
            }

            return $columns;
        }

        /**
         * Turns one stored answer into spreadsheet-safe text.
         *
         * Lists become comma-separated, switch answers saved before 1.1 as
         * true/false read as Yes/No, and text that a spreadsheet would run as
         * a formula (=, +, -, @, tab, carriage return) is prefixed with an
         * apostrophe. Plain numbers, negative ones included, stay numbers.
         *
         * @param mixed $value Stored answer.
         * @return string Cell text.
         */
        public static function cell($value)
        {
            if (is_array($value)) {
                $value = implode(', ', array_map(function ($item) {
                    return is_scalar($item) ? (string) $item : wp_json_encode($item);
                }, $value));
            } elseif (is_bool($value)) {
                $value = $value ? __('Yes', 'survey-form-block') : __('No', 'survey-form-block');
            } elseif (null === $value) {
                $value = '';
            }

            $value = (string) $value;

            if ('' !== $value && !is_numeric($value) && in_array($value[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
                $value = "'" . $value;
            }

            return $value;
        }

        /**
         * Download file name: the survey name, date-stamped.
         *
         * @param string $name Survey name or id.
         * @param string $date Y-m-d.
         * @return string File name.
         */
        public static function filename($name, $date)
        {
            $slug = sanitize_title($name);

            return ('' === $slug ? 'survey' : $slug) . '-responses-' . $date . '.csv';
        }

        /**
         * Writes one CSV line. No escape character, so a backslash in an answer
         * is written as-is (RFC 4180).
         *
         * @param resource $out  Output stream.
         * @param array    $line Cells.
         * @return void
         */
        private static function put($out, $line)
        {
            fputcsv($out, $line, ',', '"', '');
        }
    }

    new BPSVB_Export();
}

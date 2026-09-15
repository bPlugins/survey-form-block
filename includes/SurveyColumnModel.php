<?php
/**
 * Column-map table gateway.
 *
 * One row per form, holding the field-id -> label map the submissions list uses
 * to build its table headers.
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';

if(!class_exists('BPSVB_Survey_Column_Model')) {
    class BPSVB_Survey_Column_Model
    {
        private $table_name = 'svb_columns';

        public function __construct()
        {
            global $wpdb;
            $this->table_name = $wpdb->prefix . $this->table_name;
        }

        /**
         * Inserts or updates the column map for a form.
         *
         * Once a form has submissions the map is only rewritten when it actually
         * changed, so historical rows keep their headers.
         *
         * @param array $data columns / form_id / form_name.
         * @return int|bool Insert id, rows affected, or true when nothing changed.
         */
        public function addColumns($data)
        {
            global $wpdb;

            $data['created_at'] = wp_date('Y-m-d H:i:s', current_time('U'));

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            $find = $wpdb->get_row(
                $wpdb->prepare("SELECT * FROM %i WHERE form_id = %s LIMIT 1", $this->table_name, $data['form_id']),
                'ARRAY_A'
            );

            if (!$find) {
                $wpdb->insert($this->table_name, $data); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
                return (int) $wpdb->insert_id;
            }

            $columns = BPSVB_Survey_Data_Model::decodePayload($data['columns']);
            $exist_columns = BPSVB_Survey_Data_Model::decodePayload($find['columns']);

            $dataModel = new BPSVB_Survey_Data_Model();

            // No submissions yet: nothing to keep headers stable for.
            if (!$dataModel->getDataByFormId($data['form_id'])) {
                return $wpdb->update($this->table_name, $data, ['form_id' => $data['form_id']]); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
            }

            // Loose comparison on purpose: it matches pairs regardless of order,
            // which is what the previous two-way array_diff_assoc() did.
            if ($columns == $exist_columns) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- order-insensitive by design.
                return true;
            }

            return $wpdb->update($this->table_name, $data, ['form_id' => $data['form_id']]); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
        }

        /**
         * @param array $data  Columns to set.
         * @param array $where Match clause.
         * @return int|false Rows affected, or false on error.
         */
        public function updateData($data, $where)
        {
            global $wpdb;

            return $wpdb->update($this->table_name, $data, $where); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
        }

        /**
         * @return array Every form's column map, decoded.
         */
        public function getAll()
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            $data = $wpdb->get_results($wpdb->prepare("SELECT * FROM %i ORDER BY id ASC", $this->table_name), 'ARRAY_A');

            if (!is_array($data)) {
                return [];
            }

            foreach ($data as $index => $item) {
                $data[$index]['columns'] = BPSVB_Survey_Data_Model::decodePayload($item['columns']);
            }

            return $data;
        }
    }
}

<?php
/**
 * Submissions table gateway.
 */

if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_Survey_Data_Model')) {
    class BPSVB_Survey_Data_Model
    {
        /**
         * Rows returned by getAllData() when no explicit limit is given.
         *
         * The list screen loads every row into the browser, so this is the point
         * at which "show me the submissions" stops being a safe request.
         */
        const DEFAULT_LIMIT = 2000;

        /** Hard ceiling, so a crafted ?limit= cannot ask for the whole table. */
        const MAX_LIMIT = 10000;

        private $table_name = 'svb_data';

        public function __construct()
        {
            global $wpdb;
            $this->table_name = $wpdb->prefix . $this->table_name;
        }

        /**
         * @param array $data Row to insert.
         * @return int Insert id, or 0 on failure.
         */
        public function addData($data)
        {
            global $wpdb;

            $data['created_at'] = wp_date('Y-m-d H:i:s', current_time('U'));
            $data['user_id'] = get_current_user_id();

            $wpdb->insert($this->table_name, $data); // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.

            return (int) $wpdb->insert_id;
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
         * Newest submissions first, capped.
         *
         * @param int $limit Maximum rows.
         * @return array
         */
        public function getAllData($limit = self::DEFAULT_LIMIT)
        {
            global $wpdb;

            $limit = min(max((int) $limit, 1), self::MAX_LIMIT);

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            $data = $wpdb->get_results(
                $wpdb->prepare("SELECT * FROM %i ORDER BY id DESC LIMIT %d", $this->table_name, $limit),
                'ARRAY_A'
            );

            if (!is_array($data)) {
                return [];
            }

            foreach ($data as $index => $item) {
                $data[$index]['data'] = self::decodePayload($item['data']);
            }

            return $data;
        }

        /**
         * @return int Total stored submissions.
         */
        public function countAll()
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM %i", $this->table_name));
        }

        /**
         * @param string $form_id Form identifier.
         * @return array|null One row, or null.
         */
        public function getDataByFormId($form_id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            return $wpdb->get_row(
                $wpdb->prepare("SELECT * FROM %i WHERE form_id = %s LIMIT 1", $this->table_name, $form_id),
                'ARRAY_A'
            );
        }

        /**
         * Permanently removes responses by id.
         *
         * @param array $ids Row ids.
         * @return int Rows deleted.
         */
        public function deleteByIds($ids)
        {
            global $wpdb;

            $ids = array_values(array_unique(array_filter(array_map('absint', (array) $ids))));

            if (!$ids) {
                return 0;
            }

            // The placeholder list is built from a counted array of integers, not
            // from anything the request supplied.
            $placeholders = implode(',', array_fill(0, count($ids), '%d'));

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            return (int) $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM %i WHERE id IN ({$placeholders})", // phpcs:ignore WordPress.DB.PreparedSQLPlaceholders
                    array_merge([$this->table_name], $ids)
                )
            );
        }

        /**
         * Replaces the stored answers of one response.
         *
         * Only the answer payload is writable; the form it belongs to and when it
         * arrived are facts about the submission and stay as recorded.
         *
         * @param int   $id      Row id.
         * @param array $answers Answers keyed by field id.
         * @return bool Whether the row was updated.
         */
        public function updateAnswers($id, $answers)
        {
            global $wpdb;

            $id = absint($id);

            if (!$id) {
                return false;
            }

            $existing = $this->getById($id);

            if (!$existing) {
                return false;
            }

            // Keep the bookkeeping keys the submission carried (form id, title,
            // creator) so the row still identifies itself after an edit.
            $current = self::decodePayload($existing['data']);
            $merged = array_merge($current, (array) $answers);

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
            $updated = $wpdb->update(
                $this->table_name,
                ['data' => (string) wp_json_encode($merged)],
                ['id' => $id],
                ['%s'],
                ['%d']
            );

            return false !== $updated;
        }

        /**
         * @param int $id Row id.
         * @return array|null
         */
        public function getById($id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL -- custom table, prepared below.
            return $wpdb->get_row(
                $wpdb->prepare("SELECT * FROM %i WHERE id = %d", $this->table_name, absint($id)),
                'ARRAY_A'
            );
        }

        /**
         * Decodes a stored JSON payload.
         *
         * Two write formats exist in the wild. Rows written before this release went
         * through an extra stripslashes() on the way in; rows written since are
         * stored as plain JSON. Try the plain read first, then the legacy one,
         * so a single site can hold both without losing either.
         *
         * @param string $raw Stored column value.
         * @return array Decoded payload, or an empty array.
         */
        public static function decodePayload($raw)
        {
            if (!is_string($raw) || '' === $raw) {
                return [];
            }

            $decoded = json_decode($raw, true);

            if (JSON_ERROR_NONE === json_last_error() && is_array($decoded)) {
                return $decoded;
            }

            $decoded = json_decode(stripslashes($raw), true);

            return (JSON_ERROR_NONE === json_last_error() && is_array($decoded)) ? $decoded : [];
        }
    }
}

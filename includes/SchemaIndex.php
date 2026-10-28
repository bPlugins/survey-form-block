<?php
/**
 * Server-side survey schema.
 *
 * A survey's questions live only in its block attributes, inside the post
 * that holds it, so until now the server never knew a question's type or
 * options. That is what results summaries, NPS math and answer validation
 * need. This records, per survey id, the question list and the post that owns
 * the survey, in the column-map table (`field_schema`, `post_id`).
 *
 * Written whenever a post containing survey blocks is saved - through the
 * editor's REST save, the classic editor, a WXR import or wp_insert_post() -
 * and, for surveys saved before this existed, built on demand by ensure().
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';

if (!class_exists('BPSVB_Schema_Index')) {
    class BPSVB_Schema_Index
    {
        const BLOCK = 'svb/survey-block';

        public function __construct()
        {
            add_action('save_post', [$this, 'onSave'], 20, 2);
        }

        /**
         * @param int     $post_id
         * @param WP_Post $post
         * @return void
         */
        public function onSave($post_id, $post)
        {
            if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id) || !$post instanceof WP_Post) {
                return;
            }

            if (false === strpos((string) $post->post_content, '<!-- wp:' . self::BLOCK)) {
                return;
            }

            self::indexPost($post);
        }

        /**
         * Records every survey in a post.
         *
         * @param WP_Post $post
         * @return int Surveys recorded.
         */
        public static function indexPost($post)
        {
            // The columns this writes arrive with schema 3 / table version 4.
            if (class_exists('BPSVB_Init')) {
                BPSVB_Init::maybeUpgrade();
            }

            $surveys = self::surveysInBlocks(parse_blocks((string) $post->post_content));

            foreach ($surveys as $survey) {
                self::store($survey, (int) $post->ID);
            }

            return count($surveys);
        }

        /**
         * Finds the survey blocks in a parsed block tree, nested ones included.
         *
         * @param array $blocks Output of parse_blocks().
         * @return array[] Each: form_id, form_name, fields (see fieldSchema()).
         */
        public static function surveysInBlocks($blocks)
        {
            $found = [];

            foreach ((array) $blocks as $block) {
                if (self::BLOCK === ($block['blockName'] ?? null)) {
                    $attrs = (array) ($block['attrs'] ?? []);
                    $form = (array) ($attrs['form'] ?? []);
                    $form_id = isset($form['id']) ? sanitize_text_field((string) $form['id']) : '';

                    if ('' !== $form_id && isset($attrs['fields']) && is_array($attrs['fields'])) {
                        $found[] = [
                            'form_id' => $form_id,
                            'form_name' => self::plain($form['title'] ?? ''),
                            'fields' => self::fieldSchema($attrs['fields']),
                        ];
                    }
                }

                if (!empty($block['innerBlocks'])) {
                    $found = array_merge($found, self::surveysInBlocks($block['innerBlocks']));
                }
            }

            return $found;
        }

        /**
         * Reduces the block's field attributes to what the server needs.
         *
         * Section dividers, untyped and disabled fields collect no answers and
         * are left out.
         *
         * @param array $fields Block `fields` attribute.
         * @return array[] id, type, label, required, and per type: options,
         *                 max (stars / scale end), min, on / off labels.
         */
        public static function fieldSchema($fields)
        {
            $schema = [];

            foreach ((array) $fields as $field) {
                $field = (array) $field;
                $type = isset($field['type']) ? sanitize_key((string) $field['type']) : '';
                $id = isset($field['id']) ? sanitize_text_field((string) $field['id']) : '';

                if ('' === $id || '' === $type || 'section' === $type || !empty($field['isDisable'])) {
                    continue;
                }

                $item = [
                    'id' => $id,
                    'type' => $type,
                    'label' => self::plain($field['label'] ?? ''),
                    'required' => !empty($field['isRequired']),
                ];

                if (in_array($type, ['radio', 'select', 'checkbox'], true)) {
                    $item['options'] = [];

                    foreach ((array) ($field['options'] ?? []) as $option) {
                        $option = (array) $option;
                        $value = isset($option['value']) ? (string) $option['value'] : '';

                        if ('' !== $value) {
                            $item['options'][] = ['value' => $value, 'label' => self::plain($option['label'] ?? $value)];
                        }
                    }
                }

                if ('star_rating' === $type) {
                    $stars = (int) ($field['maxStars'] ?? 5);
                    $item['max'] = $stars > 0 ? $stars : 5;
                }

                if ('range_slider' === $type) {
                    $item['min'] = isset($field['min']) && is_numeric($field['min']) ? (float) $field['min'] : 0.0;
                    $item['max'] = isset($field['max']) && is_numeric($field['max']) ? (float) $field['max'] : 100.0;
                }

                if ('toggle' === $type) {
                    $item['on'] = self::plain($field['onLabel'] ?? '') ?: 'Yes';
                    $item['off'] = self::plain($field['offLabel'] ?? '') ?: 'No';
                }

                $schema[] = $item;
            }

            return $schema;
        }

        /**
         * Saves one survey's schema.
         *
         * The first post to save a survey id owns it; a later post saving the
         * same id (an older duplicate) updates the schema but not the owner.
         * The label map is filled only when empty - the editor keeps it.
         *
         * @param array $survey  form_id, form_name, fields.
         * @param int   $post_id Post holding the survey.
         * @return void
         */
        private static function store($survey, $post_id)
        {
            global $wpdb;

            $table = $wpdb->prefix . 'svb_columns';
            $schema = (string) wp_json_encode($survey['fields']);
            $labels = (string) wp_json_encode(array_column($survey['fields'], 'label', 'id'));
            $now = current_time('mysql');

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            $row = $wpdb->get_row($wpdb->prepare('SELECT id, post_id, columns FROM %i WHERE form_id = %s LIMIT 1', $table, $survey['form_id']), ARRAY_A);

            if (!$row) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
                $wpdb->insert($table, [
                    'form_id' => $survey['form_id'],
                    'form_name' => $survey['form_name'],
                    'columns' => $labels,
                    'created_at' => $now,
                    'post_id' => $post_id,
                    'field_schema' => $schema,
                    'updated_at' => $now,
                ]);

                return;
            }

            $update = ['field_schema' => $schema, 'updated_at' => $now];

            if (empty($row['post_id'])) {
                $update['post_id'] = $post_id;
            }

            if ('' !== $survey['form_name']) {
                $update['form_name'] = $survey['form_name'];
            }

            if (!BPSVB_Survey_Data_Model::decodePayload((string) $row['columns'])) {
                $update['columns'] = $labels;
            }

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table.
            $wpdb->update($table, $update, ['id' => (int) $row['id']]);
        }

        /**
         * The stored schema of a survey, building it first when the survey was
         * last saved before the schema existed.
         *
         * @param string $form_id
         * @return array[]|null The question list, or null when no post holds it.
         */
        public static function ensure($form_id)
        {
            // get() reads a column that arrives with the upgrade, and nothing
            // guarantees admin_init has run first (WP-CLI, cron, other callers).
            if (class_exists('BPSVB_Init')) {
                BPSVB_Init::maybeUpgrade();
            }

            $schema = self::get($form_id);

            if (null !== $schema) {
                return $schema;
            }

            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- one-off lookup, prepared.
            $ids = $wpdb->get_col($wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE post_content LIKE %s AND post_content LIKE %s AND post_status NOT IN ('trash', 'auto-draft', 'inherit') ORDER BY ID ASC LIMIT 20",
                '%' . $wpdb->esc_like('<!-- wp:' . self::BLOCK) . '%',
                '%' . $wpdb->esc_like('"id":"' . $form_id . '"') . '%'
            ));

            foreach ((array) $ids as $id) {
                $post = get_post((int) $id);

                if ($post) {
                    self::indexPost($post);
                }
            }

            return self::get($form_id);
        }

        /**
         * @param string $form_id
         * @return array[]|null Stored question list, or null when none.
         */
        public static function get($form_id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            $raw = $wpdb->get_var($wpdb->prepare('SELECT field_schema FROM %i WHERE form_id = %s LIMIT 1', $wpdb->prefix . 'svb_columns', $form_id));

            if (null === $raw || '' === $raw) {
                return null;
            }

            $schema = json_decode((string) $raw, true);

            return is_array($schema) ? $schema : null;
        }

        /**
         * @param mixed $text Rich text.
         * @return string Plain text.
         */
        private static function plain($text)
        {
            return trim(html_entity_decode(wp_strip_all_tags((string) $text), ENT_QUOTES, 'UTF-8'));
        }
    }

    new BPSVB_Schema_Index();
}

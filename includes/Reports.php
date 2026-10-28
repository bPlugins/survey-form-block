<?php
/**
 * Results summary for one survey.
 *
 * Free. Reads every response of a survey (in batches, like the CSV export) and
 * summarises each question by its type, using the schema recorded by
 * BPSVB_Schema_Index:
 *
 *   nps            NPS score, promoter / passive / detractor split, 0-10 counts
 *   star_rating    average, CSAT (share of the top two ratings), counts
 *   opinion_scale  average, 1-10 counts
 *   range_slider,
 *   number         average, lowest, highest
 *   radio, select,
 *   toggle         count per option
 *   checkbox       count per option (respondents can pick several)
 *   text,
 *   paragraph      the five newest answers
 *   email, phone,
 *   url, date      how many answered
 *
 * Served to the Survey List screen through the `svb_get_summary` AJAX action.
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';
require_once __DIR__ . '/SchemaIndex.php';

if (!class_exists('BPSVB_Reports')) {
    class BPSVB_Reports
    {
        const ACTION = 'svb_get_summary';

        /** Text answers kept per question. */
        const LATEST = 5;

        public function __construct()
        {
            add_action('wp_ajax_' . self::ACTION, [$this, 'ajax']);
        }

        /**
         * @return void
         */
        public function ajax()
        {
            $nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax') || !current_user_can('manage_options')) {
                wp_send_json_error(__('You do not have permission to view results.', 'survey-form-block'), 403);
            }

            $form_id = isset($_GET['form_id']) ? sanitize_text_field(wp_unslash($_GET['form_id'])) : '';

            if ('' === $form_id) {
                wp_send_json_error(__('No survey was chosen.', 'survey-form-block'));
            }

            $schema = BPSVB_Schema_Index::ensure($form_id);
            $rows = [];

            BPSVB_Survey_Data_Model::forEachResponse($form_id, function ($row) use (&$rows) {
                $rows[] = ['created_at' => $row['created_at'], 'answers' => BPSVB_Survey_Data_Model::decodePayload($row['data'])];
            });

            wp_send_json_success(self::summarize($schema, $rows, self::labels($form_id)));
        }

        /**
         * Summarises a survey.
         *
         * @param array[]|null $schema Question list from the schema index, or
         *                             null when it could not be built.
         * @param array[]      $rows   Each: created_at, answers (field id => value).
         * @param array        $labels Field id => label from the column map,
         *                             used when there is no schema.
         * @return array total, first, last, hasSchema, questions[].
         */
        public static function summarize($schema, $rows, $labels = [])
        {
            $questions = is_array($schema) ? $schema : self::guessSchema($rows, $labels);
            $out = [];

            foreach ($questions as $question) {
                $out[] = self::question($question, $rows);
            }

            $dates = array_filter(array_column((array) $rows, 'created_at'));

            return [
                'total' => count((array) $rows),
                'first' => $dates ? min($dates) : null,
                'last' => $dates ? max($dates) : null,
                'hasSchema' => is_array($schema),
                'questions' => $out,
            ];
        }

        /**
         * @param array   $question Schema entry.
         * @param array[] $rows
         * @return array Summary for one question.
         */
        private static function question($question, $rows)
        {
            $id = (string) $question['id'];
            $type = (string) $question['type'];
            $values = [];

            foreach ((array) $rows as $row) {
                $answers = (array) ($row['answers'] ?? []);

                if (array_key_exists($id, $answers) && self::isAnswer($type, $answers[$id])) {
                    $values[] = $answers[$id];
                }
            }

            $result = [
                'id' => $id,
                'label' => '' !== (string) ($question['label'] ?? '') ? (string) $question['label'] : $id,
                'type' => $type,
                'answered' => count($values),
            ];

            switch ($type) {
                case 'nps':
                    return $result + self::nps($values);

                case 'star_rating':
                    return $result + self::stars($values, (int) ($question['max'] ?? 5));

                case 'opinion_scale':
                    return $result + self::scale($values, 1, 10);

                case 'range_slider':
                case 'number':
                    return $result + self::numbers($values);

                case 'radio':
                case 'select':
                    return $result + ['kind' => 'choice', 'options' => self::countOptions($values, (array) ($question['options'] ?? []), false)];

                case 'checkbox':
                    return $result + ['kind' => 'multi', 'options' => self::countOptions($values, (array) ($question['options'] ?? []), true)];

                case 'toggle':
                    $on = (string) ($question['on'] ?? 'Yes');
                    $off = (string) ($question['off'] ?? 'No');
                    // Switch answers stored before 1.1 are true / false.
                    $words = array_map(function ($value) use ($on, $off) {
                        return is_bool($value) ? ($value ? $on : $off) : $value;
                    }, $values);

                    return $result + ['kind' => 'choice', 'options' => self::countOptions($words, [['value' => $on, 'label' => $on], ['value' => $off, 'label' => $off]], false)];

                case 'text':
                case 'paragraph':
                    $texts = array_values(array_filter($values, 'is_scalar'));

                    return $result + ['kind' => 'text', 'latest' => array_map('strval', array_slice(array_reverse($texts), 0, self::LATEST))];

                default:
                    return $result + ['kind' => 'count'];
            }
        }

        /**
         * @param string $type
         * @param mixed  $value
         * @return bool Whether the stored value is an answer.
         */
        private static function isAnswer($type, $value)
        {
            if (null === $value || '' === $value || [] === $value) {
                return false;
            }

            // Clicking the selected star again stores 0, meaning "no rating".
            if ('star_rating' === $type) {
                return is_numeric($value) && (float) $value > 0;
            }

            if (in_array($type, ['nps', 'opinion_scale', 'range_slider', 'number'], true)) {
                return is_numeric($value);
            }

            return true;
        }

        /**
         * NPS = % promoters (9-10) minus % detractors (0-6), rounded.
         *
         * @param array $values Scores.
         * @return array
         */
        private static function nps($values)
        {
            $counts = array_fill(0, 11, 0);

            foreach ($values as $value) {
                $score = (int) round((float) $value);

                if ($score >= 0 && $score <= 10) {
                    $counts[$score]++;
                }
            }

            $total = array_sum($counts);
            $promoters = $counts[9] + $counts[10];
            $passives = $counts[7] + $counts[8];
            $detractors = $total - $promoters - $passives;

            return [
                'kind' => 'nps',
                'score' => $total ? (int) round(($promoters - $detractors) / $total * 100) : null,
                'promoters' => $promoters,
                'passives' => $passives,
                'detractors' => $detractors,
                'distribution' => self::distribution($counts),
            ];
        }

        /**
         * Average and CSAT, the share of answers in the top two ratings (4-5 on
         * five stars).
         *
         * @param array $values Ratings.
         * @param int   $max    Number of stars.
         * @return array
         */
        private static function stars($values, $max)
        {
            $max = $max > 0 ? $max : 5;
            $counts = array_fill(1, $max, 0);

            foreach ($values as $value) {
                $rating = (int) round((float) $value);

                if ($rating >= 1 && $rating <= $max) {
                    $counts[$rating]++;
                }
            }

            $total = array_sum($counts);
            $sum = 0;

            foreach ($counts as $rating => $count) {
                $sum += $rating * $count;
            }

            $top = $counts[$max] + ($max > 1 ? $counts[$max - 1] : 0);

            return [
                'kind' => 'stars',
                'max' => $max,
                'average' => $total ? round($sum / $total, 1) : null,
                'csat' => $total ? (int) round($top / $total * 100) : null,
                'distribution' => self::distribution($counts),
            ];
        }

        /**
         * @param array $values
         * @param int   $from
         * @param int   $to
         * @return array Average and counts across a fixed scale.
         */
        private static function scale($values, $from, $to)
        {
            $counts = array_fill($from, $to - $from + 1, 0);

            foreach ($values as $value) {
                $point = (int) round((float) $value);

                if ($point >= $from && $point <= $to) {
                    $counts[$point]++;
                }
            }

            $numbers = array_map('floatval', $values);

            return [
                'kind' => 'scale',
                'average' => $numbers ? round(array_sum($numbers) / count($numbers), 1) : null,
                'distribution' => self::distribution($counts),
            ];
        }

        /**
         * @param array $values
         * @return array Average, lowest and highest.
         */
        private static function numbers($values)
        {
            $numbers = array_map('floatval', $values);

            return [
                'kind' => 'numbers',
                'average' => $numbers ? round(array_sum($numbers) / count($numbers), 1) : null,
                'min' => $numbers ? min($numbers) + 0 : null,
                'max' => $numbers ? max($numbers) + 0 : null,
            ];
        }

        /**
         * Counts answers per option, keeping the survey's option order and
         * adding any answer the options no longer list.
         *
         * @param array $values  Answers (arrays for multi-select).
         * @param array $options Schema options: value, label.
         * @param bool  $multi   Whether each answer is a list.
         * @return array[] label, count.
         */
        private static function countOptions($values, $options, $multi)
        {
            $counts = [];
            $labels = [];

            foreach ($options as $option) {
                $key = (string) $option['value'];
                $counts[$key] = 0;
                $labels[$key] = (string) $option['label'];
            }

            foreach ($values as $value) {
                $picked = $multi && is_array($value) ? $value : [$value];

                foreach ($picked as $item) {
                    if (!is_scalar($item)) {
                        continue;
                    }

                    $key = (string) $item;

                    if (!array_key_exists($key, $counts)) {
                        $counts[$key] = 0;
                        $labels[$key] = $key;
                    }

                    $counts[$key]++;
                }
            }

            $out = [];

            foreach ($counts as $key => $count) {
                $out[] = ['label' => $labels[$key], 'count' => $count];
            }

            return $out;
        }

        /**
         * @param array $counts Value => count.
         * @return array[] value, count.
         */
        private static function distribution($counts)
        {
            $out = [];

            foreach ($counts as $value => $count) {
                $out[] = ['value' => $value, 'count' => $count];
            }

            return $out;
        }

        /**
         * A best-effort question list when no post holds the survey any more:
         * every answered key, as a count-only question.
         *
         * @param array[] $rows
         * @param array   $labels Field id => label.
         * @return array[]
         */
        private static function guessSchema($rows, $labels)
        {
            $keys = array_keys((array) $labels);

            foreach ((array) $rows as $row) {
                foreach (array_keys((array) ($row['answers'] ?? [])) as $key) {
                    if (!in_array($key, $keys, true) && !in_array($key, ['id', 'title', 'creator_id'], true)) {
                        $keys[] = $key;
                    }
                }
            }

            return array_map(function ($key) use ($labels) {
                $label = isset($labels[$key]) ? trim(html_entity_decode(wp_strip_all_tags((string) $labels[$key]), ENT_QUOTES, 'UTF-8')) : '';

                return ['id' => (string) $key, 'type' => 'unknown', 'label' => $label];
            }, $keys);
        }

        /**
         * @param string $form_id
         * @return array Field id => label from the column map.
         */
        private static function labels($form_id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            $raw = $wpdb->get_var($wpdb->prepare('SELECT columns FROM %i WHERE form_id = %s LIMIT 1', $wpdb->prefix . 'svb_columns', $form_id));

            return BPSVB_Survey_Data_Model::decodePayload((string) $raw);
        }
    }

    new BPSVB_Reports();
}

<?php
/**
 * Response emails.
 *
 * Listens to `svb_after_submission` and emails the site owner. By default only
 * a survey's first response triggers an email - the moment a survey starts
 * working - and "every response" is opt-in, capped per hour so a busy survey or
 * a flood cannot fill an inbox. Settings live on the Survey List screen.
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/Options.php';
require_once __DIR__ . '/Export.php';

if (!class_exists('BPSVB_Notifications')) {
    class BPSVB_Notifications
    {
        /** Counts emails sent in the current hour. */
        const HOUR_KEY = 'svb_notify_hour';

        /** Keys the submit endpoint stores beside the answers. */
        const BOOKKEEPING = ['id', 'creator_id', 'title'];

        public function __construct()
        {
            add_action('svb_after_submission', [$this, 'onSubmission'], 10, 4);
        }

        /**
         * @param int    $response_id Stored row id.
         * @param string $form_id     Survey id.
         * @param array  $answers     Sanitised answers keyed by field id.
         * @param string $form_name   Survey title.
         * @return void
         */
        public function onSubmission($response_id, $form_id, $answers, $form_name)
        {
            $options = BPSVB_Options::getOptions();
            $mode = $options['notify_mode'];

            if ('off' === $mode) {
                return;
            }

            $isFirst = 1 === self::countResponses($form_id);
            $sentThisHour = (int) get_transient(self::HOUR_KEY);

            /**
             * Most response emails sent per hour when every response is emailed.
             *
             * @param int $cap
             */
            $cap = (int) apply_filters('svb_notify_hourly_cap', 30);

            if (!self::shouldSend($mode, $isFirst, $sentThisHour, $cap)) {
                return;
            }

            $to = '' !== $options['notify_email'] ? $options['notify_email'] : get_option('admin_email');

            $message = self::message([
                'site' => wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
                'survey' => $form_name ? $form_name : $form_id,
                'submitted' => wp_date(get_option('date_format') . ' ' . get_option('time_format')),
                'labels' => self::labels($form_id),
                'answers' => (array) $answers,
                'isFirst' => $isFirst,
                'lastThisHour' => 'each' === $mode && $cap > 0 && $sentThisHour + 1 === $cap,
                'responsesUrl' => admin_url('edit.php?post_type=' . BPSVB_CPT_SLUG . '&page=' . BPSVB_MENU_SLUG),
            ]);

            if (wp_mail($to, $message['subject'], $message['body'])) {
                set_transient(self::HOUR_KEY, $sentThisHour + 1, HOUR_IN_SECONDS);
            }
        }

        /**
         * Whether this response should be emailed.
         *
         * @param string $mode         'first', 'each' or 'off'.
         * @param bool   $isFirst      Whether it is the survey's first response.
         * @param int    $sentThisHour Emails already sent this hour.
         * @param int    $cap          Hourly cap for 'each' (0 = no cap).
         * @return bool
         */
        public static function shouldSend($mode, $isFirst, $sentThisHour, $cap)
        {
            if ('first' === $mode) {
                return (bool) $isFirst;
            }

            if ('each' === $mode) {
                return $cap <= 0 || $sentThisHour < $cap;
            }

            return false;
        }

        /**
         * Builds the subject and plain-text body.
         *
         * @param array $args site, survey, submitted, labels, answers, isFirst,
         *                    lastThisHour, responsesUrl.
         * @return array{subject: string, body: string}
         */
        public static function message($args)
        {
            $survey = self::oneLine($args['survey']);

            $subject = $args['isFirst']
                /* translators: 1: site name, 2: survey name. */
                ? sprintf(__('[%1$s] First response to "%2$s"', 'survey-form-block'), self::oneLine($args['site']), $survey)
                /* translators: 1: site name, 2: survey name. */
                : sprintf(__('[%1$s] New response: %2$s', 'survey-form-block'), self::oneLine($args['site']), $survey);

            $lines = [];

            if ($args['isFirst']) {
                $lines[] = __('Your survey just received its first response.', 'survey-form-block');
                $lines[] = '';
            }

            /* translators: %s: survey name. */
            $lines[] = sprintf(__('Survey: %s', 'survey-form-block'), $survey);
            /* translators: %s: date and time. */
            $lines[] = sprintf(__('Submitted: %s', 'survey-form-block'), $args['submitted']);
            $lines[] = '';

            $answers = array_diff_key((array) $args['answers'], array_flip(self::BOOKKEEPING));
            $labels = (array) $args['labels'];

            // Questions in survey order, then anything the map does not list.
            foreach (array_unique(array_merge(array_keys($labels), array_keys($answers))) as $key) {
                if (!array_key_exists($key, $answers)) {
                    continue;
                }

                $label = isset($labels[$key]) ? $labels[$key] : $key;
                $lines[] = self::oneLine($label) . ': ' . self::text($answers[$key]);
            }

            $lines[] = '';
            /* translators: %s: link to the responses screen. */
            $lines[] = sprintf(__('All responses: %s', 'survey-form-block'), $args['responsesUrl']);

            if (!empty($args['lastThisHour'])) {
                $lines[] = '';
                $lines[] = __('That is the most response emails sent in one hour. Responses keep arriving in Survey List; emails resume next hour.', 'survey-form-block');
            }

            $lines[] = '';
            $lines[] = __('Change or turn off these emails on the Survey List screen.', 'survey-form-block');

            return ['subject' => $subject, 'body' => implode("\n", $lines)];
        }

        /**
         * Readable text for one answer.
         *
         * @param mixed $value Stored answer.
         * @return string
         */
        public static function text($value)
        {
            if (is_array($value)) {
                return implode(', ', array_map('strval', array_filter($value, 'is_scalar')));
            }

            if (is_bool($value)) {
                return $value ? __('Yes', 'survey-form-block') : __('No', 'survey-form-block');
            }

            if (null === $value || '' === $value) {
                return '-';
            }

            return (string) $value;
        }

        /**
         * Collapses line breaks, so survey and site names cannot add lines to a
         * subject or to the body's header lines.
         *
         * @param string $text
         * @return string
         */
        private static function oneLine($text)
        {
            return trim(preg_replace('/[\r\n]+/', ' ', (string) $text));
        }

        /**
         * @param string $form_id
         * @return int Stored responses for the survey.
         */
        private static function countResponses($form_id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            return (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM %i WHERE form_id = %s', $wpdb->prefix . 'svb_data', $form_id));
        }

        /**
         * @param string $form_id
         * @return array Field id => question label.
         */
        private static function labels($form_id)
        {
            global $wpdb;

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery -- custom table, prepared.
            $map = $wpdb->get_var($wpdb->prepare('SELECT columns FROM %i WHERE form_id = %s LIMIT 1', $wpdb->prefix . 'svb_columns', $form_id));

            return BPSVB_Export::columns(BPSVB_Survey_Data_Model::decodePayload((string) $map));
        }
    }

    new BPSVB_Notifications();
}

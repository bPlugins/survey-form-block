<?php
/**
 * AJAX endpoints.
 *
 * The first three keep their names and response shapes because the bundled
 * scripts on already-published pages call them:
 *
 *   svb_data_add            public   stores one survey submission
 *   svb_get_all_data        admin    reads submissions for the list screen
 *   svb_add_update_columns  editor   records the field-id -> label map for a form
 *   svb_delete_responses    admin    removes stored responses
 *   svb_update_response     admin    rewrites the answers of one response
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';
require_once __DIR__ . '/SurveyColumnModel.php';

if(!class_exists('BPSVB_Ajax')) {
    class BPSVB_Ajax
    {
        /**
         * Capability required to write a form's column map.
         *
         * `svb_add_update_columns` is fired from the block editor while saving a
         * post, so it lines up with the capability that lets someone edit posts
         * in the first place.
         */
        const EDIT_CAP = 'edit_posts';

        public function __construct()
        {
            add_action('wp_ajax_svb_data_add', [$this, 'svb_data_add']);
            add_action('wp_ajax_nopriv_svb_data_add', [$this, 'svb_data_add']);

            add_action('wp_ajax_svb_get_all_data', [$this, 'get_all_data']);

            add_action('wp_ajax_svb_add_update_columns', [$this, 'svb_add_update_columns']);

            add_action('wp_ajax_svb_delete_responses', [$this, 'svb_delete_responses']);
            add_action('wp_ajax_svb_update_response', [$this, 'svb_update_response']);
        }

        /**
         * Guards the screens that read and write stored responses.
         *
         * Unlike the public submit endpoint, these are privileged: a stale nonce
         * here means a stale admin page, which is worth rejecting.
         *
         * @return void
         */
        private static function requireManager()
        {
            $nonce = isset($_REQUEST['nonce']) ? sanitize_text_field(wp_unslash($_REQUEST['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error(__('Your session has expired. Please reload the page.', 'survey-form-block'), 403);
            }

            if (!current_user_can('manage_options')) {
                wp_send_json_error(__('You do not have permission to manage responses.', 'survey-form-block'), 403);
            }
        }

        /**
         * Permanently deletes one or more responses.
         *
         * @return void
         */
        public function svb_delete_responses()
        {
            self::requireManager();

            $raw = isset($_POST['ids']) ? wp_unslash($_POST['ids']) : []; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- cast to integers below.
            $ids = is_array($raw) ? $raw : explode(',', (string) $raw);

            $model = new BPSVB_Survey_Data_Model();
            $deleted = $model->deleteByIds($ids);

            if (!$deleted) {
                wp_send_json_error(__('Nothing was deleted.', 'survey-form-block'));
            }

            wp_send_json_success(['deleted' => $deleted]);
        }

        /**
         * Rewrites the answers of one stored response.
         *
         * @return void
         */
        public function svb_update_response()
        {
            self::requireManager();

            $id = isset($_POST['id']) ? absint(wp_unslash($_POST['id'])) : 0;

            if (!$id) {
                wp_send_json_error(__('Response not found.', 'survey-form-block'));
            }

            $answers = isset($_POST['answers'])
                ? json_decode(self::sanitize_submission(wp_unslash($_POST['answers'])), true) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitize_submission() cleans every value.
                : null;

            if (!is_array($answers)) {
                wp_send_json_error(__('Nothing to save.', 'survey-form-block'));
            }

            $model = new BPSVB_Survey_Data_Model();

            if (!$model->updateAnswers($id, $answers)) {
                wp_send_json_error(__('The response could not be saved.', 'survey-form-block'));
            }

            wp_send_json_success(['id' => $id, 'answers' => $model->getById($id)['data']]);
        }

        /**
         * Stores one submission. Public by design - this is the form endpoint.
         *
         * @return void
         */
        public function svb_data_add()
        {
            // Deliberately not gated on the nonce.
            //
            // This endpoint is public, so a nonce cannot protect it: every
            // logged-out visitor is issued the *same* token, and there is no
            // privileged action to forge - anyone can post the form directly.
            // What the nonce did do was expire after 24 hours, so on any site
            // with page caching the cached HTML eventually carried a dead token
            // and real responses were rejected.
            //
            // It is still verified when present (a valid one marks a request as
            // coming from a freshly rendered page); abuse is handled by the rate
            // limit below, which keeps working no matter how the page is cached.
            $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
            $isFresh = '' !== $nonce && false !== wp_verify_nonce($nonce, 'wp_ajax');

            // Was `!isset(...) && ... == ''`, which short-circuited on a form_id
            // that was present but empty, letting unattributable rows through.
            $form_id = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';

            if ('' === $form_id) {
                wp_send_json_error('form_id not found');
            }

            if (!self::withinRateLimit($isFresh)) {
                wp_send_json_error(
                    __('Too many submissions from this address. Please wait a moment and try again.', 'survey-form-block'),
                    429
                );
            }

            $data = [
                'data' => isset($_POST['data']) ? self::sanitize_submission(wp_unslash($_POST['data'])) : '', // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitize_submission() cleans every value.
                'form_id' => $form_id,
                'form_creator_id' => isset($_POST['form_creator_id']) ? absint(wp_unslash($_POST['form_creator_id'])) : 0,
                'form_name' => isset($_POST['form_name']) ? sanitize_text_field(wp_unslash($_POST['form_name'])) : '',
            ];

            $model = new BPSVB_Survey_Data_Model();
            $insert_id = $model->addData($data);

            if (!$insert_id) {
                wp_send_json_error('something went wrong!');
            }

            wp_send_json_success($insert_id);
        }

        /**
         * Feeds the submissions list screen.
         *
         * @return void
         */
        public function get_all_data()
        {
            $nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('validation failed');
            }

            if (!current_user_can('manage_options')) {
                wp_send_json_error('insufficient permissions');
            }

            $model = new BPSVB_Survey_Data_Model();
            $columnsModel = new BPSVB_Survey_Column_Model();

            // Bounded so a site with a long submission history cannot exhaust
            // memory rendering this screen. `total` lets the UI say so.
            $limit = isset($_GET['limit']) ? absint(wp_unslash($_GET['limit'])) : BPSVB_Survey_Data_Model::DEFAULT_LIMIT;

            wp_send_json_success([
                'data' => $model->getAllData($limit),
                'columns' => $columnsModel->getAll(),
                'total' => $model->countAll(),
                'limit' => $limit,
            ]);
        }

        /**
         * Records the field-id -> label map so the list screen can build columns.
         *
         * @return void
         */
        public function svb_add_update_columns()
        {
            $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('validation failed');
            }

            // This writes the column map for an arbitrary form_id. Without a
            // capability check any logged-in user - a subscriber on a membership
            // site, say - could overwrite the map of any form on the site.
            if (!current_user_can(self::EDIT_CAP)) {
                wp_send_json_error('insufficient permissions');
            }

            $form_id = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';

            if ('' === $form_id) {
                wp_send_json_error('form_id not found');
            }

            $columns = isset($_POST['columns']) ? self::sanitize_submission(wp_unslash($_POST['columns'])) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitize_submission() cleans every value.

            $model = new BPSVB_Survey_Column_Model();

            $insert_id = $model->addColumns([
                'columns' => $columns,
                'form_id' => $form_id,
                'form_name' => isset($_POST['form_name']) ? sanitize_text_field(wp_unslash($_POST['form_name'])) : '',
            ]);

            wp_send_json_success($insert_id);
        }

        /**
         * Throttles submissions per client address.
         *
         * This is the control that actually protects the public endpoint. Unlike
         * a nonce it does not live in the HTML, so page caching cannot stale it,
         * and it limits flooding rather than merely proving a page was rendered
         * recently.
         *
         * The window slides: a client that keeps hammering stays blocked until it
         * stops for the full window.
         *
         * @param bool $isFresh Whether the request carried a valid nonce.
         * @return bool True when the submission may proceed.
         */
        private static function withinRateLimit($isFresh = false)
        {
            /**
             * Submissions allowed per window, per address.
             *
             * Requests from a freshly rendered page get a higher allowance, since
             * they are the ones that could not have been replayed from a cache.
             * Return 0 to switch throttling off entirely.
             *
             * @param int  $max
             * @param bool $isFresh
             */
            $max = (int) apply_filters('svb_submission_rate_limit', $isFresh ? 20 : 10, $isFresh);

            /**
             * Length of the throttling window in seconds.
             *
             * @param int $window
             */
            $window = (int) apply_filters('svb_submission_rate_window', MINUTE_IN_SECONDS);

            if ($max <= 0 || $window <= 0) {
                return true;
            }

            $ip = self::clientIp();

            if ('' === $ip) {
                // No address to key on; throttling would be meaningless.
                return true;
            }

            $key = 'svb_rl_' . md5($ip);
            $hits = (int) get_transient($key);

            if ($hits >= $max) {
                return false;
            }

            set_transient($key, $hits + 1, $window);

            return true;
        }

        /**
         * Resolves the client address.
         *
         * Forwarded headers are ignored on purpose - they are trivially spoofed,
         * which would let a single client sidestep the rate limit by varying one
         * header. Sites behind a reverse proxy can supply the real address via
         * the `svb_client_ip` filter, where they know which header to trust.
         *
         * @return string Validated IP, or an empty string.
         */
        private static function clientIp()
        {
            $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';

            /**
             * Client address used for rate limiting.
             *
             * @param string $ip
             */
            $ip = (string) apply_filters('svb_client_ip', $ip);

            return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
        }

        /**
         * Cleans a JSON payload of answers without flattening them.
         *
         * The payload used to be pushed through sanitize_text_field() as a single
         * blob, which collapses newlines and strips "<" - quietly mangling every
         * multi-line Paragraph answer - and then through stripslashes(), which
         * broke the JSON outright for any answer containing a quote. Decode once,
         * clean each value on its own terms, re-encode.
         *
         * @param string $raw Raw (unslashed) JSON string.
         * @return string JSON safe to store.
         */
        private static function sanitize_submission($raw)
        {
            if (!is_string($raw) || '' === $raw) {
                return '';
            }

            $decoded = json_decode($raw, true);

            if (JSON_ERROR_NONE !== json_last_error() || !is_array($decoded)) {
                // Not the shape we expect; keep it as one cleaned string rather
                // than dropping the submission on the floor.
                return sanitize_textarea_field($raw);
            }

            return (string) wp_json_encode(self::sanitize_value($decoded));
        }

        /**
         * Recursively sanitises one decoded answer.
         *
         * @param mixed $value Decoded value.
         * @return mixed Sanitised value of the same shape.
         */
        private static function sanitize_value($value)
        {
            if (is_array($value)) {
                $clean = [];

                foreach ($value as $key => $item) {
                    $clean[sanitize_text_field((string) $key)] = self::sanitize_value($item);
                }

                return $clean;
            }

            if (is_bool($value) || is_int($value) || is_float($value) || null === $value) {
                return $value;
            }

            // Preserves line breaks, unlike sanitize_text_field().
            return sanitize_textarea_field((string) $value);
        }
    }

    new BPSVB_Ajax();
}

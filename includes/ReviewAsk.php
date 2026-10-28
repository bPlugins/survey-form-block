<?php
/**
 * A one-time request for a WordPress.org review.
 *
 * Asked once a site has stored a number of responses, so it reaches people who
 * have actually used the plugin. Everyone gets the same plain request and the
 * same link: there is no "do you like it?" step that sends happy users to
 * WordPress.org and unhappy ones elsewhere. Shown only on the plugin's own
 * screens, to people who can manage it, never alongside the demos notice, and
 * gone for good once dismissed or followed (WordPress.org guideline 11).
 */

if (!defined('ABSPATH')) {exit;}

require_once __DIR__ . '/SurveyDataModel.php';

if (!class_exists('BPSVB_Review_Ask')) {
    class BPSVB_Review_Ask
    {
        /** User meta set once the request has been dismissed or followed. */
        const DISMISSED = 'bpsvb_review_ask_dismissed';

        const ACTION = 'svb_dismiss_review_ask';

        /** Stored responses before asking. Filter: svb_review_ask_threshold. */
        const THRESHOLD = 10;

        const REVIEW_URL = 'https://wordpress.org/support/plugin/survey-form-block/reviews/#new-post';

        public function __construct()
        {
            add_action('admin_notices', [$this, 'notice']);
            add_action('wp_ajax_' . self::ACTION, [$this, 'dismiss']);
        }

        /**
         * @param int  $responses     Responses stored on the site.
         * @param int  $threshold     Responses needed before asking.
         * @param bool $dismissed     Whether this user dismissed or followed it.
         * @param bool $demoNoticeOpen Whether the demos notice is still showing.
         * @return bool Whether to ask.
         */
        public static function shouldAsk($responses, $threshold, $dismissed, $demoNoticeOpen)
        {
            return !$dismissed && !$demoNoticeOpen && $threshold > 0 && $responses >= $threshold;
        }

        /**
         * @return void
         */
        public function notice()
        {
            $screen = get_current_screen();

            if (!$screen || !current_user_can('manage_options') || false === strpos((string) $screen->id, BPSVB_CPT_SLUG)) {
                return;
            }

            $user = get_current_user_id();
            $dismissed = (bool) get_user_meta($user, self::DISMISSED, true);

            // Checked before counting, so a dismissed request costs no query.
            if ($dismissed) {
                return;
            }

            $demoNoticeOpen = class_exists('BPSVB_ADMIN_MENU')
                && !get_user_meta($user, BPSVB_ADMIN_MENU::NOTICE_DISMISSED, true)
                && false === strpos((string) $screen->id, BPSVB_DASHBOARD_SLUG);

            $threshold = (int) apply_filters('svb_review_ask_threshold', self::THRESHOLD);
            $responses = (new BPSVB_Survey_Data_Model())->countAll();

            if (!self::shouldAsk($responses, $threshold, $dismissed, $demoNoticeOpen)) {
                return;
            }
            ?>
            <div class="notice notice-info is-dismissible svbReviewAsk" data-nonce="<?php echo esc_attr(wp_create_nonce(self::ACTION)); ?>">
                <p>
                    <?php
                    echo esc_html(sprintf(
                        /* translators: %s: number of survey responses. */
                        _n(
                            'Survey Form Block has collected %s response on this site. If it has been useful, would you leave a review on WordPress.org? It helps other site owners decide whether it suits them.',
                            'Survey Form Block has collected %s responses on this site. If it has been useful, would you leave a review on WordPress.org? It helps other site owners decide whether it suits them.',
                            $responses,
                            'survey-form-block'
                        ),
                        number_format_i18n($responses)
                    ));
                    ?>
                </p>
                <p>
                    <a href="<?php echo esc_url(self::REVIEW_URL); ?>" class="button button-primary svbReviewAskGo" target="_blank" rel="noopener noreferrer"><?php echo esc_html__('Write a review', 'survey-form-block'); ?></a>
                </p>
            </div>
            <script>
                document.addEventListener( 'click', function ( e ) {
                    var notice = e.target.closest && e.target.closest( '.svbReviewAsk' );

                    if ( ! notice || ! ( e.target.closest( '.notice-dismiss' ) || e.target.closest( '.svbReviewAskGo' ) ) ) {
                        return;
                    }

                    var body = new FormData();
                    body.append( 'action', <?php echo wp_json_encode(self::ACTION); ?> );
                    body.append( 'nonce', notice.getAttribute( 'data-nonce' ) );
                    fetch( <?php echo wp_json_encode(admin_url('admin-ajax.php')); ?>, { method: 'POST', credentials: 'same-origin', body: body } );

                    // Following the link answers the request too.
                    if ( e.target.closest( '.svbReviewAskGo' ) ) {
                        notice.remove();
                    }
                } );
            </script>
            <?php
        }

        /**
         * Remembers, per user, that the request was dismissed or followed.
         *
         * @return void
         */
        public function dismiss()
        {
            check_ajax_referer(self::ACTION, 'nonce');

            if (!current_user_can('manage_options')) {
                wp_send_json_error(null, 403);
            }

            update_user_meta(get_current_user_id(), self::DISMISSED, time());
            wp_send_json_success();
        }
    }

    new BPSVB_Review_Ask();
}

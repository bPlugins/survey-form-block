<?php
/**
 * When the one-time review request appears (includes/ReviewAsk.php).
 */

require_once dirname(__DIR__, 2) . '/includes/ReviewAsk.php';

svb_assert_same('review ask: not before the threshold', BPSVB_Review_Ask::shouldAsk(9, 10, false, false), false);
svb_assert_same('review ask: at the threshold', BPSVB_Review_Ask::shouldAsk(10, 10, false, false), true);
svb_assert_same('review ask: never again once dismissed or followed', BPSVB_Review_Ask::shouldAsk(500, 10, true, false), false);
svb_assert_same('review ask: never stacked on the demos notice', BPSVB_Review_Ask::shouldAsk(500, 10, false, true), false);
svb_assert_same('review ask: a threshold of 0 turns it off', BPSVB_Review_Ask::shouldAsk(500, 0, false, false), false);
svb_assert_same('review ask: links to the WordPress.org review form', BPSVB_Review_Ask::REVIEW_URL, 'https://wordpress.org/support/plugin/survey-form-block/reviews/#new-post');

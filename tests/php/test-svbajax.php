<?php
/**
 * Who may rewrite a survey's column labels (BPSVB_Ajax::canEditSurvey).
 *
 * Security: before 1.2 any user with edit_posts - a Contributor - could
 * overwrite the column map of any survey on the site.
 */

require_once dirname(__DIR__, 2) . '/includes/SVBAjax.php';

/** The current user's capabilities: 'edit_posts' => bool, post id => bool. */
$GLOBALS['svb_test_caps'] = [];

/** Posts that exist. */
$GLOBALS['svb_test_posts'] = [];

if (!function_exists('current_user_can')) {
    function current_user_can($cap, ...$args)
    {
        $key = 'edit_post' === $cap ? (int) $args[0] : $cap;

        return !empty($GLOBALS['svb_test_caps'][$key]);
    }
}

if (!function_exists('get_post')) {
    function get_post($id)
    {
        return in_array((int) $id, $GLOBALS['svb_test_posts'], true) ? (object) ['ID' => (int) $id] : null;
    }
}

/** The one $wpdb call the check makes: the owner of a form id. */
class SVB_Fake_Owner_WPDB
{
    public $prefix = 'wp_';
    public $owners = [];

    public function prepare($query, ...$args)
    {
        return $args;
    }

    public function get_var($prepared)
    {
        return $this->owners[$prepared[1]] ?? null;
    }
}

$savedWpdb = $GLOBALS['wpdb'] ?? null;
$GLOBALS['wpdb'] = new SVB_Fake_Owner_WPDB();
$GLOBALS['wpdb']->owners = ['owned' => '10', 'orphaned' => '99', 'legacy' => null];
$GLOBALS['svb_test_posts'] = [10];

// A Contributor: edit_posts, but not someone else's post 10.
$GLOBALS['svb_test_caps'] = ['edit_posts' => true];
svb_assert_same('contributor cannot rewrite a survey owned by a post they cannot edit', BPSVB_Ajax::canEditSurvey('owned'), false);
svb_assert_same('contributor can label a survey no post owns yet', BPSVB_Ajax::canEditSurvey('legacy'), true);
svb_assert_same('contributor can label an unknown survey', BPSVB_Ajax::canEditSurvey('new-survey'), true);
svb_assert_same('an owner post that no longer exists falls back to edit_posts', BPSVB_Ajax::canEditSurvey('orphaned'), true);

// The author of post 10, or an Editor.
$GLOBALS['svb_test_caps'] = ['edit_posts' => true, 10 => true];
svb_assert_same('whoever can edit the owner post can rewrite its labels', BPSVB_Ajax::canEditSurvey('owned'), true);

// A Subscriber.
$GLOBALS['svb_test_caps'] = [];
svb_assert_same('no edit_posts: refused even for an unowned survey', BPSVB_Ajax::canEditSurvey('legacy'), false);
svb_assert_same('no edit_posts: refused even with rights on the owner post', (function () {
    $GLOBALS['svb_test_caps'] = [10 => true];

    return BPSVB_Ajax::canEditSurvey('owned');
})(), false);

$GLOBALS['wpdb'] = $savedWpdb;

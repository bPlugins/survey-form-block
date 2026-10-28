<?php
/**
 * Response emails (includes/Notifications.php) and their settings
 * (includes/Options.php).
 */

require_once dirname(__DIR__, 2) . '/includes/Notifications.php';

// When to send.
svb_assert_same('first: sends for a first response', BPSVB_Notifications::shouldSend('first', true, 0, 30), true);
svb_assert_same('first: silent for later responses', BPSVB_Notifications::shouldSend('first', false, 0, 30), false);
svb_assert_same('each: sends under the hourly cap', BPSVB_Notifications::shouldSend('each', false, 29, 30), true);
svb_assert_same('each: stops at the hourly cap', BPSVB_Notifications::shouldSend('each', false, 30, 30), false);
svb_assert_same('each: a cap of 0 means no cap', BPSVB_Notifications::shouldSend('each', false, 500, 0), true);
svb_assert_same('off: never sends', BPSVB_Notifications::shouldSend('off', true, 0, 30), false);

// The message.
$message = BPSVB_Notifications::message([
    'site' => 'Acme',
    'survey' => "Customer NPS\r\nBcc: evil@example.com",
    'submitted' => '28 October 2026 10:00',
    'labels' => ['why' => 'Why?', 'nps' => 'How likely?'],
    'answers' => ['id' => 'f-1', 'title' => 'Customer NPS', 'creator_id' => 1, 'nps' => 0, 'why' => 'Too slow', 'tags' => ['a', 'b'], 'ok' => true],
    'isFirst' => true,
    'lastThisHour' => false,
    'responsesUrl' => 'https://example.test/wp-admin/edit.php?post_type=survey-form-block&page=survey-form-block',
]);

svb_assert_same('first-response subject, line breaks removed from the survey name', $message['subject'], '[Acme] First response to "Customer NPS Bcc: evil@example.com"');
svb_assert_same('body lists answers in survey order, then unmapped keys', strpos($message['body'], "Why?: Too slow\nHow likely?: 0\ntags: a, b\nok: Yes") !== false, true);
svb_assert_same('body leaves out bookkeeping keys', strpos($message['body'], 'creator_id') === false && strpos($message['body'], 'title:') === false, true);
svb_assert_same('body links to the responses screen', strpos($message['body'], 'All responses: https://example.test/') !== false, true);
svb_assert_same('body says how to turn emails off', strpos($message['body'], 'turn off these emails') !== false, true);

$later = BPSVB_Notifications::message(['site' => 'Acme', 'survey' => 'Poll', 'submitted' => 'now', 'labels' => [], 'answers' => ['q' => ''], 'isFirst' => false, 'lastThisHour' => true, 'responsesUrl' => 'u']);
svb_assert_same('later-response subject', $later['subject'], '[Acme] New response: Poll');
svb_assert_same('an empty answer shows a dash', strpos($later['body'], 'q: -') !== false, true);
svb_assert_same('the last email of the hour says emails pause', strpos($later['body'], 'emails resume next hour') !== false, true);

// Recipients.
svb_assert_same('empty means the admin email', BPSVB_Options::cleanEmailList(''), '');
svb_assert_same('a list is trimmed and de-duplicated', BPSVB_Options::cleanEmailList(' a@example.com, b@example.com ,a@example.com'), 'a@example.com, b@example.com');
svb_assert_same('any invalid address rejects the list', BPSVB_Options::cleanEmailList('a@example.com, not-an-email'), false);

// Wiring.
svb_assert_same('listens to svb_after_submission', isset($GLOBALS['svb_test_hooks']['svb_after_submission']), true);
svb_assert_same('settings save action is registered', isset($GLOBALS['svb_test_hooks']['wp_ajax_svb_save_notify_settings']), true);

// End to end through onSubmission(), with mail, options, transients and the
// two database reads stubbed.
if (!defined('HOUR_IN_SECONDS')) {
    define('HOUR_IN_SECONDS', 3600);
}

$GLOBALS['svb_mail'] = [];
$GLOBALS['svb_options'] = ['admin_email' => 'owner@example.com', 'blogname' => 'Acme', 'date_format' => 'Y-m-d', 'time_format' => 'H:i'];
$GLOBALS['svb_transients'] = [];

if (!function_exists('get_option')) {
    function get_option($key, $default = false) { return array_key_exists($key, $GLOBALS['svb_options']) ? $GLOBALS['svb_options'][$key] : $default; }
}
if (!function_exists('wp_parse_args')) {
    function wp_parse_args($args, $defaults) { return array_merge($defaults, (array) $args); }
}
if (!function_exists('get_transient')) {
    function get_transient($key) { return isset($GLOBALS['svb_transients'][$key]) ? $GLOBALS['svb_transients'][$key] : false; }
}
if (!function_exists('set_transient')) {
    function set_transient($key, $value, $ttl = 0) { $GLOBALS['svb_transients'][$key] = $value; return true; }
}
if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value) { return $value; }
}
if (!function_exists('wp_mail')) {
    function wp_mail($to, $subject, $body) { $GLOBALS['svb_mail'][] = compact('to', 'subject', 'body'); return true; }
}
if (!function_exists('get_bloginfo')) {
    function get_bloginfo($key) { return get_option('blogname'); }
}
if (!function_exists('wp_specialchars_decode')) {
    function wp_specialchars_decode($text, $quote = 0) { return htmlspecialchars_decode($text, ENT_QUOTES); }
}
if (!function_exists('wp_date')) {
    function wp_date($format) { return '2026-10-28 10:00'; }
}
if (!function_exists('admin_url')) {
    function admin_url($path = '') { return 'https://example.test/wp-admin/' . $path; }
}
if (!defined('BPSVB_CPT_SLUG')) {
    define('BPSVB_CPT_SLUG', 'survey-form-block');
    define('BPSVB_MENU_SLUG', 'survey-form-block');
}

/** Answers COUNT(*) with a set number and the column map with one label. */
class SVB_Count_WPDB
{
    public $prefix = 'wp_';
    public $count = 1;

    public function prepare($query, ...$args) { return $query; }

    public function get_var($query)
    {
        return false !== strpos($query, 'COUNT(*)') ? $this->count : json_encode(['nps' => 'How likely?']);
    }
}

$GLOBALS['wpdb'] = new SVB_Count_WPDB();
$notifier = new BPSVB_Notifications();

// Default mode is "first".
$GLOBALS['wpdb']->count = 1;
$notifier->onSubmission(1, 'f-1', ['nps' => 9], 'Customer NPS');
$GLOBALS['wpdb']->count = 2;
$notifier->onSubmission(2, 'f-1', ['nps' => 4], 'Customer NPS');
svb_assert_same('default mode emails the first response only', count($GLOBALS['svb_mail']), 1);
svb_assert_same('it goes to the admin email', $GLOBALS['svb_mail'][0]['to'], 'owner@example.com');
svb_assert_same('with the labelled answer', strpos($GLOBALS['svb_mail'][0]['body'], 'How likely?: 9') !== false, true);

// "Every response" to a custom address: 35 responses in one hour, default cap 30.
$GLOBALS['svb_mail'] = [];
$GLOBALS['svb_transients'] = [];
$GLOBALS['svb_options']['bpsvb_options'] = ['notify_mode' => 'each', 'notify_email' => 'team@example.com'];

for ($i = 0; $i < 35; $i++) {
    $notifier->onSubmission(10 + $i, 'f-1', ['nps' => 5], 'Customer NPS');
}
svb_assert_same('every-response mode stops at the default cap of 30 an hour', count($GLOBALS['svb_mail']), 30);
svb_assert_same('to the chosen address', $GLOBALS['svb_mail'][0]['to'], 'team@example.com');
svb_assert_same('the 30th email says emails pause', strpos($GLOBALS['svb_mail'][29]['body'], 'emails resume next hour') !== false, true);

// Off.
$GLOBALS['svb_mail'] = [];
$GLOBALS['svb_options']['bpsvb_options'] = ['notify_mode' => 'off'];
$GLOBALS['wpdb']->count = 1;
$notifier->onSubmission(99, 'f-2', ['nps' => 1], 'Other');
svb_assert_same('off sends nothing', count($GLOBALS['svb_mail']), 0);

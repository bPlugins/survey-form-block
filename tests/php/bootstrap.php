<?php
/**
 * Minimal harness for the plugin's pure PHP helpers.
 *
 * No WordPress, no database: just enough stubs for the classes under test to
 * load, and a tiny assertion helper. Run with `php tests/php/run.php`.
 */

define('ABSPATH', __DIR__ . '/');

$GLOBALS['svb_test_failures'] = 0;
$GLOBALS['svb_test_count'] = 0;
$GLOBALS['svb_test_hooks'] = [];

function add_action($hook, $callback, $priority = 10, $args = 1) { $GLOBALS['svb_test_hooks'][$hook][] = $callback; }
function add_filter($hook, $callback, $priority = 10, $args = 1) { $GLOBALS['svb_test_hooks'][$hook][] = $callback; }
function __($text, $domain = 'default') { return $text; }
function esc_html__($text, $domain = 'default') { return $text; }
function wp_json_encode($data) { return json_encode($data); }
function wp_strip_all_tags($text) { return trim(strip_tags($text)); }
function sanitize_title($title) { return trim(preg_replace('/[^a-z0-9]+/', '-', strtolower(strip_tags($title))), '-'); }
function sanitize_text_field($text) { return trim(strip_tags((string) $text)); }
function sanitize_key($key) { return preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $key)); }
function sanitize_email($email) { return filter_var(trim((string) $email), FILTER_SANITIZE_EMAIL); }
function is_email($email) { return (bool) filter_var($email, FILTER_VALIDATE_EMAIL); }

/**
 * @param string $name
 * @param mixed  $actual
 * @param mixed  $expected
 */
function svb_assert_same($name, $actual, $expected)
{
    $GLOBALS['svb_test_count']++;

    if ($actual === $expected) {
        echo "PASS  {$name}\n";
        return;
    }

    $GLOBALS['svb_test_failures']++;
    echo "FAIL  {$name}\n      expected: " . var_export($expected, true) . "\n      actual:   " . var_export($actual, true) . "\n";
}

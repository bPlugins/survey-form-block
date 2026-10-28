<?php
/**
 * Runs every tests/php/test-*.php file. Exit code 1 on any failure.
 *
 * Usage: php tests/php/run.php
 */

require __DIR__ . '/bootstrap.php';

foreach (glob(__DIR__ . '/test-*.php') as $file) {
    echo "\n# " . basename($file) . "\n";
    require $file;
}

$failures = $GLOBALS['svb_test_failures'];
echo "\n" . ($GLOBALS['svb_test_count'] - $failures) . '/' . $GLOBALS['svb_test_count'] . " passed\n";
exit($failures ? 1 : 0);

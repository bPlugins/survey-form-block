<?php
/**
 * CSV export formatting (includes/Export.php).
 */

require_once dirname(__DIR__, 2) . '/includes/Export.php';

// Cells.
svb_assert_same('text passes through', BPSVB_Export::cell('Great service'), 'Great service');
svb_assert_same('a list becomes comma-separated', BPSVB_Export::cell(['a', 'b']), 'a, b');
svb_assert_same('legacy true becomes Yes', BPSVB_Export::cell(true), 'Yes');
svb_assert_same('legacy false becomes No', BPSVB_Export::cell(false), 'No');
svb_assert_same('null becomes empty', BPSVB_Export::cell(null), '');
svb_assert_same('NPS 0 stays 0', BPSVB_Export::cell(0), '0');
svb_assert_same('a negative number stays a number', BPSVB_Export::cell('-5'), '-5');
svb_assert_same('a formula is defused (=)', BPSVB_Export::cell('=HYPERLINK("http://x","y")'), "'=HYPERLINK(\"http://x\",\"y\")");
svb_assert_same('a formula is defused (+)', BPSVB_Export::cell('+1+1'), "'+1+1");
svb_assert_same('a formula is defused (-)', BPSVB_Export::cell('-cmd'), "'-cmd");
svb_assert_same('a formula is defused (@)', BPSVB_Export::cell('@SUM(A1)'), "'@SUM(A1)");
svb_assert_same('a leading tab is defused', BPSVB_Export::cell("\t=1"), "'\t=1");
svb_assert_same('an ISO date passes through', BPSVB_Export::cell('2026-10-28'), '2026-10-28');

// Columns.
svb_assert_same(
    'labels are stripped of tags and entities, in map order',
    BPSVB_Export::columns(['f1' => '<strong>Name</strong>', 'f2' => 'Q&amp;A']),
    ['f1' => 'Name', 'f2' => 'Q&A']
);
svb_assert_same(
    'an empty label falls back to the field id',
    BPSVB_Export::columns(['f1' => '']),
    ['f1' => 'f1']
);
svb_assert_same(
    'answer keys missing from the map are appended once',
    BPSVB_Export::columns(['f1' => 'Name'], ['old', 'f1']),
    ['f1' => 'Name', 'old' => 'old']
);

// File names.
svb_assert_same('file name from the survey name', BPSVB_Export::filename('Customer NPS & CSAT', '2026-10-28'), 'customer-nps-csat-responses-2026-10-28.csv');
svb_assert_same('file name for a nameless survey', BPSVB_Export::filename('', '2026-10-28'), 'survey-responses-2026-10-28.csv');

// The handler is wired to admin-post.php.
svb_assert_same('download is hooked to admin_post', isset($GLOBALS['svb_test_hooks']['admin_post_svb_export_csv']), true);

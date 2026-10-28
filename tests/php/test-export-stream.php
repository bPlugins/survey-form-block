<?php
/**
 * CSV export end to end against an in-memory stand-in for $wpdb.
 */

require_once dirname(__DIR__, 2) . '/includes/Export.php';

if (!defined('ARRAY_A')) {
    define('ARRAY_A', 'ARRAY_A');
}

/** Just the three $wpdb calls the exporter makes. */
class SVB_Fake_WPDB
{
    public $prefix = 'wp_';
    public $tables = ['wp_svb_data' => [], 'wp_svb_columns' => []];
    public $queries = 0;

    public function prepare($query, ...$args)
    {
        return ['sql' => $query, 'args' => $args];
    }

    public function get_row($prepared, $output = null)
    {
        list($table, $form_id) = $prepared['args'];

        foreach ($this->tables[$table] as $row) {
            if ($row['form_id'] === $form_id) {
                return $row;
            }
        }

        return null;
    }

    public function get_results($prepared, $output = null)
    {
        $this->queries++;
        list($table, $form_id, $after, $limit) = $prepared['args'];

        $rows = array_values(array_filter($this->tables[$table], function ($row) use ($form_id, $after) {
            return $row['form_id'] === $form_id && $row['id'] > $after;
        }));

        usort($rows, function ($a, $b) {
            return $a['id'] - $b['id'];
        });

        return array_slice($rows, 0, $limit);
    }
}

$GLOBALS['wpdb'] = new SVB_Fake_WPDB();
$db = $GLOBALS['wpdb'];

$db->tables['wp_svb_columns'][] = ['form_id' => 'f-1', 'form_name' => 'Customer NPS', 'columns' => json_encode(['nps' => 'How likely?', 'why' => 'Why?'])];

$id = 0;
for ($i = 0; $i < 1203; $i++) {
    $db->tables['wp_svb_data'][] = ['id' => ++$id, 'form_id' => 'f-1', 'created_at' => '2026-10-28 10:00:00', 'data' => json_encode(['id' => 'f-1', 'title' => 'Customer NPS', 'creator_id' => 1, 'nps' => $i % 11, 'why' => "Answer {$i}"])];
}

// A response to a question deleted later, one stored in the pre-1.1 escaped
// format, one with a formula, and another survey's rows that must stay out.
$db->tables['wp_svb_data'][] = ['id' => ++$id, 'form_id' => 'f-1', 'created_at' => '2026-10-28 11:00:00', 'data' => json_encode(['nps' => 10, 'removed_q' => 'old answer'])];
$db->tables['wp_svb_data'][] = ['id' => ++$id, 'form_id' => 'f-1', 'created_at' => '2026-10-28 11:01:00', 'data' => addslashes(json_encode(['nps' => 3, 'why' => 'Said "hi"']))];
$db->tables['wp_svb_data'][] = ['id' => ++$id, 'form_id' => 'f-1', 'created_at' => '2026-10-28 11:02:00', 'data' => json_encode(['nps' => 0, 'why' => '=1+1'])];
$db->tables['wp_svb_data'][] = ['id' => ++$id, 'form_id' => 'other', 'created_at' => '2026-10-28 12:00:00', 'data' => json_encode(['nps' => 9])];

ob_start();
BPSVB_Export::stream('f-1');
$csv = ob_get_clean();

svb_assert_same('starts with a UTF-8 byte-order mark', substr($csv, 0, 3), "\xEF\xBB\xBF");

$lines = array_map(function ($line) {
    return str_getcsv($line, ',', '"', '');
}, array_values(array_filter(explode("\n", substr($csv, 3)), 'strlen')));

svb_assert_same('header row: id, submitted, mapped labels, then unmapped keys', $lines[0], ['Response ID', 'Submitted', 'How likely?', 'Why?', 'removed_q']);
svb_assert_same('every response of the survey is exported (no 2,000 cap, no other survey)', count($lines) - 1, 1206);
svb_assert_same('first data row', $lines[1], ['1', '2026-10-28 10:00:00', '0', 'Answer 0', '']);
svb_assert_same('read in batches of 500', $db->queries >= 2 * 3, true);
svb_assert_same('a deleted question keeps its column', $lines[1204], ['1204', '2026-10-28 11:00:00', '10', '', 'old answer']);
svb_assert_same('a pre-1.1 escaped row decodes', $lines[1205], ['1205', '2026-10-28 11:01:00', '3', 'Said "hi"', '']);
svb_assert_same('an NPS 0 and a defused formula', $lines[1206], ['1206', '2026-10-28 11:02:00', '0', "'=1+1", '']);

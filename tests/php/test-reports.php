<?php
/**
 * Results summary (includes/Reports.php): NPS, CSAT and per-type counts.
 */

require_once dirname(__DIR__, 2) . '/includes/Reports.php';

/**
 * @param array[] $answers One answers array per response, oldest first.
 * @return array[] Rows as the AJAX handler builds them.
 */
function svb_test_rows($answers)
{
    $rows = [];

    foreach ($answers as $i => $set) {
        $rows[] = ['created_at' => sprintf('2026-10-%02d 09:00:00', $i + 1), 'answers' => $set];
    }

    return $rows;
}

/**
 * @param array $summary
 * @param string $id
 * @return array The summary of one question.
 */
function svb_test_question($summary, $id)
{
    foreach ($summary['questions'] as $question) {
        if ($question['id'] === $id) {
            return $question;
        }
    }

    return [];
}

$schema = [
    ['id' => 'nps', 'type' => 'nps', 'label' => 'How likely?', 'required' => true],
    ['id' => 'stars', 'type' => 'star_rating', 'label' => 'Rate us', 'required' => false, 'max' => 5],
    ['id' => 'scale', 'type' => 'opinion_scale', 'label' => 'Ease', 'required' => false],
    ['id' => 'budget', 'type' => 'range_slider', 'label' => 'Budget', 'required' => false, 'min' => 0, 'max' => 100],
    ['id' => 'plan', 'type' => 'radio', 'label' => 'Plan', 'required' => false, 'options' => [
        ['value' => 'free', 'label' => 'Free'],
        ['value' => 'pro', 'label' => 'Pro'],
        ['value' => 'agency', 'label' => 'Agency'],
    ]],
    ['id' => 'uses', 'type' => 'checkbox', 'label' => 'Uses', 'required' => false, 'options' => [
        ['value' => 'nps', 'label' => 'NPS'],
        ['value' => 'csat', 'label' => 'CSAT'],
    ]],
    ['id' => 'sub', 'type' => 'toggle', 'label' => 'Subscribe?', 'required' => false, 'on' => 'Yes', 'off' => 'No'],
    ['id' => 'why', 'type' => 'paragraph', 'label' => 'Why?', 'required' => false],
    ['id' => 'mail', 'type' => 'email', 'label' => '', 'required' => false],
];

$rows = svb_test_rows([
    ['nps' => 10, 'stars' => 5, 'scale' => 8, 'budget' => 10, 'plan' => 'free', 'uses' => ['nps', 'csat'], 'sub' => true, 'why' => 'one', 'mail' => 'a@example.com'],
    ['nps' => 9, 'stars' => 4, 'scale' => 6, 'budget' => '20.5', 'plan' => 'pro', 'uses' => ['nps'], 'sub' => false, 'why' => 'two'],
    ['nps' => 8, 'stars' => 3, 'scale' => '', 'budget' => 'abc', 'plan' => 'free', 'uses' => [], 'sub' => 'Yes', 'why' => 'three'],
    ['nps' => 7, 'stars' => 0, 'plan' => 'retired-option', 'sub' => 'No', 'why' => ''],
    ['nps' => 6, 'stars' => '2', 'why' => 'five'],
    ['nps' => 0, 'why' => 'six'],
    ['nps' => '10', 'why' => 'seven'],
    ['nps' => '', 'why' => 'eight'],
    ['nps' => null],
]);

$summary = BPSVB_Reports::summarize($schema, $rows);

svb_assert_same('summary: total responses', $summary['total'], 9);
svb_assert_same('summary: first and last submission', [$summary['first'], $summary['last']], ['2026-10-01 09:00:00', '2026-10-09 09:00:00']);
svb_assert_same('summary: built from a schema', $summary['hasSchema'], true);
svb_assert_same('summary: one entry per question, in survey order', array_column($summary['questions'], 'id'), ['nps', 'stars', 'scale', 'budget', 'plan', 'uses', 'sub', 'why', 'mail']);

// NPS: 10, 9, '10' promote; 8, 7 pass; 6, 0 detract. '' and null are unanswered.
$nps = svb_test_question($summary, 'nps');
svb_assert_same('nps: a score of 0 counts as an answer', $nps['answered'], 7);
svb_assert_same('nps: promoters / passives / detractors', [$nps['promoters'], $nps['passives'], $nps['detractors']], [3, 2, 2]);
svb_assert_same('nps: score is %promoters - %detractors, rounded', $nps['score'], 14);
svb_assert_same('nps: distribution covers 0-10', array_column($nps['distribution'], 'value'), range(0, 10));
svb_assert_same('nps: distribution counts', array_column($nps['distribution'], 'count'), [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2]);

$allDetractors = BPSVB_Reports::summarize([$schema[0]], svb_test_rows([['nps' => 0], ['nps' => 3]]));
svb_assert_same('nps: all detractors is -100', svb_test_question($allDetractors, 'nps')['score'], -100);

$noAnswers = BPSVB_Reports::summarize([$schema[0]], []);
svb_assert_same('nps: no answers gives no score, not 0', svb_test_question($noAnswers, 'nps')['score'], null);
svb_assert_same('summary: no responses has no dates', [$noAnswers['total'], $noAnswers['first'], $noAnswers['last']], [0, null, null]);

// Stars: 0 means the visitor cleared the rating.
$stars = svb_test_question($summary, 'stars');
svb_assert_same('stars: a cleared rating (0) is not an answer', $stars['answered'], 4);
svb_assert_same('stars: average', $stars['average'], 3.5);
svb_assert_same('stars: CSAT is the share of 4 and 5', $stars['csat'], 50);
svb_assert_same('stars: distribution 1-5', array_column($stars['distribution'], 'count'), [0, 1, 1, 1, 1]);

$seven = BPSVB_Reports::summarize([['id' => 's', 'type' => 'star_rating', 'label' => 'S', 'max' => 7]], svb_test_rows([['s' => 7], ['s' => 6], ['s' => 5]]));
svb_assert_same('stars: CSAT on a 7-star scale uses 6 and 7', svb_test_question($seven, 's')['csat'], 67);

$scale = svb_test_question($summary, 'scale');
svb_assert_same('opinion scale: average of answered points', [$scale['answered'], $scale['average']], [2, 7.0]);
svb_assert_same('opinion scale: distribution covers 1-10', array_column($scale['distribution'], 'value'), range(1, 10));

$budget = svb_test_question($summary, 'budget');
svb_assert_same('range: non-numeric answers are ignored', $budget['answered'], 2);
svb_assert_same('range: average, lowest, highest', [$budget['average'], $budget['min'], $budget['max']], [15.3, 10.0, 20.5]);

$plan = svb_test_question($summary, 'plan');
svb_assert_same('choice: option order kept, unanswered options listed, retired answers appended', $plan['options'], [
    ['label' => 'Free', 'count' => 2],
    ['label' => 'Pro', 'count' => 1],
    ['label' => 'Agency', 'count' => 0],
    ['label' => 'retired-option', 'count' => 1],
]);

$uses = svb_test_question($summary, 'uses');
svb_assert_same('checkbox: an empty selection is not an answer', $uses['answered'], 2);
svb_assert_same('checkbox: each pick counted', $uses['options'], [['label' => 'NPS', 'count' => 2], ['label' => 'CSAT', 'count' => 1]]);

$sub = svb_test_question($summary, 'sub');
svb_assert_same('toggle: pre-1.1 true/false answers count as the on/off labels', $sub['options'], [['label' => 'Yes', 'count' => 2], ['label' => 'No', 'count' => 2]]);

$why = svb_test_question($summary, 'why');
svb_assert_same('text: answered count skips blanks', $why['answered'], 7);
svb_assert_same('text: five newest answers, newest first', $why['latest'], ['eight', 'seven', 'six', 'five', 'three']);

$mail = svb_test_question($summary, 'mail');
svb_assert_same('other types: answered count only', [$mail['kind'], $mail['answered']], ['count', 1]);
svb_assert_same('a question without a label falls back to its id', $mail['label'], 'mail');

// No post holds the survey any more: fall back to the column map and the answers.
$orphan = BPSVB_Reports::summarize(null, svb_test_rows([
    ['id' => 'svb-x', 'title' => 'Old', 'creator_id' => 1, 'q1' => 'a', 'q9' => 'b'],
]), ['q1' => 'First &amp; <b>only</b>']);

svb_assert_same('no schema: flagged', $orphan['hasSchema'], false);
svb_assert_same('no schema: column map keys, then answer keys, without bookkeeping', array_column($orphan['questions'], 'id'), ['q1', 'q9']);
svb_assert_same('no schema: labels from the column map as plain text', array_column($orphan['questions'], 'label'), ['First & only', 'q9']);
svb_assert_same('no schema: questions are count-only', array_column($orphan['questions'], 'kind'), ['count', 'count']);

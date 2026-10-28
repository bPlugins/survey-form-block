<?php
/**
 * Server-side survey schema (includes/SchemaIndex.php): reading question
 * types and options out of the block attributes.
 */

require_once dirname(__DIR__, 2) . '/includes/SchemaIndex.php';

$schema = BPSVB_Schema_Index::fieldSchema([
    ['id' => 'q1', 'type' => 'nps', 'label' => '<strong>How likely</strong> are you to recommend us?', 'isRequired' => true],
    ['id' => 'sec', 'type' => 'section', 'label' => 'About you'],
    ['id' => 'off', 'type' => 'text', 'label' => 'Hidden', 'isDisable' => true],
    ['id' => 'untyped', 'label' => 'No type'],
    ['type' => 'text', 'label' => 'No id'],
    ['id' => 'q2', 'type' => 'radio', 'label' => 'Plan', 'options' => [
        ['label' => 'Free &amp; open', 'value' => 'free'],
        ['label' => 'Pro', 'value' => 'pro'],
        ['label' => 'Empty value', 'value' => ''],
    ]],
    ['id' => 'q3', 'type' => 'star_rating', 'label' => 'Rate us'],
    ['id' => 'q4', 'type' => 'star_rating', 'label' => 'Rate us', 'maxStars' => 7],
    ['id' => 'q5', 'type' => 'range_slider', 'label' => 'Budget', 'min' => '10', 'max' => 'abc'],
    ['id' => 'q6', 'type' => 'toggle', 'label' => 'Subscribe?', 'onLabel' => 'Sure', 'offLabel' => ''],
]);

svb_assert_same('fieldSchema: section, disabled, untyped and id-less fields are left out', array_column($schema, 'id'), ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']);
svb_assert_same('fieldSchema: label is plain text', $schema[0]['label'], 'How likely are you to recommend us?');
svb_assert_same('fieldSchema: required flag', [$schema[0]['required'], $schema[1]['required']], [true, false]);
svb_assert_same('fieldSchema: NPS has no options key', array_key_exists('options', $schema[0]), false);
svb_assert_same('fieldSchema: choice options keep order, decode entities, drop empty values', $schema[1]['options'], [
    ['value' => 'free', 'label' => 'Free & open'],
    ['value' => 'pro', 'label' => 'Pro'],
]);
svb_assert_same('fieldSchema: stars default to 5', $schema[2]['max'], 5);
svb_assert_same('fieldSchema: stars keep a custom count', $schema[3]['max'], 7);
svb_assert_same('fieldSchema: range keeps numeric bounds, defaults the rest', [$schema[4]['min'], $schema[4]['max']], [10.0, 100.0]);
svb_assert_same('fieldSchema: toggle labels, blank falls back to No', [$schema[5]['on'], $schema[5]['off']], ['Sure', 'No']);

// Finding surveys in a parsed post, nested ones included.
$blocks = [
    ['blockName' => 'core/paragraph', 'attrs' => [], 'innerBlocks' => []],
    ['blockName' => 'svb/survey-block', 'attrs' => [
        'form' => ['id' => 'svb-a', 'title' => 'Customer <em>NPS</em>'],
        'fields' => [['id' => 'q1', 'type' => 'nps', 'label' => 'Score']],
    ], 'innerBlocks' => []],
    ['blockName' => 'core/group', 'attrs' => [], 'innerBlocks' => [
        ['blockName' => 'core/columns', 'attrs' => [], 'innerBlocks' => [
            ['blockName' => 'svb/survey-block', 'attrs' => [
                'form' => ['id' => 'svb-b'],
                'fields' => [['id' => 'q1', 'type' => 'text', 'label' => 'Why?']],
            ], 'innerBlocks' => []],
        ]],
    ]],
    // Inserted but never given an id (pre-1.2 pattern insert, editor not yet loaded).
    ['blockName' => 'svb/survey-block', 'attrs' => ['form' => ['id' => ''], 'fields' => []], 'innerBlocks' => []],
    // Block left with its default attributes, which are not serialised.
    ['blockName' => 'svb/survey-block', 'attrs' => [], 'innerBlocks' => []],
    // Freeform HTML between blocks.
    ['blockName' => null, 'attrs' => [], 'innerBlocks' => [], 'innerHTML' => "\n"],
];

$found = BPSVB_Schema_Index::surveysInBlocks($blocks);

svb_assert_same('surveysInBlocks: top-level and nested surveys, skipping ones without an id or fields', array_column($found, 'form_id'), ['svb-a', 'svb-b']);
svb_assert_same('surveysInBlocks: survey name is plain text', $found[0]['form_name'], 'Customer NPS');
svb_assert_same('surveysInBlocks: missing title is an empty name', $found[1]['form_name'], '');
svb_assert_same('surveysInBlocks: fields go through fieldSchema', $found[1]['fields'], [['id' => 'q1', 'type' => 'text', 'label' => 'Why?', 'required' => false]]);
svb_assert_same('surveysInBlocks: empty input', BPSVB_Schema_Index::surveysInBlocks([]), []);

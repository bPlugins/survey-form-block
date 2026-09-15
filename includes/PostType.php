<?php
/**
 * Reusable surveys.
 *
 * A survey normally lives as a block on whichever page it appears on, which
 * makes it awkward to show the same one in several places. This post type gives
 * a survey somewhere of its own to live: each entry holds exactly one survey
 * block, and is printed wherever you like with the shortcode
 *
 *     [survey-form-block id="123"]
 *
 * Same arrangement as the sibling offcanvas-block plugin. Surveys already
 * placed directly on a page keep working exactly as before; this is an
 * additional way to author one, not a replacement.
 */

if (!defined('ABSPATH')) {exit;}

if (!class_exists('BPSVB_Post_Type')) {
    class BPSVB_Post_Type
    {
        const NAME = 'survey-form-block';

        const BLOCK = 'svb/survey-block';

        public function __construct()
        {
            add_action('init', [$this, 'register']);

            add_filter('manage_' . self::NAME . '_posts_columns', [$this, 'columns']);
            add_action('manage_' . self::NAME . '_posts_custom_column', [$this, 'column'], 10, 2);
            add_action('admin_enqueue_scripts', [$this, 'assets']);
        }

        /**
         * @return void
         */
        public function register()
        {
            register_post_type(
                self::NAME,
                [
                    'label'              => __('Surveys', 'survey-form-block'),
                    'labels'             => [
                        'name'               => __('Surveys', 'survey-form-block'),
                        'singular_name'      => __('Survey', 'survey-form-block'),
                        'add_new'            => __('Add New Survey', 'survey-form-block'),
                        'add_new_item'       => __('Add New Survey', 'survey-form-block'),
                        'edit_item'          => __('Edit Survey', 'survey-form-block'),
                        'new_item'           => __('New Survey', 'survey-form-block'),
                        'view_item'          => __('View Survey', 'survey-form-block'),
                        'search_items'       => __('Search Surveys', 'survey-form-block'),
                        'not_found'          => __('No surveys found', 'survey-form-block'),
                        'not_found_in_trash' => __('No surveys found in Trash', 'survey-form-block'),
                        'all_items'          => __('Surveys', 'survey-form-block'),
                        'menu_name'          => __('Surveys', 'survey-form-block'),
                    ],
                    'supports'           => ['title', 'editor', 'revisions'],
                    'show_in_rest'       => true,
                    'public'             => true,
                    // Reachable only through the shortcode; there is no useful
                    // single view for a bare survey at its own URL.
                    'publicly_queryable' => false,
                    'exclude_from_search' => true,
                    'has_archive'        => false,
                    'rewrite'            => false,
                    // Hangs off the plugin's existing top-level menu rather than
                    // adding a second one beside it.
                    'show_in_menu'       => BPSVB_MENU_SLUG,
                    'menu_icon'          => 'dashicons-feedback',
                    // One survey per entry, and it cannot be removed or joined
                    // by other blocks, so the shortcode always has exactly one
                    // thing to print.
                    'template'           => [[self::BLOCK]],
                    'template_lock'      => 'all',
                ]
            );
        }

        /**
         * Adds the ShortCode column, keeping Date last.
         *
         * @param array $columns
         * @return array
         */
        public function columns($columns)
        {
            $date = isset($columns['date']) ? $columns['date'] : null;
            unset($columns['date']);

            $columns['shortcode'] = __('ShortCode', 'survey-form-block');

            if (null !== $date) {
                $columns['date'] = $date;
            }

            return $columns;
        }

        /**
         * @param string $column
         * @param int    $postId
         * @return void
         */
        public function column($column, $postId)
        {
            if ('shortcode' !== $column) {
                return;
            }

            $shortcode = sprintf('[%s id="%d"]', BPSVB_Shortcode::TAG, $postId);

            printf(
                '<span class="bPlAdminShortcode" id="bPlAdminShortcode-%1$d">
                    <input type="text" value="%2$s" size="%4$d" readonly data-svb-shortcode="%1$d">
                    <span class="tooltip">%3$s</span>
                </span>',
                (int) $postId,
                esc_attr($shortcode),
                esc_html__('Copy To Clipboard', 'survey-form-block'),
                // Without this the field keeps its 20-character default and
                // cuts the id off halfway.
                strlen($shortcode) + 1
            );
        }

        /**
         * The click-to-copy behaviour, on the survey list screen only.
         *
         * @return void
         */
        public function assets()
        {
            $screen = get_current_screen();

            if (!$screen || 'edit' !== $screen->base || self::NAME !== $screen->post_type) {
                return;
            }

            $assetFile = BPSVB_PATH . 'build/admin-post.asset.php';
            $assets = file_exists($assetFile)
                ? include $assetFile
                : ['dependencies' => ['wp-i18n'], 'version' => BPSVB_PLUGIN_VERSION];

            wp_enqueue_script('svb-admin-post', BPSVB_DIR . 'build/admin-post.js', $assets['dependencies'], BPSVB_PLUGIN_VERSION, true);
            wp_enqueue_style('svb-admin-post', BPSVB_DIR . 'build/admin-post.css', [], BPSVB_PLUGIN_VERSION);
            wp_set_script_translations('svb-admin-post', 'survey-form-block', BPSVB_PATH . 'languages');
        }
    }

    new BPSVB_Post_Type();
}

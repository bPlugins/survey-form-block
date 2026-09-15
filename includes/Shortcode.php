<?php
/**
 * [survey-form-block id="123"]
 *
 * Prints the survey held by that entry of the Surveys post type, wherever the
 * shortcode is used: a page, a post, a widget, or a theme template via
 * do_shortcode(). Same arrangement as the sibling offcanvas-block plugin.
 *
 * The id is a post id, so copy the ready-made shortcode from the ShortCode
 * column on Survey Forms -> Surveys rather than typing one.
 */

if (!defined('ABSPATH')) {exit;}

if (!class_exists('BPSVB_Shortcode')) {
    class BPSVB_Shortcode
    {
        const TAG = 'survey-form-block';

        /**
         * Entries currently being printed, keyed by post id.
         *
         * A survey entry is locked to a single survey block, so it cannot hold
         * a shortcode pointing back at itself - but a filter on the_content
         * could add one, and unguarded that recurses until PHP dies.
         *
         * @var array
         */
        private static $rendering = [];

        public function __construct()
        {
            add_shortcode(self::TAG, [$this, 'render']);
        }

        /**
         * @param array|string $atts
         * @return string
         */
        public function render($atts)
        {
            $atts = shortcode_atts(['id' => 0], $atts, self::TAG);
            $postId = absint($atts['id']);

            if (!$postId) {
                return '';
            }

            $post = get_post($postId);

            // Deliberately stricter than offcanvas-block, which will print any
            // post id it is handed. Without this check the shortcode doubles as
            // a way to print the content of any post on the site.
            if (!$post || BPSVB_Post_Type::NAME !== $post->post_type) {
                return '';
            }

            if (post_password_required($post)) {
                return get_the_password_form($post);
            }

            switch ($post->post_status) {
                case 'publish':
                    return $this->displayContent($post);

                case 'private':
                    if (current_user_can('read_post', $post->ID)) {
                        return $this->displayContent($post);
                    }

                    return '';

                case 'draft':
                case 'pending':
                case 'future':
                    if (current_user_can('edit_post', $post->ID)) {
                        return $this->displayContent($post);
                    }

                    return '';

                default:
                    return '';
            }
        }

        /**
         * Runs the entry's content through the_content, so the survey block
         * renders and its own script and stylesheet are enqueued.
         *
         * @param WP_Post $post
         * @return string
         */
        private function displayContent($post)
        {
            if (isset(self::$rendering[$post->ID])) {
                return '';
            }

            self::$rendering[$post->ID] = true;

            $content = apply_filters('the_content', $post->post_content);

            unset(self::$rendering[$post->ID]);

            return $content;
        }
    }

    new BPSVB_Shortcode();
}

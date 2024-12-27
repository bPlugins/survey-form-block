<?php
if (!defined('ABSPATH')) {exit;}

if(!class_exists('SVB_ADMIN_MENU')) {
    class SVB_ADMIN_MENU
    {
        public function __construct()
        {
            add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
            add_action('admin_menu', [$this, 'adminMenu']);
        }

        public function adminEnqueueScripts()
        {

            wp_register_script('svb-data-table-script', SVB_DIR . 'inc/assets/js/DataTable.min.js', [], SVB_PLUGIN_VERSION, true);
            wp_register_script('svb-tailwind-script', SVB_DIR . 'inc/assets/js/tailwind.min.js', [], SVB_PLUGIN_VERSION, true);

            wp_register_script('svb-admin-script', SVB_DIR . 'dist/admin-script.js', ['svb-data-table-script', 'svb-tailwind-script', 'react', 'react-dom'], SVB_PLUGIN_VERSION, true);

            wp_localize_script('svb-admin-script', 'svbData', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('wp_ajax'),
            ]);

        }

        public function adminMenu()
        {
            $menuIcon = "<svg xmlns='http://www.w3.org/2000/svg' fill='#fff' width='20px' height='20px' viewBox='0 0 100 100' enable-background='new 0 0 100 100'><g><path d='M24,23h44c2.2,0,4,1.8,4,4v4c0,2.2-1.8,4-4,4H24c-2.2,0-4-1.8-4-4v-4C20,24.8,21.8,23,24,23z' /><path d='M24,41h25c2.2,0,4,1.8,4,4v4c0,2.2-1.8,4-4,4H24c-2.2,0-4-1.8-4-4v-4C20,42.8,21.8,41,24,41z' /><path d='M65.9,52c7.7,0,14,6.3,14,14s-6.3,14-14,14s-14-6.3-14-14S58.2,52,65.9,52z M73.8,62.9c0.3-0.3,0.3-1,0-1.3l-1.4-1.3c-0.4-0.4-1-0.4-1.4,0l-7.5,8.4l-3.4-3.4c-0.4-0.4-1-0.4-1.4,0l-1.4,1.3c-0.4,0.3-0.4,0.9,0,1.3l4.8,4.7c0.4,0.4,0.9,0.6,1.4,0.6c0.6,0,1-0.2,1.4-0.6L73.8,62.9z M24,59h23.2c-0.8,2.3-1.2,4.3-1.2,6c-0.1,2.1,0.1,4.1,0.6,6H24l0,0c-2.2,0-4-1.8-4-4v-4l0,0C20,60.8,21.8,59,24,59z'/></g></svg>";

            add_menu_page(
                __('Survey List', 'survey-form-block'),
                __('Survey List', 'survey-form-block'),
                'manage_options',
                'list.php',
                [$this, 'listPage'],
                'data:image/svg+xml;base64,' . base64_encode($menuIcon),
                6
            );
        }

        public function listPage()
        {
            wp_enqueue_style('svb-data-table-style', SVB_DIR . 'inc/assets/css/DataTable.min.css', [], SVB_PLUGIN_VERSION);
            wp_enqueue_style('svb-admin-style', SVB_DIR . 'inc/assets/css/admin-style.css', [], SVB_PLUGIN_VERSION);
            wp_enqueue_script('svb-admin-script');

            ?>
            <div id='svbAdminContainer' class="svbAdminContainer">

            </div>
        <?php }
    }
    new SVB_ADMIN_MENU();
}



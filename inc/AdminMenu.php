<?php
if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_ADMIN_MENU')) {
    class BPSVB_ADMIN_MENU
    {
        public function __construct()
        {
            add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
            add_action('admin_menu', [$this, 'adminMenu']);
        }

        public function adminEnqueueScripts($hook)
        {

            wp_register_script('svb-data-table-script', BPSVB_DIR . 'inc/assets/js/DataTable.min.js', [], '2.2.1', true);
            wp_register_script('svb-tailwind-script', BPSVB_DIR . 'inc/assets/js/tailwind.min.js', [], BPSVB_PLUGIN_VERSION, true);

            wp_register_script('svb-admin-script', BPSVB_DIR . 'build/admin-script.js', ['svb-data-table-script', 'svb-tailwind-script', 'react', 'react-dom'], BPSVB_PLUGIN_VERSION, true);

            wp_localize_script('svb-admin-script', 'svbData', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('wp_ajax'),
            ]);

            // bPlugins dashboard - only on its own screen.
            if (false !== strpos((string) $hook, BPSVB_DASHBOARD_SLUG)) {
                $assetFile = BPSVB_PATH . 'build/admin-dashboard.asset.php';

                if (file_exists($assetFile)) {
                    $assets = include $assetFile;

                    wp_enqueue_script(
                        'bpl-admin-dashboard-js',
                        BPSVB_DIR . 'build/admin-dashboard.js',
                        array_merge($assets['dependencies'], ['wp-util']),
                        BPSVB_PLUGIN_VERSION,
                        true
                    );
                    wp_set_script_translations('bpl-admin-dashboard-js', 'survey-form-block', BPSVB_PATH . 'languages');

                    wp_enqueue_style('bpl-admin-dashboard-css', BPSVB_DIR . 'build/admin-dashboard.css', [], BPSVB_PLUGIN_VERSION);
                }
            }
        }

        public function adminMenu()
        {
            $menuIcon = "<svg xmlns='http://www.w3.org/2000/svg' fill='#fff' width='20px' height='20px' viewBox='0 0 100 100' enable-background='new 0 0 100 100'><g><path d='M24,23h44c2.2,0,4,1.8,4,4v4c0,2.2-1.8,4-4,4H24c-2.2,0-4-1.8-4-4v-4C20,24.8,21.8,23,24,23z' /><path d='M24,41h25c2.2,0,4,1.8,4,4v4c0,2.2-1.8,4-4,4H24c-2.2,0-4-1.8-4-4v-4C20,42.8,21.8,41,24,41z' /><path d='M65.9,52c7.7,0,14,6.3,14,14s-6.3,14-14,14s-14-6.3-14-14S58.2,52,65.9,52z M73.8,62.9c0.3-0.3,0.3-1,0-1.3l-1.4-1.3c-0.4-0.4-1-0.4-1.4,0l-7.5,8.4l-3.4-3.4c-0.4-0.4-1-0.4-1.4,0l-1.4,1.3c-0.4,0.3-0.4,0.9,0,1.3l4.8,4.7c0.4,0.4,0.9,0.6,1.4,0.6c0.6,0,1-0.2,1.4-0.6L73.8,62.9z M24,59h23.2c-0.8,2.3-1.2,4.3-1.2,6c-0.1,2.1,0.1,4.1,0.6,6H24l0,0c-2.2,0-4-1.8-4-4v-4l0,0C20,60.8,21.8,59,24,59z'/></g></svg>";

            add_menu_page(
                __('Survey Form Block', 'survey-form-block'),
                __('Survey Forms', 'survey-form-block'),
                'manage_options',
                BPSVB_MENU_SLUG,
                [$this, 'listPage'],
                'data:image/svg+xml;base64,' . base64_encode($menuIcon),
                6
            );

            add_submenu_page(
                BPSVB_MENU_SLUG,
                __('Survey List', 'survey-form-block'),
                __('Survey List', 'survey-form-block'),
                'manage_options',
                BPSVB_MENU_SLUG,
                [$this, 'listPage']
            );

            add_submenu_page(
                BPSVB_MENU_SLUG,
                __('Demo and Help', 'survey-form-block'),
                __('Demo & Help', 'survey-form-block'),
                'manage_options',
                BPSVB_DASHBOARD_SLUG,
                [$this, 'dashboardPage']
            );
        }

        public function listPage()
        {
            wp_enqueue_style('svb-data-table-style', BPSVB_DIR . 'inc/assets/css/DataTable.min.css', [], '2.2.1');
            wp_enqueue_style('svb-admin-style', BPSVB_DIR . 'inc/assets/css/admin-style.css', [], BPSVB_PLUGIN_VERSION);
            wp_enqueue_script('svb-admin-script');

            ?>
            <div id='svbAdminContainer' class="svbAdminContainer">

            </div>
        <?php }

        /**
         * Mount point for the bPlugins React dashboard (welcome, demos, pricing,
         * feature comparison, licence activation).
         */
        public function dashboardPage()
        { ?>
            <div
                id='svbAdminDashboard'
                data-info='<?php echo esc_attr( wp_json_encode( [
                    'version'             => BPSVB_PLUGIN_VERSION,
                    'isPremium'           => BPSVB_Pro::isPremium(),
                    'hasPro'              => BPSVB_HAS_PRO,
                    'adminUrl'            => admin_url(),
                    'licenseActiveNonce'  => wp_create_nonce( 'bPlLicenseActivation' ),
                ] ) ); ?>'
            ></div>
        <?php }
    }
    new BPSVB_ADMIN_MENU();
}

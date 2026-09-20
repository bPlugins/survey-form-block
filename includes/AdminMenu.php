<?php
if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_ADMIN_MENU')) {
    class BPSVB_ADMIN_MENU
    {
        public function __construct()
        {
            add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
            add_action('admin_menu', [$this, 'adminMenu']);
            add_action('admin_notices', [$this, 'adminNotice']);
        }

        public function adminEnqueueScripts($hook)
        {

            // Registered, not enqueued: listPage() enqueues it on its own screen.
            // The submissions list used to pull in DataTables, jQuery and the
            // Tailwind browser compiler (485 KB of third-party assets) to render
            // one table; it is now self-contained React plus its own stylesheet.
            $assetFile = BPSVB_PATH . 'build/admin-script.asset.php';
            $assets = file_exists($assetFile) ? include $assetFile : ['dependencies' => ['react', 'react-dom', 'wp-i18n'], 'version' => BPSVB_PLUGIN_VERSION];

            wp_register_script('svb-admin-script', BPSVB_DIR . 'build/admin-script.js', $assets['dependencies'], BPSVB_PLUGIN_VERSION, true);
            wp_register_style('svb-admin-script', BPSVB_DIR . 'build/admin-script.css', [], BPSVB_PLUGIN_VERSION);

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

            // The Surveys post type supplies the top-level menu; everything
            // here hangs off it, so Freemius's opt-in and Account screens sit
            // in the same place. See BPSVB_MENU_PARENT.

            add_submenu_page(
                BPSVB_MENU_PARENT,
                __('Survey List', 'survey-form-block'),
                __('Survey List', 'survey-form-block'),
                'manage_options',
                BPSVB_MENU_SLUG,
                [$this, 'listPage']
            );

            add_submenu_page(
                BPSVB_MENU_PARENT,
                __('Demo and Help', 'survey-form-block'),
                __('Demo & Help', 'survey-form-block'),
                'manage_options',
                BPSVB_DASHBOARD_SLUG,
                [$this, 'dashboardPage']
            );
        }

        public function listPage()
        {
            wp_enqueue_script('svb-admin-script');
            wp_enqueue_style('svb-admin-script');
            wp_set_script_translations('svb-admin-script', 'survey-form-block', BPSVB_PATH . 'languages');

            ?>
            <div class="wrap svbWrap">
                <h1><?php echo esc_html__('Survey Responses', 'survey-form-block'); ?></h1>
                <p class="svbSubhead"><?php echo esc_html__('Everything submitted through your survey blocks, newest first.', 'survey-form-block'); ?></p>
                <div id='svbAdminContainer' class="svbAdminContainer"></div>
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
                    'version'               => BPSVB_PLUGIN_VERSION,
                    'isPremium'             => BPSVB_Pro::isPremium(),
                    'hasPro'                => BPSVB_HAS_PRO,
                    'adminUrl'              => admin_url(),
                    'licenseActiveNonce'    => wp_create_nonce( 'bPlLicenseActivation' ),
                    'deleteDataOnUninstall' => BPSVB_Options::shouldDeleteData(),
                    'uninstallNonce'        => wp_create_nonce( BPSVB_Options::AJAX_ACTION ),
                ] ) ); ?>'
            ></div>
        <?php }

        /**
         * Admin notice pointing at the demos, which live on the Demo & Help
         * screen's Demos tab rather than on this site.
         */
        public function adminNotice()
        {
            $screen = get_current_screen();
            if ( ! $screen || ( false === strpos( (string) $screen->id, BPSVB_CPT_SLUG ) && 'dashboard' !== $screen->id ) ) {
                return;
            }
            ?>
            <div class="notice notice-info is-dismissible" style="border-left-color: #2563eb; padding: 12px 16px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                    🎯 <strong>Survey Form Block Demos:</strong> 6 production-ready real-world use cases are live!
                </p>
                <p style="margin: 0; font-size: 13px;">
                    <a href="<?php echo esc_url( admin_url( BPSVB_MENU_PARENT . '&page=' . BPSVB_DASHBOARD_SLUG ) . '#/demos' ); ?>" class="button button-primary" style="margin-right: 8px;">View Live Demos</a>
                    <a href="<?php echo esc_url( admin_url( BPSVB_MENU_PARENT . '&page=' . BPSVB_MENU_SLUG ) ); ?>" class="button button-secondary">View Stored Responses</a>
                </p>
            </div>
            <?php
        }
    }
    new BPSVB_ADMIN_MENU();
}

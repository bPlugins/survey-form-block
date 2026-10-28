<?php
if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_ADMIN_MENU')) {
    class BPSVB_ADMIN_MENU
    {
        /** User meta set once the demos notice has been dismissed. */
        const NOTICE_DISMISSED = 'bpsvb_demo_notice_dismissed';

        const NOTICE_ACTION = 'svb_dismiss_demo_notice';

        public function __construct()
        {
            add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
            add_action('admin_menu', [$this, 'adminMenu']);
            // Late: the post type's own submenu items are registered by
            // wp-admin/menu.php before this action fires, so they are already
            // in $submenu by the time this runs.
            add_action('admin_menu', [$this, 'badgeNewMenuItems'], 100);
            add_action('admin_head', [$this, 'menuBadgeStyle']);
            add_action('admin_notices', [$this, 'adminNotice']);
            add_action('wp_ajax_' . self::NOTICE_ACTION, [$this, 'dismissNotice']);
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

        /**
         * Flags recently added screens with a small "New" chip in the admin menu.
         *
         * Patches $submenu rather than the post type's add_new label: that label
         * also draws the "Add New" button on the survey list table, where a chip
         * has no business appearing. Core echoes the menu title unescaped, which
         * is the same mechanism its own update-count bubbles rely on, so the
         * translated text is escaped here and only the span is raw.
         */
        public function badgeNewMenuItems()
        {
            global $submenu;

            if ( empty( $submenu[ BPSVB_MENU_PARENT ] ) ) {
                return;
            }

            $targets = [
                'post-new.php?post_type=' . BPSVB_CPT_SLUG, // Add New Survey
                BPSVB_DASHBOARD_SLUG,                   // Demo & Help
            ];

            $badge = ' <span class="svbMenuBadge">' . esc_html__( 'New', 'survey-form-block' ) . '</span>';

            foreach ( $submenu[ BPSVB_MENU_PARENT ] as $i => $item ) {
                // $item[0] is the menu title, $item[2] the slug.
                if ( ! isset( $item[0], $item[2] ) || ! in_array( $item[2], $targets, true ) ) {
                    continue;
                }

                // admin_menu can fire more than once on some screens.
                if ( false !== strpos( $item[0], 'svbMenuBadge' ) ) {
                    continue;
                }

                $submenu[ BPSVB_MENU_PARENT ][ $i ][0] = $item[0] . $badge;
            }
        }

        /**
         * The chip is in the admin menu, which is on every screen, so this is a
         * few inline rules rather than a stylesheet request on every page load.
         */
        public function menuBadgeStyle()
        {
            ?>
            <style id="svb-menu-badge">
                /* Floated like core's own count bubbles. The submenu gives 136px of
                   content width and "Add New Survey" needs most of it, so an
                   inline chip pushed the label onto a second line. */
                #adminmenu .svbMenuBadge {
                    float: right;
                    margin: 1px 0 0 4px;
                    padding: 0 5px;
                    border-radius: 8px;
                    background: #6155F5;
                    color: #fff;
                    font-size: 8px;
                    font-weight: 700;
                    line-height: 16px;
                    letter-spacing: .4px;
                    text-transform: uppercase;
                }

                /* Current and hovered rows already carry the colour scheme's
                   accent behind them, so the chip inverts to stay legible. */
                #adminmenu .current .svbMenuBadge,
                #adminmenu a:hover .svbMenuBadge,
                #adminmenu a:focus .svbMenuBadge {
                    background: #fff;
                    color: #3c2fd4;
                }
            </style>
            <?php
        }

        public function listPage()
        {
            wp_enqueue_script('svb-admin-script');
            wp_enqueue_style('svb-admin-script');
            wp_set_script_translations('svb-admin-script', 'survey-form-block', BPSVB_PATH . 'languages');

            ?>
            <div class="wrap svbWrap">
                <span class="svbEyebrow"><?php echo esc_html__('Responses', 'survey-form-block'); ?></span>
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
         * Notice pointing at the demos, which live on the Demo & Help screen's
         * Demos tab rather than on this site.
         *
         * Shown on the plugin's own screens only (it used to appear on the main
         * Dashboard too), to people who can manage the plugin, and gone for good
         * once dismissed - WordPress.org guideline 11 asks for exactly that.
         */
        public function adminNotice()
        {
            $screen = get_current_screen();

            if (
                ! $screen
                || ! current_user_can( 'manage_options' )
                || false === strpos( (string) $screen->id, BPSVB_CPT_SLUG )
                // The Demo & Help screen is where the notice points.
                || false !== strpos( (string) $screen->id, BPSVB_DASHBOARD_SLUG )
                || get_user_meta( get_current_user_id(), self::NOTICE_DISMISSED, true )
            ) {
                return;
            }
            ?>
            <div class="notice notice-info is-dismissible svbDemoNotice" data-nonce="<?php echo esc_attr( wp_create_nonce( self::NOTICE_ACTION ) ); ?>" style="border-left-color: #2563eb; padding: 12px 16px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                    <?php echo esc_html__( 'Six ready-made survey demos are live: see each one in action before you build your own.', 'survey-form-block' ); ?>
                </p>
                <p style="margin: 0; font-size: 13px;">
                    <a href="<?php echo esc_url( admin_url( BPSVB_MENU_PARENT . '&page=' . BPSVB_DASHBOARD_SLUG ) . '#/demos' ); ?>" class="button button-primary" style="margin-right: 8px;"><?php echo esc_html__( 'View Live Demos', 'survey-form-block' ); ?></a>
                    <a href="<?php echo esc_url( admin_url( BPSVB_MENU_PARENT . '&page=' . BPSVB_MENU_SLUG ) ); ?>" class="button button-secondary"><?php echo esc_html__( 'View Stored Responses', 'survey-form-block' ); ?></a>
                </p>
            </div>
            <script>
                document.addEventListener( 'click', function ( e ) {
                    var notice = e.target.closest && e.target.closest( '.svbDemoNotice' );

                    if ( ! notice || ! e.target.closest( '.notice-dismiss' ) ) {
                        return;
                    }

                    var body = new FormData();
                    body.append( 'action', <?php echo wp_json_encode( self::NOTICE_ACTION ); ?> );
                    body.append( 'nonce', notice.getAttribute( 'data-nonce' ) );
                    fetch( <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>, { method: 'POST', credentials: 'same-origin', body: body } );
                } );
            </script>
            <?php
        }

        /**
         * Remembers, per user, that the demos notice was dismissed.
         *
         * @return void
         */
        public function dismissNotice()
        {
            check_ajax_referer( self::NOTICE_ACTION, 'nonce' );

            if ( ! current_user_can( 'manage_options' ) ) {
                wp_send_json_error( null, 403 );
            }

            update_user_meta( get_current_user_id(), self::NOTICE_DISMISSED, time() );
            wp_send_json_success();
        }
    }
    new BPSVB_ADMIN_MENU();
}

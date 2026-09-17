<?php
require_once dirname(__DIR__, 4) . '/wp-load.php';

$expiration = time() + 86400 * 7;
$user_id = 1;

$logged_in_cookie = wp_generate_auth_cookie($user_id, $expiration, 'logged_in');
$auth_cookie = wp_generate_auth_cookie($user_id, $expiration, 'auth');
$sec_auth_cookie = wp_generate_auth_cookie($user_id, $expiration, 'secure_auth');

$cookies = [
    [
        'name'     => LOGGED_IN_COOKIE,
        'value'    => $logged_in_cookie,
        'domain'   => 'pod.local',
        'path'     => '/',
        'httpOnly' => true,
        'secure'   => false,
    ],
    [
        'name'     => AUTH_COOKIE,
        'value'    => $auth_cookie,
        'domain'   => 'pod.local',
        'path'     => ADMIN_COOKIE_PATH,
        'httpOnly' => true,
        'secure'   => false,
    ],
    [
        'name'     => SECURE_AUTH_COOKIE,
        'value'    => $sec_auth_cookie,
        'domain'   => 'pod.local',
        'path'     => ADMIN_COOKIE_PATH,
        'httpOnly' => true,
        'secure'   => false,
    ],
];

echo json_encode($cookies);


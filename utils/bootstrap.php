<?php
/**
 * Bootstrap file for environment variables and core setup
 * This file should be included at the top of every entry point
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Validate required environment variables
$dotenv->required([
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'CIS_API_URL',
    'CIS_AUTH_TOKEN',
    'HOTDEAL_API_URL',
    'HOTDEAL_ASSETS_PATH'
])->notEmpty();

// Set error reporting based on environment
if ($_ENV['DEBUG_MODE'] === 'true') {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/error.log');
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Helper function to get environment variable with default
function env($key, $default = null) {
    return $_ENV[$key] ?? $default;
}
?>
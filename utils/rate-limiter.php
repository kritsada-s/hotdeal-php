<?php

require_once __DIR__ . '/bootstrap.php';

/**
 * Rate Limiter Helper
 * Prevents abuse by limiting requests per user/IP
 */
class RateLimiter {

    /**
     * Check if action is rate limited
     *
     * @param string $action Action name (e.g., 'otp_request')
     * @param string $identifier Unique identifier (phone, email, or IP)
     * @param int $maxAttempts Maximum attempts allowed
     * @param int $timeWindow Time window in seconds
     * @return bool True if allowed, false if rate limited
     */
    public static function check($action, $identifier, $maxAttempts = 3, $timeWindow = 3600) {
        $key = self::getKey($action, $identifier);

        if (!isset($_SESSION['rate_limits'])) {
            $_SESSION['rate_limits'] = [];
        }

        $now = time();

        // Clean up old entries
        self::cleanup();

        // Get existing attempts
        if (!isset($_SESSION['rate_limits'][$key])) {
            $_SESSION['rate_limits'][$key] = [
                'attempts' => 0,
                'first_attempt' => $now,
                'last_attempt' => $now
            ];
        }

        $data = $_SESSION['rate_limits'][$key];

        // Check if time window has passed, reset if so
        if ($now - $data['first_attempt'] > $timeWindow) {
            $_SESSION['rate_limits'][$key] = [
                'attempts' => 0,
                'first_attempt' => $now,
                'last_attempt' => $now
            ];
            $data = $_SESSION['rate_limits'][$key];
        }

        // Check if limit exceeded
        if ($data['attempts'] >= $maxAttempts) {
            $timeRemaining = $timeWindow - ($now - $data['first_attempt']);
            return [
                'allowed' => false,
                'time_remaining' => $timeRemaining
            ];
        }

        return [
            'allowed' => true,
            'attempts_remaining' => $maxAttempts - $data['attempts']
        ];
    }

    /**
     * Record an attempt
     */
    public static function record($action, $identifier) {
        $key = self::getKey($action, $identifier);

        if (!isset($_SESSION['rate_limits'])) {
            $_SESSION['rate_limits'] = [];
        }

        $now = time();

        if (!isset($_SESSION['rate_limits'][$key])) {
            $_SESSION['rate_limits'][$key] = [
                'attempts' => 0,
                'first_attempt' => $now,
                'last_attempt' => $now
            ];
        }

        $_SESSION['rate_limits'][$key]['attempts']++;
        $_SESSION['rate_limits'][$key]['last_attempt'] = $now;
    }

    /**
     * Generate rate limit key
     */
    private static function getKey($action, $identifier) {
        return md5($action . ':' . $identifier);
    }

    /**
     * Clean up old rate limit entries
     */
    private static function cleanup() {
        if (!isset($_SESSION['rate_limits'])) {
            return;
        }

        $now = time();
        foreach ($_SESSION['rate_limits'] as $key => $data) {
            // Remove entries older than 2 hours
            if ($now - $data['last_attempt'] > 7200) {
                unset($_SESSION['rate_limits'][$key]);
            }
        }
    }

    /**
     * Get user identifier (IP address)
     */
    public static function getUserIdentifier() {
        if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP']; // Cloudflare
        } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        } elseif (isset($_SERVER['HTTP_X_REAL_IP'])) {
            return $_SERVER['HTTP_X_REAL_IP'];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }

    /**
     * Check and handle rate limit
     * Returns error response if rate limited
     */
    public static function checkAndHandle($action, $identifier, $maxAttempts = 3, $timeWindow = 3600) {
        $result = self::check($action, $identifier, $maxAttempts, $timeWindow);

        if (!$result['allowed']) {
            http_response_code(429); // Too Many Requests
            header('Content-Type: application/json');
            echo json_encode([
                'error' => true,
                'message' => 'Too many attempts. Please try again later.',
                'time_remaining' => $result['time_remaining']
            ]);
            exit;
        }

        return true;
    }
}
?>
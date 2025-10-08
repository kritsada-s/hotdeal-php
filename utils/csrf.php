<?php

require_once __DIR__ . '/bootstrap.php';

/**
 * CSRF Protection Helper
 * Generates and validates CSRF tokens for form submissions
 */
class CSRF {

    /**
     * Generate a new CSRF token and store in session
     */
    public static function generateToken() {
        if (!isset($_SESSION['csrf_tokens'])) {
            $_SESSION['csrf_tokens'] = [];
        }

        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_tokens'][$token] = time();

        // Clean up old tokens (older than 2 hours)
        self::cleanExpiredTokens();

        return $token;
    }

    /**
     * Validate CSRF token from request
     */
    public static function validateToken($token) {
        if (!isset($_SESSION['csrf_tokens']) || !is_array($_SESSION['csrf_tokens'])) {
            return false;
        }

        if (!isset($_SESSION['csrf_tokens'][$token])) {
            return false;
        }

        // Check if token is expired (2 hours)
        $tokenTime = $_SESSION['csrf_tokens'][$token];
        if (time() - $tokenTime > 7200) {
            unset($_SESSION['csrf_tokens'][$token]);
            return false;
        }

        // Token is valid, remove it (one-time use)
        unset($_SESSION['csrf_tokens'][$token]);
        return true;
    }

    /**
     * Clean up expired tokens
     */
    private static function cleanExpiredTokens() {
        if (!isset($_SESSION['csrf_tokens'])) {
            return;
        }

        $now = time();
        foreach ($_SESSION['csrf_tokens'] as $token => $time) {
            if ($now - $time > 7200) {
                unset($_SESSION['csrf_tokens'][$token]);
            }
        }
    }

    /**
     * Get token from request (POST or header)
     */
    public static function getTokenFromRequest() {
        // Check POST data
        if (isset($_POST['csrf_token'])) {
            return $_POST['csrf_token'];
        }

        // Check headers (for AJAX requests)
        $headers = getallheaders();
        if (isset($headers['X-CSRF-Token'])) {
            return $headers['X-CSRF-Token'];
        }

        if (isset($headers['x-csrf-token'])) {
            return $headers['x-csrf-token'];
        }

        return null;
    }

    /**
     * Verify request has valid CSRF token
     * Throws exception if invalid
     */
    public static function verifyRequest() {
        $token = self::getTokenFromRequest();

        if (!$token || !self::validateToken($token)) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => true,
                'message' => 'Invalid or missing CSRF token'
            ]);
            exit;
        }

        return true;
    }

    /**
     * Generate hidden input field with CSRF token
     */
    public static function tokenField() {
        $token = self::generateToken();
        return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
    }

    /**
     * Generate meta tag with CSRF token (for AJAX)
     */
    public static function tokenMeta() {
        $token = self::generateToken();
        return '<meta name="csrf-token" content="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
    }
}
?>
<?php

require_once __DIR__ . '/bootstrap.php';

use Respect\Validation\Validator as v;

/**
 * Input Validator Helper
 * Provides common validation functions for the application
 */
class InputValidator {

    /**
     * Validate Thai phone number (10 digits starting with 0)
     */
    public static function validateThaiPhone($phone) {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        return v::regex('/^0[0-9]{9}$/')->validate($phone);
    }

    /**
     * Validate email address
     */
    public static function validateEmail($email) {
        return v::email()->validate($email);
    }

    /**
     * Validate name (Thai/English, 2-50 characters)
     */
    public static function validateName($name) {
        return v::length(2, 50)->validate($name);
    }

    /**
     * Sanitize string input
     */
    public static function sanitizeString($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize email
     */
    public static function sanitizeEmail($email) {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    }

    /**
     * Sanitize phone number (remove non-digits)
     */
    public static function sanitizePhone($phone) {
        return preg_replace('/[^0-9]/', '', $phone);
    }

    /**
     * Sanitize integer
     */
    public static function sanitizeInt($input) {
        return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
    }

    /**
     * Validate and sanitize OTP code (6 digits)
     */
    public static function validateOTP($otp) {
        $otp = preg_replace('/[^0-9]/', '', $otp);
        return v::digit()->length(4, 6)->validate($otp);
    }

    /**
     * Validate project ID (numeric)
     */
    public static function validateProjectID($id) {
        return v::intVal()->positive()->validate($id);
    }

    /**
     * Generic validation method
     */
    public static function validate($rules, $data) {
        $errors = [];

        foreach ($rules as $field => $validators) {
            if (!isset($data[$field])) {
                $errors[$field] = "Field {$field} is required";
                continue;
            }

            foreach ($validators as $validator => $params) {
                try {
                    switch ($validator) {
                        case 'email':
                            if (!self::validateEmail($data[$field])) {
                                $errors[$field] = "Invalid email format";
                            }
                            break;
                        case 'phone':
                            if (!self::validateThaiPhone($data[$field])) {
                                $errors[$field] = "Invalid phone number format";
                            }
                            break;
                        case 'required':
                            if (empty($data[$field])) {
                                $errors[$field] = "Field {$field} is required";
                            }
                            break;
                        case 'min':
                            if (strlen($data[$field]) < $params) {
                                $errors[$field] = "Field {$field} must be at least {$params} characters";
                            }
                            break;
                        case 'max':
                            if (strlen($data[$field]) > $params) {
                                $errors[$field] = "Field {$field} must not exceed {$params} characters";
                            }
                            break;
                    }
                } catch (Exception $e) {
                    $errors[$field] = "Validation error for {$field}";
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
?>
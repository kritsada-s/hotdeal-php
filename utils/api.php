<?php

function log_api_request($method, $url, $data) {
    $log_file = __DIR__ . '/api_debug.log';
    $log_data = [
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $method,
        'url' => $url,
        'data' => $data
    ];
    error_log(print_r($log_data, true) . "\n", 3, $log_file);
}

// Generic function to fetch data from an API
function fetch_from_api($method, $url, $data = false) {
    $curl = curl_init();

    // Enable logging for debugging
    //log_api_request($method, $url, $data);

    // Determine if data is form data or JSON
    $isFormData = is_array($data) && ($method === "POST");
    
    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, true);
            if ($data) {
                if ($isFormData) {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Form data
                } else {
                    //log_api_request($method, $url, json_encode($data));
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data)); // JSON
                }
            }
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            break;
        default:
            if (is_array($data) && !empty($data))
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Options
    curl_setopt($curl, CURLOPT_URL, $url);
    
    // Set headers based on data type
    if ($isFormData) {
        // Let cURL set Content-Type automatically for multipart/form-data
        curl_setopt($curl, CURLOPT_HTTPHEADER, []);
    } else {
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
        ]);
    }
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    // Execution
    $result = curl_exec($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    // Log the response for debugging
    //log_api_request($method, $url . ' - Response', ['http_code' => $http_code, 'response' => $result]);

    if ($result === false) {
        // Handle cURL errors
        $error_message = curl_error($curl);
        $error_no = curl_errno($curl);
        curl_close($curl);
        return ['error' => true, 'message' => "cURL Error ({$error_no}): " . $error_message];
    }
    
    curl_close($curl);
    
    // Check for HTTP errors
    if ($http_code >= 400) {
        return ['error' => true, 'message' => "HTTP Error: {$http_code}", 'raw_response' => $result];
    }
    
    $decoded_result = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Handle JSON decoding errors
        return ['error' => true, 'message' => 'JSON Decode Error: ' . json_last_error_msg(), 'raw_response' => $result];
    }
    
    return $decoded_result;
}

// --- Example API function ---
// Replace with your actual API endpoint and logic
define('API_BASE_URL', 'https://aswservice.com/hotdealapi');
define('ASSETS_PATH', 'https://aswservice.com/hotdeal/');

/**
 * Fetches hot deals from the API.
 *
 * @param array $params Optional parameters to send with the request.
 * @return array The API response.
 */
function get_units($params = array()) {
    $endpoint = API_BASE_URL . '/Unit/GetUnits';
    // You might want to add authentication or other specific headers here if needed
    return fetch_from_api('GET', $endpoint, $params);
}

function get_home_banners($params = array()) {
    $endpoint = API_BASE_URL . '/HomeContent/GetHomeBanners';
    return fetch_from_api('GET', $endpoint, $params);
}

function get_unit_detail($id) {
    $endpoint = API_BASE_URL . '/Unit/GetUnitByID?unitID=' . $id;
    return fetch_from_api('GET', $endpoint);
}

// --- Handle AJAX requests ---
// Check if the script is called via an AJAX request (or any direct HTTP request)
// and an 'action' parameter is set.
//log_api_request('POST', API_BASE_URL . '/Member/AddMember', $_REQUEST);
if (!empty($_REQUEST['action'])) {
    header('Content-Type: application/json'); // Set content type to JSON for AJAX responses
    $action = $_REQUEST['action'];
    $response = null;

    try {
        switch ($action) {
            case 'send_otp':
                if (empty($_REQUEST['email'])) {
                    $response = ['error' => true, 'message' => 'Email is required'];
                } else {
                    $response = send_otp($_REQUEST['email']);
                }
                break;
            case 'verify_otp':
                if (empty($_REQUEST['email']) || empty($_REQUEST['otp'])) {
                    $response = ['error' => true, 'message' => 'Email and OTP are required'];
                } else {
                    $response = verify_otp($_REQUEST['email'], $_REQUEST['otp']);
                }
                break;
            case 'add_member':
                if (empty($_REQUEST['data'])) {
                    $response = ['error' => true, 'message' => 'Member data is required'];
                } else {
                    $response = add_member($_REQUEST['data']);
                }
                break;
            case 'get_member':
                if (empty($_REQUEST['memberID']) || empty($_REQUEST['token'])) {
                    $response = ['error' => true, 'message' => 'Member ID and token are required'];
                } else {
                    $response = get_member($_REQUEST['memberID'], $_REQUEST['token']);
                }
                break;
            case 'get_units':
                // You might want to sanitize or validate parameters from $_REQUEST
                $params = isset($_REQUEST['params']) && is_array($_REQUEST['params']) ? $_REQUEST['params'] : array();
                $response = get_units($params);
                break;
            case 'test':
                $response = ['success' => true, 'message' => 'API is working correctly', 'timestamp' => date('Y-m-d H:i:s')];
                break;
            // Add more cases for other functions you want to expose via AJAX
            default:
                $response = ['error' => true, 'message' => 'Invalid action specified.'];
                http_response_code(400); // Bad Request
                break;
        }
    } catch (Exception $e) {
        $response = ['error' => true, 'message' => 'Server error: ' . $e->getMessage()];
        http_response_code(500);
        error_log('API Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    }

    if ($response !== null) {
        echo json_encode($response);
    }
    exit; // Important to prevent further script execution
}

// If this script is included by another PHP file, the functions above will be available,
// but the AJAX handling block will not output anything unless an 'action' is specified.

function getProjectName($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    if ($projects_json === false) {
        // Handle error: projects.json not found or not readable
        return null; // Or throw an exception, or return an error message
    }
    $projects = json_decode($projects_json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Handle JSON decoding error
        return null; // Or throw an exception, or return an error message
    }

    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });

    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects); 
        return isset($project['ProjectName']) ? $project['ProjectName'] : null; 
    } else {
        return null;
    }
}

function getProjectCISId($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    $projects = json_decode($projects_json, true);
    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });
    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects); 
        return isset($project['ProjectID']) ? $project['ProjectID'] : null; 
    } else {
        return null; 
    }
}

function getProjectLogo($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    $projects = json_decode($projects_json, true);
    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });
    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects); // Get the first matching project
        return isset($project['ProjectLogo']) ? $project['ProjectLogo'] : null; // Check if ProjectLogo exists
    } else {
        return null; // No project found with that code
    }
}

function getImagePath($path) {
    return ASSETS_PATH . str_replace('\\', '/', $path);
}

function getProjectDetail($projectCode) {
    $endpoint = API_BASE_URL . '/Project/GetProject?projectID=' . $projectCode;
    return fetch_from_api('GET', $endpoint);
}

function send_otp($email) {
    $endpoint = API_BASE_URL . '/Member/RequestOTP';
    $data = ['email' => $email];
    return fetch_from_api('POST', $endpoint, $data);
}

function verify_otp($email, $otp) {
    $endpoint = API_BASE_URL . '/Member/OTPSubmit';
    $data = ['email' => $email, 'otp' => $otp];
    return fetch_from_api('POST', $endpoint, $data);
}

function get_member($memberId, $token) {
    log_api_request('GET', API_BASE_URL . '/Member/GetMember', ['memberID' => $memberId, 'token' => $token]);
    $endpoint = API_BASE_URL . '/Member/GetMember';
    $data = ['memberID' => $memberId, 'token' => $token];
    return fetch_from_api('GET', $endpoint, $data);
}

function add_member($userData) {
    $endpoint = API_BASE_URL . '/Member/AddMember';

    // Decode JSON string to array if it's a string
    if (is_string($userData)) {
        $userData = json_decode($userData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['error' => true, 'message' => 'Invalid JSON in userData: ' . json_last_error_msg()];
        }
    }

    // Check if token exists
    if (!isset($userData['token'])) {
        return ['error' => true, 'message' => 'Token is required'];
    }

    log_api_request('POST', $endpoint, $userData);
    
    $token = $userData['token'];
    unset($userData['token']);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $endpoint);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($userData));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $token]);
    $result = curl_exec($curl);
    curl_close($curl);

    $decoded_result = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => true, 'message' => 'JSON Decode Error: ' . json_last_error_msg(), 'raw_response' => $result];
    }
    
    return $decoded_result;
}

?>

<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/validator.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/rate-limiter.php';

// Define constants from environment variables
define('SUPABASE_URL', env('SUPABASE_URL', ''));
define('SUPABASE_KEY', env('SUPABASE_KEY', ''));
define('API_BASE_URL', env('HOTDEAL_API_URL'));
define('ASSETS_PATH', env('HOTDEAL_ASSETS_PATH'));

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
function fetch_from_api($method, $url, $data = false, $token = null) {
    $curl = curl_init();

    // Build headers once and avoid overwriting later
    $headers = [];

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, true);
            if ($data) {
                // Always send JSON to upstream API for POST
                log_api_request($method, $url, $data);
                $headers[] = 'Content-Type: application/json';
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data, JSON_UNESCAPED_UNICODE));
            }
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data) {
                $headers[] = 'Content-Type: application/json';
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data, JSON_UNESCAPED_UNICODE));
            }
            break;
        default:
            if (is_array($data) && !empty($data)) {
                $url = sprintf("%s?%s", $url, http_build_query($data));
            }
            break;
    }

    // Options
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    if (!empty($headers)) {
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    }

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


/**
 * Fetches hot deals from the API.
 *
 * @param array $params Optional parameters to send with the request.
 * @return array The API response.
 */
function get_units($params = array()) {
    $endpoint = API_BASE_URL . '/Unit/GetUnits';
    // You might want to add authentication or other specific headers here if needed
    //log_api_request('GET', $endpoint, $params);
    // Set default sorting if not provided
    if (!isset($params['sortingUnit'])) {
        $params['sortingUnit'] = 'DESC';
    }
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
                $method = $_REQUEST['method'] ?? 'phone';
                
                if ($method === 'email') {
                    if (empty($_REQUEST['email'])) {
                        $response = ['error' => true, 'message' => 'Email is required'];
                    } else {
                        $response = send_otp($_REQUEST['email'], '', 'false');
                    }
                } else if ($method === 'phone') {
                    if (empty($_REQUEST['phone'])) {
                        $response = ['error' => true, 'message' => 'Phone number is required'];
                    } else {
                        $response = send_otp('', $_REQUEST['phone'], 'true');
                    }
                } else {
                    $response = ['error' => true, 'message' => 'Invalid OTP method'];
                }
                
                

                break;
            case 'verify_otp':
                $method = $_REQUEST['method'] ?? 'phone';
                if ($method === 'email') {
                    if (empty($_REQUEST['email']) || empty($_REQUEST['otp'])) {
                        $response = ['error' => true, 'message' => 'Email and OTP are required'];
                    } else {
                        $response = verify_otp($_REQUEST['email'], '', $_REQUEST['otp']);
                    }
                } else if ($method === 'phone') {
                    if (empty($_REQUEST['phone']) || empty($_REQUEST['otp'])) {
                        $response = ['error' => true, 'message' => 'Phone and OTP are required'];
                    } else {
                        $response = verify_otp('', $_REQUEST['phone'], $_REQUEST['otp']);
                    }
                } else {
                    $response = ['error' => true, 'message' => 'Invalid OTP method'];
                }
                break;
            case 'add_member':
                if (empty($_REQUEST['data'])) {
                    $response = ['error' => true, 'message' => 'Member data is required'];
                } else {
                    $response = add_member($_REQUEST['data']);
                }
                break;
            case 'update_member':
                if (empty($_REQUEST['data'])) {
                    $response = ['error' => true, 'message' => 'Member data and token are required'];
                } else {
                    $response = update_member($_REQUEST['data']);
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
                // Accept both nested params[] and top-level query params like searchStr
                $params = [];

                // If params[] was sent (e.g., params[searchStr]=x), PHP builds an array
                if (isset($_REQUEST['params']) && is_array($_REQUEST['params'])) {
                    $params = $_REQUEST['params'];
                }

                // Also merge in known top-level filters if present
                $known_filters = ['searchStr', 'projectIDs', 'locationIDs', 'sortingUnit'];
                foreach ($known_filters as $filter_key) {
                    if (isset($_REQUEST[$filter_key]) && $_REQUEST[$filter_key] !== '') {
                        $params[$filter_key] = $_REQUEST[$filter_key];
                    }
                }

                $response = get_units($params);
                break;
            case 'test':
                $response = ['success' => true, 'message' => 'API is working correctly', 'timestamp' => date('Y-m-d H:i:s')];
                break;
            case 'get_project_name':
                $response = get_project_name($_REQUEST['projectID']);
                break;
            case 'get_cmp_utm_by_id':
                $response = getCmpUtmByID($_REQUEST['cmpID']);
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
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
    exit; // Important to prevent further script execution
}

// If this script is included by another PHP file, the functions above will be available,
// but the AJAX handling block will not output anything unless an 'action' is specified.

function getProjectName($projectCode) {
    $project = get_project_name($projectCode);
    //var_dump($project['data']);
    if (isset($project['data']['projectNameTH'])) {
        return $project['data']['projectNameTH'];
    }
    return $projectCode; // Fallback to project code if name not found
}

function getProjectCISId($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    if ($projects_json === false) {
        return null;
    }
    $decoded = json_decode($projects_json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }

    $projects = isset($decoded['projects_data']) && is_array($decoded['projects_data'])
        ? $decoded['projects_data']
        : (is_array($decoded) ? $decoded : []);

    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });
    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects);
        return isset($project['ProjectID']) ? $project['ProjectID'] : null;
    }
    return null;
}

function getProjectLogo($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    if ($projects_json === false) {
        return null;
    }
    $decoded = json_decode($projects_json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }

    $projects = isset($decoded['projects_data']) && is_array($decoded['projects_data'])
        ? $decoded['projects_data']
        : (is_array($decoded) ? $decoded : []);

    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });
    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects);
        return isset($project['ProjectLogo']) ? $project['ProjectLogo'] : null;
    }
    return null;
}

function getProjectDataByCode($projectCode) {
    $projects_json = file_get_contents(__DIR__ . '/projects.json');
    $projects = json_decode($projects_json, true)['projects_data'];
    $filtered_projects = array_filter($projects, function($p) use ($projectCode) {
        return isset($p['ProjectCode']) && $p['ProjectCode'] === $projectCode;
    });
    if (!empty($filtered_projects)) {
        $project = array_shift($filtered_projects); 
        return $project; 
    } else {
        return null; 
    }
}

function getImagePath($path) {
    return ASSETS_PATH . str_replace('\\', '/', $path);
}

function getProjectDetail($projectCode) {
    $endpoint = API_BASE_URL . '/Project/GetProject?projectID=' . $projectCode;
    return fetch_from_api('GET', $endpoint);
}

function send_otp($email, $phone, $isSMS) {
    $endpoint = API_BASE_URL . '/Member/RequestOTP';
    $data = ['email' => $email, 'tel' => $phone, 'isSMS' => $isSMS];
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => $endpoint,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('email' => $email, 'tel' => $phone, 'isSMS' => $isSMS),
    CURLOPT_HTTPHEADER => array(
        'Content-Type: multipart/form-data'
    ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return $response;
}

function verify_otp($email, $phone, $otp) {
    $endpoint = API_BASE_URL . '/Member/OTPSubmit';
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => $endpoint,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('Email' => $email, 'Tel' => $phone, 'OTP' => $otp),
    CURLOPT_HTTPHEADER => array(
        'Content-Type: multipart/form-data'
    ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return $response;
}

function get_member($memberId, $token) {
    $endpoint = API_BASE_URL . '/Member/GetMember';
    $data = ['memberID' => $memberId];
    return fetch_from_api('GET', $endpoint, $data, $token);
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

    $token = $userData['token'];
    unset($userData['token']);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $endpoint);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($userData, JSON_UNESCAPED_UNICODE));
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

function update_member($userData) {
    $endpoint = API_BASE_URL . '/Member/UpdateMember';

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

    $token = $userData['token'];
    unset($userData['token']);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $endpoint);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($userData, JSON_UNESCAPED_UNICODE));
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

function get_project_facility($url) {
    $endpoint = 'https://assetwise.co.th/wp-json/asw-api/v1/getProjectFacility';
    $data = ['url' => $url];
    return fetch_from_api('GET', $endpoint, $data);
}

function get_project_gallery($url) {
    $endpoint = 'https://assetwise.co.th/wp-json/asw-api/v1/getProjectGallery';
    $data = ['url' => $url];
    return fetch_from_api('GET', $endpoint, $data);
}

function get_active_projects() {
    $endpoint = API_BASE_URL . '/Project/GetProjects';
    return fetch_from_api('GET', $endpoint);
}

function get_project_name($projectCode) {
    $endpoint = API_BASE_URL . '/Project/GetProject';
    $data = ['projectID' => $projectCode];
    //log_api_request('GET', $endpoint, $data);
    return fetch_from_api('GET', $endpoint, $data);
}

function get_locations() {
    $endpoint = API_BASE_URL . '/Project/GetLocations';
    return fetch_from_api('GET', $endpoint);
}

function getCmpUtmByID($cmpID) {
    $endpoint = API_BASE_URL . '/Campaign/GetCampaignByID';
    $data = ['campaignID' => $cmpID];
    $res = fetch_from_api('GET', $endpoint, $data);
    return $res['data']['utm'];
}

?>

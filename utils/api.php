<?php

// Generic function to fetch data from an API
function fetch_from_api($method, $url, $data = false) {
    $curl = curl_init();

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, true);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
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
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    // Execution
    $result = curl_exec($curl);
    if ($result === false) {
        // Handle cURL errors
        $error_message = curl_error($curl);
        $error_no = curl_errno($curl);
        curl_close($curl);
        return ['error' => true, 'message' => "cURL Error ({$error_no}): " . $error_message];
    }
    curl_close($curl);
    
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
if (!empty($_REQUEST['action'])) {
    header('Content-Type: application/json'); // Set content type to JSON for AJAX responses
    $action = $_REQUEST['action'];
    $response = null;

    switch ($action) {
        case 'get_units':
            // You might want to sanitize or validate parameters from $_REQUEST
            $params = isset($_REQUEST['params']) && is_array($_REQUEST['params']) ? $_REQUEST['params'] : array();
            $response = get_units($params);
            break;
        // Add more cases for other functions you want to expose via AJAX
        default:
            $response = ['error' => true, 'message' => 'Invalid action specified.'];
            http_response_code(400); // Bad Request
            break;
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
        $project = array_shift($filtered_projects); // Get the first matching project
        return isset($project['ProjectName']) ? $project['ProjectName'] : null; // Check if ProjectName exists
    } else {
        return null; // No project found with that code
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

?>

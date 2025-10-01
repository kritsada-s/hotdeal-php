<?php

require_once __DIR__ . '/bootstrap.php';
include_once __DIR__ . '/mail.php';
include_once __DIR__ . '/api.php';

// Log function for debugging
function log_cis_request($data, $response = null, $error = null) {
    $log_file = __DIR__ . '/cis_debug.log';
    $log_data = [
        'timestamp' => date('Y-m-d H:i:s'),
        'request_data' => $data,
        'response' => $response,
        'error' => $error,
        'post_data' => $_POST
    ];
    error_log(print_r($log_data, true) . "\n", 3, $log_file);
}

// Validate required POST fields
$required_fields = ['ProjectID', 'RefID', 'Fname', 'Lname', 'Tel', 'Email', 'Ref', 'unitID'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    $error_response = [
        'error' => true,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields),
        'received_data' => $_POST
    ];
    log_cis_request($_POST, null, $error_response['message']);
    header('Content-Type: application/json');
    echo json_encode($error_response);
    exit;
}

// Sanitize and validate input data
$projectID = filter_var($_POST['ProjectID'], FILTER_SANITIZE_NUMBER_INT);
$refID = htmlspecialchars($_POST['RefID'], ENT_QUOTES, 'UTF-8');
$fname = htmlspecialchars($_POST['Fname'], ENT_QUOTES, 'UTF-8');
$lname = htmlspecialchars($_POST['Lname'], ENT_QUOTES, 'UTF-8');
$tel = preg_replace('/[^0-9]/', '', $_POST['Tel']); // Only digits
$email = filter_var($_POST['Email'], FILTER_SANITIZE_EMAIL);
$ref = htmlspecialchars($_POST['Ref'], ENT_QUOTES, 'UTF-8');
$unitID = htmlspecialchars($_POST['unitID'], ENT_QUOTES, 'UTF-8');
$projectName = htmlspecialchars($_POST['projectName'], ENT_QUOTES, 'UTF-8');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error_response = [
        'error' => true,
        'message' => 'Invalid email address'
    ];
    header('Content-Type: application/json');
    echo json_encode($error_response);
    exit;
}

// Validate phone number (Thai format: 10 digits starting with 0)
if (!preg_match('/^0[0-9]{9}$/', $tel)) {
    $error_response = [
        'error' => true,
        'message' => 'Invalid phone number format'
    ];
    header('Content-Type: application/json');
    echo json_encode($error_response);
    exit;
}

$data = [
    'ProjectID' => $projectID,
    'ContactChannelID' => 21, // Website
    'ContactTypeID' => 35, // Register
    'RefID' => $refID,
    'Fname' => $fname,
    'Lname' => $lname,
    'Tel' => $tel,
    'Email' => $email,
    'Ref' => $ref,
    'RefDate' => date('Y-m-d H:i:s', strtotime('+7 hours')), // GMT+7 Bangkok time
    'FollowUpID' => 42,
    'utm_source' => 'ASW_HotDeal_New_Website_' . $unitID,
    'FlagPersonalAccept' => 1,
    'FlagContactAccept' => 1,
];

// Log the data being sent
log_cis_request($data);

$curl = curl_init();

// Generate Basic Auth header from environment variables
$cis_auth = env('CIS_AUTH_TOKEN');

curl_setopt_array($curl, array(
    CURLOPT_URL => env('CIS_API_URL'),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30, // Set reasonable timeout
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => http_build_query($data),
    CURLOPT_HTTPHEADER => array(
        'Authorization: Basic ' . $cis_auth,
        'Content-Type: application/x-www-form-urlencoded',
    ),
));

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curl_error = curl_error($curl);

curl_close($curl);

// Handle cURL errors
if ($response === false) {
    $error_response = [
        'error' => true,
        'message' => 'cURL Error: ' . $curl_error,
        'sent_data' => $data
    ];
    log_cis_request($data, null, $curl_error);
    header('Content-Type: application/json');
    echo json_encode($error_response);
    exit;
}

// Handle HTTP errors
if ($http_code >= 400) {
    $error_response = [
        'error' => true,
        'message' => "HTTP Error: {$http_code}",
        'raw_response' => $response,
        'sent_data' => $data
    ];
    log_cis_request($data, $response, "HTTP Error: {$http_code}");
    header('Content-Type: application/json');
    echo json_encode($error_response);
    exit;
}

// Log successful response
log_cis_request($data, $response);

send_thank_you_email($email, 'ขอบคุณสำหรับการลงทะเบียน AssetWise Hot Deals', null, null, $unitID, $projectName);

// Return the response
header('Content-Type: application/json');
echo $response;

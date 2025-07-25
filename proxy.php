<?php

// upload this file to your web server and run it via `php -S localhost:8080 proxy.php` or at any other port.

// Allow browser access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-NC-Url");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Require NC base URL from custom header
if (!isset($_SERVER['HTTP_X_NC_URL'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing X-NC-Url header"]);
    exit;
}

$ncUrl = rtrim($_SERVER['HTTP_X_NC_URL'], '/');

// Decode Basic Auth
if (!isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
    http_response_code(401);
    header('WWW-Authenticate: Basic realm="Nextcloud Proxy"');
    echo json_encode(["error" => "Missing Basic Auth"]);
    exit;
}

$username = $_SERVER['PHP_AUTH_USER'];
$password = $_SERVER['PHP_AUTH_PW'];

// Get API path
$apiPath = $_GET['path'] ?? '';
if (preg_match('/[^a-zA-Z0-9\-\/_\.]/', $apiPath)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid path"]);
    exit;
}

$targetUrl = "$ncUrl/index.php/apps/maps/api/1.0/$apiPath";

// Setup cURL
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);

// Handle request body
$input = file_get_contents('php://input');
if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Return response to browser
header("Content-Type: $contentType");
http_response_code($httpCode);
echo $response;

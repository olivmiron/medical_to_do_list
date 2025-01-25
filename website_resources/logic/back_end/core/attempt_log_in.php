<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/Composer/vendor/autoload.php";

$client = new Google_Client(['client_id' => 'YOUR_GOOGLE_CLIENT_ID']);
$id_token = json_decode(file_get_contents('php://input'), true)['id_token'];

try {
    $payload = $client->verifyIdToken($id_token);
    if ($payload) {
        $userid = $payload['sub'];
        // Create or update user session
        $_SESSION['logged_in'] = true;
        $_SESSION['user_id'] = $userid;
        $_SESSION['user_name'] = $payload['name'];
        $_SESSION['user_email'] = $payload['email'];
        echo json_encode(['success' => true, 'user_name' => $_SESSION['user_name']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid ID token']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

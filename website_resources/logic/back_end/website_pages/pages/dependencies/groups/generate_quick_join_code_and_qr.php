<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/other/libraries/qr_code_generator/phpqrcode.php";

if (!$_SESSION["logged_in"]) {
    echo json_encode(["error" => "User not logged in"]);
    die;
}

$group_id = $_GET['group_id'];
$user_id = $_SESSION['user_id'];

// Check if the group exists and if the user is a member of the group
$stmt = $conn->prepare("SELECT COUNT(*) FROM groups WHERE id = ? AND id IN (SELECT group_id FROM groups_members WHERE member_id = ?)");
$stmt->bind_param("ii", $group_id, $user_id);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close(); // Close the statement to avoid "Commands out of sync" error

if ($count < 1) {
    echo json_encode(["error" => "Group does not exist or user is not a member of the group"]);
    die;
}

// Generate a random quick join code
$quick_join_code = strtoupper(bin2hex(random_bytes(8))); // 16-character code

// Insert the token into the database
$stmt = $conn->prepare("INSERT INTO groups_entry_tokens (group_id, token, date_created) VALUES (?, ?, NOW())");
$stmt->bind_param("is", $group_id, $quick_join_code);
$stmt->execute();

$token_entry_id = $stmt->insert_id;
$stmt->close(); // Close the statement after execution

$url_parameter = [
    "id" => $group_id, 
    "token" => $quick_join_code
];

$qr_code_content = "https://" . $_SERVER["HTTP_HOST"] . "/index.php?join_group_token=" . urlencode(json_encode($url_parameter));
$qr_code_path = $_SERVER['DOCUMENT_ROOT'] . '/content_resources/quick_join_qr_codes/' . $token_entry_id . ".png";

// // Create empty file
// touch($qr_code_path);

QRcode::png($qr_code_content, $qr_code_path);
// Create the directory if it doesn't exist



echo json_encode(
    [
        "response" => "success", 
        "token_entry_id" => $token_entry_id
    ]
);

?>

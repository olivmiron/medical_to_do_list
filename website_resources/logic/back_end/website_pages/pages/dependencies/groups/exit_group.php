<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $group_id = $input['group_id'];} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

if (empty($group_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Group ID is required.']);
    exit;
}

// Check if the user is a member of the group
$stmt = $conn->prepare("SELECT id FROM groups_members WHERE group_id = ? AND member_id = ?");
$stmt->bind_param("ii", $group_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'You are not a member of this group.']);
    exit;
}

// Remove the user from the group
$stmt = $conn->prepare("DELETE FROM groups_members WHERE group_id = ? AND member_id = ?");
$stmt->bind_param("ii", $group_id, $user_id);
if ($stmt->execute()) {} 
else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to exit the group.']);
    exit;
}

$was_default_group = false;

// Check if the exited group was the default group
if ($_SESSION['default_group_id'] == $group_id) {
    // Update the default group to ''
    $stmt = $conn->prepare("UPDATE accounts SET default_group_id = '' WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    if ($stmt->execute()) {
        $_SESSION['default_group_id'] = '';
        $was_default_group = true;
    }
}

echo json_encode(['status' => 'success', 'message' => 'Successfully exited the group.', 'was_default_group' => $was_default_group]);

?>

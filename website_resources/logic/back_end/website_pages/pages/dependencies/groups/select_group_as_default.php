<?php
$initial_load = false;require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$data = json_decode(file_get_contents('php://input'), true);
$group_id = $data['group_id'];
$user_id = $_SESSION['user_id'];

// Check if the user is a member of the group
$stmt = $conn->prepare("
    SELECT g.group_name
    FROM groups_members gm
    INNER JOIN groups g ON gm.group_id = g.id
    WHERE gm.group_id = ? AND gm.member_id = ?
");
$stmt->bind_param("ii", $group_id, $user_id);
$stmt->execute();
$stmt->bind_result($group_name);
$stmt->fetch();
$stmt->close();

if ($group_name) {
    // Update the default group
    $stmt = $conn->prepare("
        UPDATE accounts 
        SET default_group_id = ? 
        WHERE id = ?
    ");
    $stmt->bind_param("ii", $group_id, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Default group updated successfully.', 'group_name' => $group_name]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update default group.']);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'User is not a member of the group.']);
}

$conn->close();
?>

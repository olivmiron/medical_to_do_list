<?php
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

// Get the default group ID for the user
$default_group_id = $_SESSION['default_group_id'];

if ($default_group_id) {
    // Check if the user is a member of the default group and get the group name
    $stmt = $conn->prepare("
        SELECT g.group_name
        FROM groups_members gm
        INNER JOIN groups g ON gm.group_id = g.id
        WHERE gm.group_id = ? AND gm.member_id = ?
    ");
    $stmt->bind_param("ii", $default_group_id, $user_id);
    $stmt->execute();
    $stmt->bind_result($group_name);
    $stmt->fetch();

    if ($group_name) {
        $get_group_name = json_encode(['status' => 'success', 'group_name' => $group_name]);
    } else {
        $get_group_name = json_encode(['status' => 'error', 'message' => 'User is not a member of the default group.']);
    }
} else {
    $get_group_name = json_encode(['status' => 'error', 'message' => 'No default group set for the user.']);
}

?>

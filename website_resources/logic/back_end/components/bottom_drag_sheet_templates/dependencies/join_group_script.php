<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $group_name = $_POST['group_name'];
    $group_password = $_POST['group_password'];

    if (empty($group_name) || empty($group_password)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, password FROM groups WHERE name = ?");
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Group not found.']);
        exit;
    }

    $group = $result->fetch_assoc();
    if (!password_verify($group_password, $group['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
        exit;
    }

    $group_id = $group["id"];

    // Verify that the user is not already a member of the group
    $stmt = $conn->prepare("SELECT id FROM group_members WHERE group_id = ? AND user_id = ?");
    $stmt->bind_param("ii", $group_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'You are already a member of this group.']);
        exit;
    }

    // Make user a member of the group
    $stmt = $conn->prepare("INSERT INTO group_members (group_id, user_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $group_id, $user_id);
    if ($stmt->execute()) {

        // Set the joined group as the default group for the user
        $stmt = $conn->prepare("UPDATE users SET default_group_id = ? WHERE id = ?");
        $stmt->bind_param("ii", $group_id, $user_id);

        if ($stmt->execute()) {
            $_SESSION['default_group_id'] = $group_id;
            
            $group_row_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/groups/group_row.html');

            // Replace the ID and name with the newly created group
            $group_row_html = str_replace(
                [
                    "{{group_id}}", 
                    "{{default_group_or_not}}", 
                    "{{group_name}}"
                ],
                [
                    $group_id, 
                    "settings_group_row_selected",
                    $group_name
                ],
                $group_row_template
            );

            echo json_encode(['status' => 'success', 'message' => 'Successfully joined the group and set as default.', 'group_row_html' => base64_encode($group_row_html)]);
        } 
        else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to set the group as default.']);
        }
    } 
    else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to join the group.']);
    }
} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>

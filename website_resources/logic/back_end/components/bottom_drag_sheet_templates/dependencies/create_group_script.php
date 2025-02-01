<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $group_name = $input['group_name'];
    $group_password = $input['group_password'];

    if (empty($group_name) || empty($group_password) || strlen($group_password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required and password must be at least 6 characters.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM groups WHERE group_name = ?");
    $stmt->bind_param("s", $group_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Group name already exists.']);
        exit;
    }

    $hashed_password = password_hash($group_password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO groups (group_name, password, date_created) VALUES (?, ?, NOW())");
    $stmt->bind_param("ss", $group_name, $hashed_password);

    if ($stmt->execute()) {
        $group_id = $stmt->insert_id;

        // Make the user a member of the new group
        $stmt = $conn->prepare("INSERT INTO groups_members (group_id, member_id, date_joined) VALUES (?, ?, NOW())");
        $stmt->bind_param("ii", $group_id, $user_id);
        if ($stmt->execute()) {

            // Set the new group as the default group for the user
            $stmt = $conn->prepare("UPDATE users SET default_group_id = ? WHERE id = ?");
            $stmt->bind_param("ii", $group_id, $user_id);

            if ($stmt->execute()) {
                $_SESSION['default_group_id'] = $group_id;

                // Get the HTML of a settings group row
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

                echo json_encode(['status' => 'success', 'message' => 'Group created and set as default.', 'group_row_html' => base64_encode($group_row_html)]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to set the group as default.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add user to the group.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create the group.']);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>

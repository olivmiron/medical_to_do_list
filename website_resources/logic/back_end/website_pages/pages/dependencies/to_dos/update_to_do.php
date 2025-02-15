<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to_do_id = $_POST['to_do_id'];
    $to_do_title = $_POST["to_do_title"];
    $to_do_description = $_POST["to_do_description"];
} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

if (empty($to_do_id) or empty($to_do_title) or empty($to_do_description)) {
    echo json_encode(['status' => 'error', 'message' => 'To do ID is required.']);
    exit;
}

// Get the group ID for this to-do
$stmt = $conn->prepare("SELECT personal_or_group_id FROM to_dos WHERE id = ?");
$stmt->bind_param("i", $to_do_id);
$stmt->execute();
$result = $stmt->get_result();
$todo = $result->fetch_assoc();
$stmt->close();

if ($todo['personal_or_group_id'] != "0") {
    // Check if user is member of the group
    $stmt = $conn->prepare("SELECT id FROM groups_members WHERE group_id = ? AND member_id = ?");
    $stmt->bind_param("ii", $todo['personal_or_group_id'], $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'User not authorized to update this to-do']);
        exit;
    }
    $stmt->close();
}

// Prepare the SQL statement to update the to-do item
$stmt = $conn->prepare("UPDATE to_dos SET title = ?, description = ? WHERE id = ?");
$stmt->bind_param("ssi", $to_do_title, $to_do_description, $to_do_id);
$stmt->execute();
$stmt->close();


echo json_encode(['status' => 'success']);


?>
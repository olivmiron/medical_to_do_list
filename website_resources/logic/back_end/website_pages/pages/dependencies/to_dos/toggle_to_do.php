<?php
$initial_load = false; require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$input = json_decode(file_get_contents('php://input'), true);
$to_do_id = $_POST['to_do_id'];
$user_id = $_SESSION['user_id'];

// Check if the to-do item exists and belongs to the user
$stmt = $conn->prepare("SELECT to_do_done FROM to_dos WHERE id = ? AND creator_user_id = ?");
$stmt->bind_param("ii", $to_do_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'To-do item not found or access denied']);
    exit;
}

$row = $result->fetch_assoc();
$new_status = $row['to_do_done'] == 0 ? 1 : 0;

// Update the to-do item's status
$stmt = $conn->prepare("UPDATE to_dos SET to_do_done = ? WHERE id = ? AND creator_user_id = ?");
$stmt->bind_param("iii", $new_status, $to_do_id, $user_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['status' => 'success', 'new_status' => $new_status]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update to-do item']);
}

$stmt->close();
$conn->close();
?>

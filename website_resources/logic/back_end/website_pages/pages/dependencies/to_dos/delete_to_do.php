<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $to_do_id = $input['to_do_id'];} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

if (empty($to_do_id)) {
    echo json_encode(['status' => 'error', 'message' => 'To do ID is required.']);
    exit;
}

//NEED_TO_DO DONE: need to check: if personal to do - if was written bby user; if group to do - if user is a member of the group
// check if personal or group to do in the back end

// - change of mind: only creator of to do is able to delete it


$stmt = $conn->prepare("SELECT creator_user_id FROM to_dos WHERE id = ?");
$stmt->bind_param("i", $to_do_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
 
if($row["creator_user_id"] != $_SESSION["user_id"]) {   
    echo json_encode(["status" => "error", "message" => "User is not allowed to delete the to do."]);
    exit;
}

// Update the to do to make it invisible instead of deleting it
$stmt = $conn->prepare("UPDATE to_dos SET visible = 0 WHERE id = ?");
$stmt->bind_param("i", $to_do_id);
$stmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Successfully deleted the to do']);

?>

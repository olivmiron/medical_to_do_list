<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $to_do_id = $input['to_do_id'];} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

if (empty($to_do_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Group ID is required.']);
    exit;
}

//NEED_TO_DO: need to check: if personal to do - if was written bby user; if group to do - if user is a member of the group
// check if personal or group to do in the back end


$stmt = $conn->prepare("DELETE FROM to_dos WHERE to_do_id = ?");
$stmt->bind_param("ii", $to_do_id);
$stmt->execute();
$result = $stmt->get_result();

 

echo json_encode(['status' => 'success', 'message' => 'Successfully deleted the to do']);

?>

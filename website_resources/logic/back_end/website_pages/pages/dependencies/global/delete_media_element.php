<?php
$initial_load = false;
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $media_element_id = $input['media_element_id'];} 
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

if (empty($media_element_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Media element ID is required.']);
    exit;
}

//NEED_TO_DO DONE: need to check: if personal to do - if was written bby user; if group to do - if user is a member of the group
// check if personal or group to do in the back end

// - change of mind: only creator of to do is able to delete it


// VERIFY IF USER IS ABLE TO DELETE THIS MEDIA ELEMENT

// Update the to do to make it invisible instead of deleting it
$stmt = $conn->prepare("UPDATE added_content SET visible = 0 WHERE id = ?");
$stmt->bind_param("i", $media_element_id);
$stmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Successfully deleted the media element']);

?>

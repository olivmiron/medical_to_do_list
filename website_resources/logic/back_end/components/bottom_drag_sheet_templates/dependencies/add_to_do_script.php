<?php $initial_load = false; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php";

require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if (!$_SERVER['REQUEST_METHOD'] === 'POST') {

    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$creator_user_id = $_SESSION['user_id'];
$title = $input['to_do_text'];
$description = $input['to_do_description'];
$personal_or_group_id = ($input["group_or_personal"] == "group" ? $_SESSION["default_group_id"] : 0);
$date_created = date('Y-m-d H:i:s');

$stmt = $conn->prepare("INSERT INTO to_dos (creator_user_id, title, description, date_created, personal_or_group_id, to_do_done, due_or_not, due_date, visible) VALUES (?, ?, ?, ?, ?, 0, 0, NULL, 1)");
$stmt->bind_param("isssi", $creator_user_id, $title, $description, $date_created, $personal_or_group_id);

if ($stmt->execute()) {
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add to-do item."]);
    exit;
}

$to_do_id = $conn->insert_id;

$to_do_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/to_do.html');

$to_do_html = str_replace(
    [
        '{{to_do_id}}', 
        '{{to_do_date_created}}', 
        '{{to_do_creator_name}}',
        '{{to_do_title}}', 
        '{{to_do_description}}',
        'description_empty'
    ],
    [
        $to_do_id, 
        date('d M Y H:i', strtotime($date_created)), 
        $_SESSION["user_name"],
        $title, 
        $description,
        empty($description) ? 'description_empty' : ''
    ],
    $to_do_template
);

$response = [
    "status" => "success",
    "message" => "To-do item added successfully.",
    "to_do_html" => base64_encode($to_do_html)
];

echo json_encode($response);



$stmt->close();
$conn->close();

?>

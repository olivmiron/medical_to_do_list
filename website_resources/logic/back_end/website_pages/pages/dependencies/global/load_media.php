<?php
$initial_load = false; 
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if(!in_array($input['to_do_or_patient'], ['to_do', 'patient'])) {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
    exit;
}

$to_do_or_patient = $input['to_do_or_patient'] === 'to_do' ? 0 : 1;
$element_id = (int)$input['element_id'];
$content_elements_already_loaded = (int)$input['content_elements_already_loaded'];

$stmt = $conn->prepare("SELECT * FROM added_content WHERE patient_or_to_do = ? AND patient_or_to_do_id = ? AND visible = 1 ORDER BY date_added DESC LIMIT 5 OFFSET ?");
$stmt->bind_param("iii", $to_do_or_patient, $element_id, $content_elements_already_loaded);
$stmt->execute();
$result = $stmt->get_result();

$content_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/media_element.html');

$content_html = '';
$number_of_elements_loaded = 0;
while ($row = $result->fetch_assoc()) {$number_of_elements_loaded++;
    $content_html .= str_replace(
        [
            '{{media_element_id}}', 
            '{{media_element_date}}',
            '{{media_element_title}}',
            '{{media_element_media}}',
            "media_element_media_hidden", 
            '{{media_element_description}}', 
            "media_element_description_hidden"
        ],
        [
            $row['id'], 
            date('d M Y H:i', strtotime($row['date_added'])),
            $row['title'],
            $row["contains_media"] == "1" ? '<img src="/content_resources/media_content/images/' . $row['id'] . '.' . $row["media_extension"] . '"/>' : '',
            $row["contains_media"] == "1" ? "" : "media_element_media_hidden",
            $row['description'], 
            $row['description'] == "" or empty($row["description"]) ? "media_element_description_hidden" : ""
        ],
        $content_template
    );
}

$response = [
    "status" => "success",
    "content_html" => base64_encode($content_html), 
    "number_of_elements_loaded" => $number_of_elements_loaded
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>
